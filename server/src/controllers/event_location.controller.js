import { matchedData } from "express-validator";
import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { EventLocation } from "../models/event_location.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { Schedule } from "../models/schedule.model.js";
import { FairSession } from "../models/fair_session.model.js";

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

// Jornadas oficiales que todavía no terminaron: son las que el administrador puede editar
const upcomingSessionsInclude = () => ({
    model: FairSession,
    as: "sessions",
    required: false,
    where: { end_time: { [Op.gte]: new Date() } }
});

const sessionsOrder = [{ model: FairSession, as: "sessions" }, "start_time", "ASC"];

const findWithUpcomingSessions = (id) =>
    EventLocation.findByPk(id, { include: upcomingSessionsInclude(), order: [sessionsOrder] });

// Solo se toman las fechas de cada jornada: cualquier otro dato que venga en la lista se ignora
const toSessionRows = (sessions, eventLocationId) => sessions.map((session) => ({
    event_location_id: eventLocationId,
    start_time: new Date(session.start_time),
    end_time: new Date(session.end_time)
}));

// Reemplaza las jornadas próximas de la feria; las que ya terminaron quedan como historial de la agenda
const replaceUpcomingSessions = async (eventLocationId, sessions, transaction) => {
    await FairSession.destroy({
        where: { event_location_id: eventLocationId, end_time: { [Op.gte]: new Date() } },
        transaction
    });
    if (sessions.length > 0) {
        await FairSession.bulkCreate(toSessionRows(sessions, eventLocationId), { transaction });
    }
};

export const getEventLocations = async (req, res) => {
    try {
        const eventLocations = await EventLocation.findAll({
            include: upcomingSessionsInclude(),
            order: [["name", "ASC"], sessionsOrder]
        });
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
                },
                upcomingSessionsInclude()
            ],
            order: [[{ model: Schedule, as: "schedules" }, "start_time", "ASC"], sessionsOrder]
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

// Pública: jornadas oficiales para la agenda y el mapa (por defecto, las que todavía no terminaron)
export const getFairSessions = async (req, res) => {
    try {
        const { from } = matchedData(req, { locations: ["query"] });
        const sessions = await FairSession.findAll({
            where: { end_time: { [Op.gte]: from || new Date() } },
            include: { model: EventLocation, as: "location", attributes: ["id", "name", "latitude", "longitude"] },
            order: [["start_time", "ASC"]]
        });
        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error al obtener las jornadas de las ferias:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const createEventLocation = async (req, res) => {
    try {
        const { sessions = [], ...eventLocationData } = matchedData(req, { locations: ["body"] });
        const newEventLocationId = await sequelize.transaction(async (transaction) => {
            const newEventLocation = await EventLocation.create(eventLocationData, { transaction });
            await replaceUpcomingSessions(newEventLocation.id, sessions, transaction);
            return newEventLocation.id;
        });
        const eventLocation = await findWithUpcomingSessions(newEventLocationId);
        return res.status(201).json({ message: "Feria creada con éxito", eventLocation });
    } catch (error) {
        console.error("Error al crear la feria:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const updateEventLocation = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const { sessions, ...eventLocationData } = matchedData(req, { locations: ["body"] });
        if (Object.keys(eventLocationData).length === 0 && sessions === undefined) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const eventLocation = await EventLocation.findByPk(id);
        if (!eventLocation) {
            return res.status(404).json({ message: "Feria no encontrada" });
        }
        await sequelize.transaction(async (transaction) => {
            await eventLocation.update(eventLocationData, { transaction });
            // Sin "sessions" en el body las jornadas no se tocan; una lista vacía las quita todas
            if (sessions !== undefined) {
                await replaceUpcomingSessions(id, sessions, transaction);
            }
        });
        const updatedEventLocation = await findWithUpcomingSessions(id);
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
