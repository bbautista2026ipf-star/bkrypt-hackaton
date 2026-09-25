import { matchedData } from "express-validator";
import { Op } from "sequelize";
import { Product } from "../models/product.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { Review } from "../models/review.model.js";
import { ratingAttributes, formatProductRating } from "../helpers/rating.helper.js";
import { distanceInKm, distanceToNearestPoint, roundDistance, toCoordinates } from "../helpers/geo.helper.js";
import { findUpcomingConfirmedEvents } from "../helpers/event.helper.js";

// Datos del emprendedor que necesita la tarjeta de producto para ofrecer el contacto
const entrepreneurContactInclude = {
    model: EntrepreneurProfile,
    as: "entrepreneur",
    attributes: ["id", "brand_name", "whatsapp_number", "contact_email"]
};

const buildProductFilters = ({ category, available, search }) => {
    const where = {};
    if (category) {
        where.category = category;
    }
    // La disponibilidad se deriva del stock: disponible significa stock mayor a 0
    if (available !== undefined) {
        where.stock = available ? { [Op.gt]: 0 } : 0;
    }
    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    return where;
};

const findCatalogProducts = (filters) => Product.findAll({
    where: buildProductFilters(filters),
    attributes: { include: ratingAttributes() },
    include: entrepreneurContactInclude,
    order: [["createdAt", "DESC"]]
});

// Puntos donde se puede encontrar a cada emprendedor: su local, sus ferias habituales y los eventos confirmados próximos
const findEntrepreneurPoints = async (entrepreneurIds, upcomingEvents) => {
    const profiles = await EntrepreneurProfile.findAll({
        where: { id: entrepreneurIds },
        attributes: ["id", "has_store", "store_latitude", "store_longitude"],
        include: { model: EventLocation, as: "fairs", attributes: ["latitude", "longitude"], through: { attributes: [] } }
    });
    const pointsByEntrepreneur = new Map(profiles.map((profile) => [
        profile.id,
        [
            profile.has_store ? toCoordinates(profile.store_latitude, profile.store_longitude) : null,
            ...profile.fairs.map((fair) => toCoordinates(fair.latitude, fair.longitude))
        ].filter(Boolean)
    ]));
    upcomingEvents.forEach((event) => {
        event.participants.forEach((participant) => {
            pointsByEntrepreneur.get(participant.id)?.push(event.location);
        });
    });
    return pointsByEntrepreneur;
};

const byDistance = (first, second) => {
    if (first.distance_km === null) {
        return 1;
    }
    if (second.distance_km === null) {
        return -1;
    }
    return first.distance_km - second.distance_km;
};

const isWithinRadius = (distance, radius) => !radius || (distance !== null && distance <= radius);

export const getProducts = async (req, res) => {
    try {
        const filters = matchedData(req, { locations: ["query"] });
        const products = await findCatalogProducts(filters);
        return res.status(200).json({ products: products.map(formatProductRating) });
    } catch (error) {
        console.error("Error al obtener el catálogo de productos:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Buscador avanzado: devuelve productos y eventos del mapa con los mismos filtros para que ambas vistas coincidan
export const searchProducts = async (req, res) => {
    try {
        const { lat, lng, radius, ...filters } = matchedData(req, { locations: ["query"] });
        const origin = lat !== undefined ? { latitude: lat, longitude: lng } : null;
        const hasProductFilters = Boolean(filters.category || filters.search || filters.available !== undefined);

        const [products, upcomingEvents] = await Promise.all([findCatalogProducts(filters), findUpcomingConfirmedEvents()]);

        let matchingProducts = products.map((product) => ({ ...formatProductRating(product), distance_km: null }));
        if (origin) {
            const entrepreneurIds = [...new Set(matchingProducts.map((product) => product.entrepreneur_profile_id))];
            const pointsByEntrepreneur = await findEntrepreneurPoints(entrepreneurIds, upcomingEvents);
            matchingProducts = matchingProducts
                .map((product) => ({
                    ...product,
                    distance_km: roundDistance(distanceToNearestPoint(origin, pointsByEntrepreneur.get(product.entrepreneur_profile_id) ?? []))
                }))
                .filter((product) => isWithinRadius(product.distance_km, radius))
                .sort(byDistance);
        }

        // Con filtros de producto, cada evento muestra solo a los emprendedores que tienen productos que coinciden (intersección)
        const matchingEntrepreneurIds = new Set(matchingProducts.map((product) => product.entrepreneur_profile_id));
        let matchingEvents = upcomingEvents
            .map((event) => {
                const participants = hasProductFilters
                    ? event.participants.filter((participant) => matchingEntrepreneurIds.has(participant.id))
                    : event.participants;
                return {
                    ...event,
                    participants,
                    participants_count: participants.length,
                    distance_km: origin ? roundDistance(distanceInKm(origin, event.location)) : null
                };
            })
            .filter((event) => event.participants_count > 0 && isWithinRadius(event.distance_km, radius));
        if (origin) {
            matchingEvents = matchingEvents.sort(byDistance);
        }

        return res.status(200).json({ products: matchingProducts, events: matchingEvents });
    } catch (error) {
        console.error("Error en la búsqueda de productos:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const product = await Product.findByPk(id, {
            attributes: { include: ratingAttributes() },
            include: [
                entrepreneurContactInclude,
                { model: Review, as: "reviews", attributes: ["id", "user_id", "stars", "comment", "createdAt", "updatedAt"] }
            ],
            order: [[{ model: Review, as: "reviews" }, "createdAt", "DESC"]]
        });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json({ product: formatProductRating(product) });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.entrepreneurProfile lo carga el middleware attachEntrepreneurProfile
export const createProduct = async (req, res) => {
    try {
        const productData = matchedData(req, { locations: ["body"] });
        const newProduct = await Product.create({ ...productData, entrepreneur_profile_id: req.entrepreneurProfile.id });
        return res.status(201).json({ message: "Producto publicado con éxito", product: newProduct });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.product lo carga el middleware isProductOwner
export const updateProduct = async (req, res) => {
    try {
        const productData = matchedData(req, { locations: ["body"] });
        if (Object.keys(productData).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const updatedProduct = await req.product.update(productData);
        return res.status(200).json({ message: "Producto actualizado con éxito", product: updatedProduct });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await req.product.destroy();
        return res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
