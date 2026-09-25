import { matchedData } from "express-validator";
import { EventLocation } from "../models/event_location.model.js";

export const getEventLocations = async (req, res) => {
    try {
        const eventLocations = await EventLocation.findAll({ order: [["name", "ASC"]] });
        return res.status(200).json({ eventLocations });
    } catch (error) {
        console.error("Error al obtener las ferias:", error);
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
        await eventLocation.destroy();
        return res.status(200).json({ message: "Feria eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
