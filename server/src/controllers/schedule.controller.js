import { matchedData } from "express-validator";
import { Op } from "sequelize";
import { Schedule } from "../models/schedule.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";

const scheduleIncludes = [
    { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] },
    { model: EventLocation, as: "location", attributes: ["id", "name", "latitude", "longitude"] }
];

const findEntrepreneurProfile = (userId) =>
    EntrepreneurProfile.findOne({ where: { user_id: userId }, attributes: ["id"] });

// Un emprendedor solo puede cargar horarios en ferias que figuran en su perfil
const attendsFair = (profile, eventLocationId) => profile.hasFair(eventLocationId);

// Por defecto devuelve la agenda próxima: horarios que todavía no terminaron
export const getSchedules = async (req, res) => {
    try {
        const { event_location_id, entrepreneur_id, from, to } = matchedData(req, { locations: ["query"] });
        const where = { end_time: { [Op.gte]: from || new Date() } };
        if (to) {
            where.start_time = { [Op.lte]: to };
        }
        if (event_location_id) {
            where.event_location_id = event_location_id;
        }
        if (entrepreneur_id) {
            where.entrepreneur_profile_id = entrepreneur_id;
        }
        const schedules = await Schedule.findAll({ where, include: scheduleIncludes, order: [["start_time", "ASC"]] });
        return res.status(200).json({ schedules });
    } catch (error) {
        console.error("Error al obtener la agenda de ferias:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const createSchedule = async (req, res) => {
    try {
        const scheduleData = matchedData(req, { locations: ["body"] });
        const profile = await EntrepreneurProfile.findOne({ where: { user_id: req.userData.user_id } });
        if (!profile) {
            return res.status(403).json({ message: "Tu usuario no tiene un perfil de emprendedor" });
        }
        if (!(await attendsFair(profile, scheduleData.event_location_id))) {
            return res.status(400).json({ message: "Primero agregá esta feria a tu perfil para cargar horarios en ella" });
        }
        const newSchedule = await Schedule.create({ ...scheduleData, entrepreneur_profile_id: profile.id });
        return res.status(201).json({ message: "Horario creado con éxito", schedule: newSchedule });
    } catch (error) {
        console.error("Error al crear el horario:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.resource lo carga el middleware isScheduleOwner
export const updateSchedule = async (req, res) => {
    try {
        const scheduleData = matchedData(req, { locations: ["body"] });
        if (Object.keys(scheduleData).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const schedule = req.resource;
        const startTime = scheduleData.start_time ?? schedule.start_time;
        const endTime = scheduleData.end_time ?? schedule.end_time;
        if (endTime <= startTime) {
            return res.status(400).json({ message: "La hora de fin debe ser posterior a la de inicio" });
        }
        if (scheduleData.event_location_id && scheduleData.event_location_id !== schedule.event_location_id) {
            const profile = await EntrepreneurProfile.findByPk(schedule.entrepreneur_profile_id);
            if (!(await attendsFair(profile, scheduleData.event_location_id))) {
                return res.status(400).json({ message: "Primero agregá esta feria a tu perfil para cargar horarios en ella" });
            }
        }
        const updatedSchedule = await schedule.update(scheduleData);
        return res.status(200).json({ message: "Horario actualizado con éxito", schedule: updatedSchedule });
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        await req.resource.destroy();
        return res.status(200).json({ message: "Horario eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
