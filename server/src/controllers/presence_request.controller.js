import { matchedData } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { sequelize } from "../config/database.js";
import { Event } from "../models/event.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { PresenceRequest } from "../models/presence_request.model.js";
import { RequestError, sendControllerError } from "../helpers/request_error.helper.js";

// El emprendedor no crea eventos: solo pide estar presente en uno que la administración ya habilitó
export const requestPresence = async (req, res) => {
    try {
        const { id: eventId } = matchedData(req, { locations: ["params"] });
        const event = await Event.findByPk(eventId, { attributes: ["id", "ends_at"] });
        if (!event) {
            return res.status(404).json({ message: "Esa fecha no tiene un evento habilitado por la administración: solo podés solicitar presencia en eventos existentes" });
        }
        if (event.ends_at <= new Date()) {
            return res.status(409).json({ message: "Ese evento ya terminó: solo podés solicitar presencia en eventos próximos" });
        }
        const presenceRequest = await PresenceRequest.create({
            event_id: event.id,
            entrepreneur_profile_id: req.entrepreneurProfile.id
        });
        return res.status(201).json({
            message: "Solicitud enviada: queda pendiente hasta que la administración la revise",
            presenceRequest
        });
    } catch (error) {
        // El índice único (evento, emprendedor) es la garantía final contra solicitudes duplicadas
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "Ya enviaste una solicitud para este evento" });
        }
        console.error("Error al solicitar presencia en el evento:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const listPresenceRequests = async (req, res) => {
    try {
        const { status } = matchedData(req, { locations: ["query"] });
        const presenceRequests = await PresenceRequest.findAll({
            where: status ? { status } : {},
            include: [
                {
                    model: Event,
                    as: "event",
                    attributes: ["id", "title", "starts_at", "ends_at"],
                    include: { model: EventLocation, as: "location", attributes: ["id", "name"] }
                },
                { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] }
            ],
            order: [["createdAt", "ASC"]]
        });
        return res.status(200).json({ presenceRequests });
    } catch (error) {
        console.error("Error al obtener las solicitudes de presencia:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Al aprobar, el emprendedor pasa a figurar como confirmado en el calendario, el mapa y su perfil
export const reviewPresenceRequest = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const { status } = matchedData(req, { locations: ["body"] });

        const presenceRequest = await sequelize.transaction(async (transaction) => {
            const presenceRequest = await PresenceRequest.findByPk(id, { lock: transaction.LOCK.UPDATE, transaction });
            if (!presenceRequest) {
                throw new RequestError(404, "Solicitud no encontrada");
            }
            if (presenceRequest.status !== "pending") {
                throw new RequestError(409, "Esta solicitud ya fue revisada");
            }
            return await presenceRequest.update({ status, reviewed_at: new Date() }, { transaction });
        });

        return res.status(200).json({
            message: status === "approved" ? "Presencia confirmada" : "Solicitud de presencia rechazada",
            presenceRequest
        });
    } catch (error) {
        return sendControllerError(res, error, "Error al revisar la solicitud de presencia:");
    }
};
