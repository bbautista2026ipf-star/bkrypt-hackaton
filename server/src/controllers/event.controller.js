import { matchedData } from "express-validator";
import { Event } from "../models/event.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { eventDetailsInclude, serializeEvent, isEventVisibleTo } from "../helpers/event.helper.js";

// Quién mira el calendario: define qué eventos y qué estado de solicitudes se le muestran
const buildViewer = async (userData) => {
    if (!userData) {
        return {};
    }
    if (userData.user_role !== "entrepreneur") {
        return { role: userData.user_role };
    }
    const profile = await EntrepreneurProfile.findOne({ where: { user_id: userData.user_id }, attributes: ["id"] });
    return { role: "entrepreneur", entrepreneurProfileId: profile?.id };
};

export const getEvents = async (req, res) => {
    try {
        const viewer = await buildViewer(req.userData);
        const events = await Event.findAll({ include: eventDetailsInclude, order: [["starts_at", "ASC"]] });
        const visibleEvents = events
            .map((event) => serializeEvent(event, viewer))
            .filter((event) => isEventVisibleTo(event, viewer));
        return res.status(200).json({ events: visibleEvents });
    } catch (error) {
        console.error("Error al obtener los eventos:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const viewer = await buildViewer(req.userData);
        const event = await Event.findByPk(id, { include: eventDetailsInclude });
        const serializedEvent = event ? serializeEvent(event, viewer) : null;
        // Un evento sin emprendedores confirmados no existe para el público: mismo 404 que uno inexistente
        if (!serializedEvent || !isEventVisibleTo(serializedEvent, viewer)) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        return res.status(200).json({ event: serializedEvent });
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const eventData = matchedData(req, { locations: ["body"] });
        const newEvent = await Event.create({ ...eventData, created_by: req.userData.user_id });
        const event = await Event.findByPk(newEvent.id, { include: eventDetailsInclude });
        return res.status(201).json({
            message: "Evento habilitado con éxito",
            event: serializeEvent(event, { role: "admin" })
        });
    } catch (error) {
        console.error("Error al crear el evento:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        await event.destroy();
        return res.status(200).json({ message: "Evento eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el evento:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
