import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { Product } from "../models/product.model.js";
import { ratingAttributes, formatProductRating } from "../helpers/rating.helper.js";

const publicProfileAttributes = [
    "id", "brand_name", "biography", "whatsapp_number",
    "has_store", "store_address", "store_latitude", "store_longitude"
];

export const getEntrepreneurById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const profile = await EntrepreneurProfile.findByPk(id, {
            attributes: publicProfileAttributes,
            include: [
                { model: EventLocation, as: "fairs", attributes: ["id", "name", "latitude", "longitude"], through: { attributes: [] } },
                // "products" es el alias de la tabla dentro de la consulta, lo necesita el cálculo del promedio
                { model: Product, as: "products", attributes: { include: ratingAttributes("products") } }
            ],
            order: [[{ model: Product, as: "products" }, "createdAt", "DESC"]]
        });
        if (!profile) {
            return res.status(404).json({ message: "Emprendedor no encontrado" });
        }
        const entrepreneur = profile.toJSON();
        entrepreneur.products = entrepreneur.products.map(formatProductRating);
        return res.status(200).json({ entrepreneur });
    } catch (error) {
        console.error("Error al obtener el perfil del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Combina lo enviado con lo que el perfil ya tiene guardado para validar el estado final
const resolveLocationChanges = (profile, changes) => {
    const hasStore = changes.has_store ?? profile.has_store;
    const store = {
        store_address: changes.store_address ?? profile.store_address,
        store_latitude: changes.store_latitude ?? profile.store_latitude,
        store_longitude: changes.store_longitude ?? profile.store_longitude
    };
    const fairIds = changes.event_location_ids !== undefined
        ? [...new Set(changes.event_location_ids)]
        : profile.fairs.map((fair) => fair.id);

    if (hasStore && Object.values(store).some((value) => value === null || value === undefined)) {
        return { error: "Para indicar un local, cargá su dirección, latitud y longitud" };
    }
    if (!hasStore && fairIds.length === 0) {
        return { error: "Si no tenés local, indicá al menos una feria a la que asistís" };
    }
    return {
        hasStore,
        fairIds,
        storeFields: hasStore ? store : { store_address: null, store_latitude: null, store_longitude: null }
    };
};

export const updateMyProfile = async (req, res) => {
    try {
        const changes = matchedData(req, { locations: ["body"] });
        if (Object.keys(changes).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const profile = await EntrepreneurProfile.findOne({
            where: { user_id: req.userData.user_id },
            include: { model: EventLocation, as: "fairs", attributes: ["id"], through: { attributes: [] } }
        });
        if (!profile) {
            return res.status(404).json({ message: "Tu usuario no tiene un perfil de emprendedor" });
        }

        const location = resolveLocationChanges(profile, changes);
        if (location.error) {
            return res.status(400).json({ message: location.error });
        }

        const { event_location_ids, has_store, store_address, store_latitude, store_longitude, ...basicFields } = changes;
        await sequelize.transaction(async (transaction) => {
            await profile.update({ ...basicFields, has_store: location.hasStore, ...location.storeFields }, { transaction });
            if (event_location_ids !== undefined) {
                await profile.setFairs(location.fairIds, { transaction });
            }
        });

        const updatedProfile = await EntrepreneurProfile.findByPk(profile.id, {
            attributes: publicProfileAttributes,
            include: { model: EventLocation, as: "fairs", attributes: ["id", "name", "latitude", "longitude"], through: { attributes: [] } }
        });
        return res.status(200).json({ message: "Perfil actualizado con éxito", entrepreneur: updatedProfile });
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
