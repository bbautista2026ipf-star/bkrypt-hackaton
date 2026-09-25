import { matchedData } from "express-validator";
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
