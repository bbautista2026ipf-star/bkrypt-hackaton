import { matchedData } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { Opinion } from "../models/opinion.model.js";
import { User } from "../models/user.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { notifyAdminOfReportedOpinion } from "../helpers/mail.helper.js";

const authorInclude = { model: User, as: "author", attributes: ["id", "name"] };

// El estado de reporte es interno: solo lo ve el emprendedor dueño del muro
const serializeOpinion = (opinion, includeReportState = false) => {
    const { is_reported, report_reason, reported_at, user_id, ...publicOpinion } = opinion.toJSON();
    return includeReportState ? { ...publicOpinion, is_reported } : publicOpinion;
};

const buildSummary = (opinions) => {
    const total = opinions.length;
    const average = total === 0 ? null : Math.round((opinions.reduce((sum, opinion) => sum + opinion.stars, 0) / total) * 10) / 10;
    return { average_rating: average, opinions_count: total };
};

export const getEntrepreneurOpinions = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const profile = await EntrepreneurProfile.findByPk(id, { attributes: ["id", "user_id"] });
        if (!profile) {
            return res.status(404).json({ message: "Emprendedor no encontrado" });
        }
        const opinions = await Opinion.findAll({
            where: { entrepreneur_profile_id: id },
            include: authorInclude,
            order: [["createdAt", "DESC"]]
        });
        const isOwner = req.userData?.user_id === profile.user_id;
        return res.status(200).json({
            summary: buildSummary(opinions),
            opinions: opinions.map((opinion) => serializeOpinion(opinion, isOwner))
        });
    } catch (error) {
        console.error("Error al obtener las opiniones del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Crea la opinión del usuario o, si ya había opinado sobre este emprendedor, la reemplaza
export const upsertOpinion = async (req, res) => {
    try {
        const { id: profileId } = matchedData(req, { locations: ["params"] });
        const { stars, comment } = matchedData(req, { locations: ["body"] });
        const userId = req.userData.user_id;

        const profile = await EntrepreneurProfile.findByPk(profileId, { attributes: ["id", "user_id"] });
        if (!profile) {
            return res.status(404).json({ message: "Emprendedor no encontrado" });
        }
        if (profile.user_id === userId) {
            return res.status(403).json({ message: "No podés opinar sobre tu propio emprendimiento" });
        }

        const existingOpinion = await Opinion.findOne({ where: { user_id: userId, entrepreneur_profile_id: profileId } });
        const savedOpinion = existingOpinion
            ? await existingOpinion.update({ stars, comment })
            : await Opinion.create({ user_id: userId, entrepreneur_profile_id: profileId, stars, comment });

        const opinion = await Opinion.findByPk(savedOpinion.id, { include: authorInclude });
        return res.status(existingOpinion ? 200 : 201).json({
            message: existingOpinion ? "Tu opinión fue actualizada" : "Gracias por tu opinión",
            opinion: serializeOpinion(opinion)
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "Ya registramos tu opinión sobre este emprendimiento" });
        }
        console.error("Error al guardar la opinión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.entrepreneurProfile lo carga el middleware attachEntrepreneurProfile
export const reportOpinion = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const { reason } = matchedData(req, { locations: ["body"] });

        const opinion = await Opinion.findByPk(id);
        if (!opinion) {
            return res.status(404).json({ message: "Opinión no encontrada" });
        }
        if (opinion.entrepreneur_profile_id !== req.entrepreneurProfile.id) {
            return res.status(403).json({ message: "Solo el emprendimiento que recibió la opinión puede reportarla" });
        }
        if (opinion.is_reported) {
            return res.status(409).json({ message: "Esta opinión ya fue reportada y está en revisión" });
        }
        await opinion.update({ is_reported: true, report_reason: reason, reported_at: new Date() });
        notifyAdminOfReportedOpinion(opinion, req.entrepreneurProfile.brand_name);
        return res.status(200).json({ message: "Reporte enviado: la administración va a revisar la opinión" });
    } catch (error) {
        console.error("Error al reportar la opinión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const listReportedOpinions = async (req, res) => {
    try {
        const opinions = await Opinion.findAll({
            where: { is_reported: true },
            include: [
                { model: User, as: "author", attributes: ["id", "name", "email"] },
                { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] }
            ],
            order: [["reported_at", "ASC"]]
        });
        return res.status(200).json({ opinions });
    } catch (error) {
        console.error("Error al obtener las opiniones reportadas:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const dismissOpinionReport = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const opinion = await Opinion.findByPk(id);
        if (!opinion) {
            return res.status(404).json({ message: "Opinión no encontrada" });
        }
        if (!opinion.is_reported) {
            return res.status(409).json({ message: "Esta opinión no tiene un reporte pendiente" });
        }
        await opinion.update({ is_reported: false, report_reason: null, reported_at: null });
        return res.status(200).json({ message: "Reporte descartado: la opinión se mantiene publicada" });
    } catch (error) {
        console.error("Error al descartar el reporte de la opinión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteOpinion = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const opinion = await Opinion.findByPk(id);
        if (!opinion) {
            return res.status(404).json({ message: "Opinión no encontrada" });
        }
        await opinion.destroy();
        return res.status(200).json({ message: "Opinión eliminada" });
    } catch (error) {
        console.error("Error al eliminar la opinión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
