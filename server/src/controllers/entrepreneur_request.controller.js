import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { User } from "../models/user.model.js";
import { EntrepreneurRequest } from "../models/entrepreneur_request.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { createPendingEntrepreneurRequest, createProfileFromRequest } from "../helpers/entrepreneur.helper.js";
import { notifyAdminOfEntrepreneurRequest, sendEntrepreneurRequestDecision } from "../helpers/mail.helper.js";
import { RequestError, sendControllerError } from "../helpers/request_error.helper.js";

const applicantInclude = {
    model: User,
    as: "applicant",
    attributes: ["id", "name", "email", "role", "is_email_verified"]
};

// Un consumidor ya registrado pide pasar a emprendedor con el mismo formulario extendido del registro
export const submitEntrepreneurRequest = async (req, res) => {
    try {
        const businessData = matchedData(req, { locations: ["body"] });

        // Bloquea la fila del usuario: dos envíos simultáneos no pueden dejar dos solicitudes pendientes
        const { applicant, entrepreneurRequest } = await sequelize.transaction(async (transaction) => {
            const applicant = await User.findByPk(req.userData.user_id, { lock: transaction.LOCK.UPDATE, transaction });
            const pendingRequest = await EntrepreneurRequest.findOne({
                where: { user_id: applicant.id, status: "pending" },
                transaction
            });
            if (pendingRequest) {
                throw new RequestError(409, "Ya tenés una solicitud pendiente de revisión");
            }
            const entrepreneurRequest = await createPendingEntrepreneurRequest(applicant.id, businessData, transaction);
            return { applicant, entrepreneurRequest };
        });

        notifyAdminOfEntrepreneurRequest(applicant, entrepreneurRequest);
        return res.status(201).json({
            message: "Solicitud enviada. Mientras la administración la revisa seguís usando la plataforma como consumidor",
            entrepreneurRequest
        });
    } catch (error) {
        return sendControllerError(res, error, "Error al enviar la solicitud de emprendedor:");
    }
};

export const listEntrepreneurRequests = async (req, res) => {
    try {
        const { status } = matchedData(req, { locations: ["query"] });
        const entrepreneurRequests = await EntrepreneurRequest.findAll({
            where: status ? { status } : {},
            include: applicantInclude,
            order: [["createdAt", "ASC"]]
        });

        // Se resuelven los nombres de las ferias para que el administrador vea qué declaró el solicitante
        const fairIds = [...new Set(entrepreneurRequests.flatMap((request) => request.event_location_ids))];
        const fairs = fairIds.length > 0
            ? await EventLocation.findAll({ where: { id: fairIds }, attributes: ["id", "name"] })
            : [];
        const fairNames = new Map(fairs.map((fair) => [fair.id, fair.name]));

        return res.status(200).json({
            entrepreneurRequests: entrepreneurRequests.map((request) => ({
                ...request.toJSON(),
                fairs: request.event_location_ids
                    .filter((fairId) => fairNames.has(fairId))
                    .map((fairId) => ({ id: fairId, name: fairNames.get(fairId) }))
            }))
        });
    } catch (error) {
        console.error("Error al obtener las solicitudes de emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Aprobar crea el perfil y cambia el rol en la misma transacción: nunca queda un emprendedor sin perfil ni un perfil sin rol
export const reviewEntrepreneurRequest = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const { status, rejection_reason } = matchedData(req, { locations: ["body"] });

        const { applicant, entrepreneurRequest } = await sequelize.transaction(async (transaction) => {
            const entrepreneurRequest = await EntrepreneurRequest.findByPk(id, { lock: transaction.LOCK.UPDATE, transaction });
            if (!entrepreneurRequest) {
                throw new RequestError(404, "Solicitud no encontrada");
            }
            if (entrepreneurRequest.status !== "pending") {
                throw new RequestError(409, "Esta solicitud ya fue revisada");
            }
            const applicant = await User.findByPk(entrepreneurRequest.user_id, { lock: transaction.LOCK.UPDATE, transaction });

            if (status === "approved") {
                if (!applicant.is_email_verified) {
                    throw new RequestError(409, "El solicitante todavía no verificó su correo electrónico");
                }
                if (applicant.role !== "consumer") {
                    throw new RequestError(409, "Solo una cuenta de consumidor puede pasar a emprendedor");
                }
                await createProfileFromRequest(entrepreneurRequest, transaction);
                await applicant.update({ role: "entrepreneur" }, { transaction });
            }

            await entrepreneurRequest.update({
                status,
                rejection_reason: status === "rejected" ? rejection_reason || null : null,
                reviewed_at: new Date()
            }, { transaction });
            return { applicant, entrepreneurRequest };
        });

        sendEntrepreneurRequestDecision(applicant, entrepreneurRequest);
        return res.status(200).json({
            message: status === "approved"
                ? "Solicitud aprobada: la cuenta ya tiene rol de emprendedor"
                : "Solicitud rechazada: la cuenta sigue como consumidor",
            entrepreneurRequest
        });
    } catch (error) {
        return sendControllerError(res, error, "Error al revisar la solicitud de emprendedor:");
    }
};
