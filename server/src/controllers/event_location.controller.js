import { matchedData } from "express-validator";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { EventLocation } from "../models/event_location.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { Schedule } from "../models/schedule.model.js";

// Emprendedores sin local cuya única feria es la indicada: se quedarían sin ubicación si se borrara
const countEntrepreneursOnlyAtFair = async (eventLocationId) => {
    const [result] = await sequelize.query(
        `SELECT COUNT(*) AS total
         FROM entrepreneur_event_locations AS eel
         JOIN entrepreneur_profiles AS ep ON ep.id = eel.entrepreneur_profile_id
         WHERE eel.event_location_id = :eventLocationId
           AND ep.has_store = false
           AND (SELECT COUNT(*) FROM entrepreneur_event_locations AS other
                WHERE other.entrepreneur_profile_id = ep.id) = 1`,
        { replacements: { eventLocationId }, type: QueryTypes.SELECT }
    );
    return Number(result.total);
};

export const getEventLocations = async (req, res) => {
    try {
        const eventLocations = await EventLocation.findAll({ order: [["name", "ASC"]] });
        return res.status(200).json({ eventLocations });
    } catch (error) {
        console.error("Error al obtener las ferias:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getEventLocationById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const eventLocation = await EventLocation.findByPk(id, {
            include: [
                { model: EntrepreneurProfile, as: "entrepreneurs", attributes: ["id", "brand_name"], through: { attributes: [] } },
                {
                    model: Schedule,
                    as: "schedules",
                    required: false,
                    where: { end_time: { [Op.gte]: new Date() } },
                    include: { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] }
                }
            ],
            order: [[{ model: Schedule, as: "schedules" }, "start_time", "ASC"]]
        });
        if (!eventLocation) {
            return res.status(404).json({ message: "Feria no encontrada" });
        }
        return res.status(200).json({ eventLocation });
    } catch (error) {
        console.error("Error al obtener la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const createEventLocation = async (req, res) => {
    try {
        const eventLocationData = matchedData(req, { locations: ["body"] });
        const newEventLocation = await EventLocation.create(eventLocationData);
        return res.status(201).json({ message: "Feria creada con éxito", eventLocation: newEventLocation });
    } catch (error) {
        console.error("Error al crear la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const updateEventLocation = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const eventLocationData = matchedData(req, { locations: ["body"] });
        if (Object.keys(eventLocationData).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const eventLocation = await EventLocation.findByPk(id);
        if (!eventLocation) {
            return res.status(404).json({ message: "Feria no encontrada" });
        }
        const updatedEventLocation = await eventLocation.update(eventLocationData);
        return res.status(200).json({ message: "Feria actualizada con éxito", eventLocation: updatedEventLocation });
    } catch (error) {
        console.error("Error al actualizar la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteEventLocation = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const eventLocation = await EventLocation.findByPk(id);
        if (!eventLocation) {
            return res.status(404).json({ message: "Feria no encontrada" });
        }
        const strandedCount = await countEntrepreneursOnlyAtFair(id);
        if (strandedCount > 0) {
            return res.status(409).json({
                message: `No se puede eliminar: ${strandedCount} emprendedor(es) sin local quedarían sin ninguna feria`
            });
        }
        await eventLocation.destroy();
        return res.status(200).json({ message: "Feria eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
