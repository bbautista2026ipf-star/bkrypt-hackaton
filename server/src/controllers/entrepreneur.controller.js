import { matchedData } from "express-validator";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { Event } from "../models/event.model.js";
import { PresenceRequest } from "../models/presence_request.model.js";
import { Product } from "../models/product.model.js";
import { ratingAttributes, formatProductRating } from "../helpers/rating.helper.js";
import { toCoordinates } from "../helpers/geo.helper.js";
import { updateProfileData } from "../helpers/entrepreneur.helper.js";

const publicProfileAttributes = [
    "id", "brand_name", "biography", "whatsapp_number", "contact_email", "instagram_url", "facebook_url",
    "has_store", "store_address", "store_latitude", "store_longitude"
];

// Eventos confirmados (solicitud aprobada) que todavía no terminaron
const findUpcomingEventsOf = async (profileId) => {
    const presenceRequests = await PresenceRequest.findAll({
        where: { entrepreneur_profile_id: profileId, status: "approved" },
        attributes: ["id"],
        include: {
            model: Event,
            as: "event",
            where: { ends_at: { [Op.gte]: new Date() } },
            include: { model: EventLocation, as: "location", attributes: ["id", "name", "latitude", "longitude"] }
        },
        order: [[{ model: Event, as: "event" }, "starts_at", "ASC"]]
    });
    return presenceRequests.map(({ event }) => ({
        id: event.id,
        title: event.title,
        starts_at: event.starts_at,
        ends_at: event.ends_at,
        is_active_now: event.is_active_now,
        location: { id: event.location.id, name: event.location.name, ...toCoordinates(event.location.latitude, event.location.longitude) }
    }));
};

// Perfil con catálogo completo: lo usan el perfil público y "Mi catálogo"
const findProfileWithCatalog = async (profileId) => {
    const profile = await EntrepreneurProfile.findByPk(profileId, {
        attributes: publicProfileAttributes,
        include: [
            { model: EventLocation, as: "fairs", attributes: ["id", "name", "latitude", "longitude"], through: { attributes: [] } },
            // "products" es el alias de la tabla dentro de la consulta, lo necesita el cálculo del promedio
            { model: Product, as: "products", attributes: { include: ratingAttributes("products") } }
        ],
        order: [[{ model: Product, as: "products" }, "createdAt", "DESC"]]
    });
    if (!profile) {
        return null;
    }
    const entrepreneur = profile.toJSON();
    entrepreneur.products = entrepreneur.products.map(formatProductRating);
    entrepreneur.upcoming_events = await findUpcomingEventsOf(profileId);
    return entrepreneur;
};

export const getEntrepreneurById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const entrepreneur = await findProfileWithCatalog(id);
        if (!entrepreneur) {
            return res.status(404).json({ message: "Emprendedor no encontrado" });
        }
        return res.status(200).json({ entrepreneur });
    } catch (error) {
        console.error("Error al obtener el perfil del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.entrepreneurProfile lo carga el middleware attachEntrepreneurProfile
export const getOwnEntrepreneurProfile = async (req, res) => {
    try {
        const entrepreneur = await findProfileWithCatalog(req.entrepreneurProfile.id);
        return res.status(200).json({ entrepreneur });
    } catch (error) {
        console.error("Error al obtener el perfil propio del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const updateOwnEntrepreneurProfile = async (req, res) => {
    try {
        const businessData = matchedData(req, { locations: ["body"] });
        await sequelize.transaction((transaction) => updateProfileData(req.entrepreneurProfile, businessData, transaction));
        const entrepreneur = await findProfileWithCatalog(req.entrepreneurProfile.id);
        return res.status(200).json({ message: "Perfil actualizado con éxito", entrepreneur });
    } catch (error) {
        console.error("Error al actualizar el perfil del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getEntrepreneursWithStore = async (req, res) => {
    try {
        const entrepreneurs = await EntrepreneurProfile.findAll({
            where: { has_store: true },
            attributes: ["id", "brand_name", "store_address", "store_latitude", "store_longitude"],
            order: [["brand_name", "ASC"]]
        });
        return res.status(200).json({ entrepreneurs });
    } catch (error) {
        console.error("Error al obtener los emprendedores con local:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
