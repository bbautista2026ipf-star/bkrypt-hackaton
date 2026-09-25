import { Op } from "sequelize";
import { Event } from "../models/event.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { PresenceRequest, PRESENCE_REQUEST_STATUSES } from "../models/presence_request.model.js";
import { toCoordinates } from "./geo.helper.js";

export const eventDetailsInclude = [
    { model: EventLocation, as: "location", attributes: ["id", "name", "description", "latitude", "longitude"] },
    {
        model: PresenceRequest,
        as: "presenceRequests",
        attributes: ["id", "status", "entrepreneur_profile_id"],
        include: { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] }
    }
];

const countByStatus = (presenceRequests) => Object.fromEntries(
    PRESENCE_REQUEST_STATUSES.map((status) => [status, presenceRequests.filter((request) => request.status === status).length])
);

// Arma el evento según quién lo mira: el público solo ve emprendedores aprobados, nunca solicitudes pendientes o rechazadas.
// viewer = { role, entrepreneurProfileId }
export const serializeEvent = (event, viewer = {}) => {
    const { presenceRequests, location, created_by, ...eventData } = event.toJSON();
    const participants = presenceRequests
        .filter((request) => request.status === "approved")
        .map((request) => request.entrepreneur);

    const serializedEvent = {
        ...eventData,
        location: { ...location, ...toCoordinates(location.latitude, location.longitude) },
        participants,
        participants_count: participants.length
    };
    if (viewer.role === "admin") {
        serializedEvent.created_by = created_by;
        serializedEvent.requests_summary = countByStatus(presenceRequests);
    }
    if (viewer.role === "entrepreneur") {
        const ownRequest = presenceRequests.find((request) => request.entrepreneur_profile_id === viewer.entrepreneurProfileId);
        serializedEvent.my_request = ownRequest ? { id: ownRequest.id, status: ownRequest.status } : null;
    }
    return serializedEvent;
};

// Emprendedores y administradores ven todos los eventos habilitados (para solicitar o gestionar presencia);
// consumidores y visitantes, solo los confirmados: con al menos un emprendedor aprobado
export const isEventVisibleTo = (serializedEvent, viewer = {}) =>
    viewer.role === "admin" || viewer.role === "entrepreneur" || serializedEvent.participants_count > 0;

// Eventos confirmados que todavía no terminaron: son los que muestran el mapa y el perfil público del emprendedor
export const findUpcomingConfirmedEvents = async () => {
    const events = await Event.findAll({
        where: { ends_at: { [Op.gte]: new Date() } },
        include: eventDetailsInclude,
        order: [["starts_at", "ASC"]]
    });
    return events
        .map((event) => serializeEvent(event))
        .filter((event) => event.participants_count > 0);
};
