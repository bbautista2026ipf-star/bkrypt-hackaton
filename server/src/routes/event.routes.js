import { Router } from "express";
import { getEvents, getEventById, createEvent, deleteEvent } from "../controllers/event.controller.js";
import { requestPresence } from "../controllers/presence_request.controller.js";
import { eventIdValidation, createEventValidations } from "../middlewares/validations/event.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { optionalAuthentication } from "../middlewares/auth.middleware.js";
import { requireAdmin, requireEntrepreneur } from "../middlewares/access.middleware.js";

export const eventRouter = Router();

// Rutas públicas: lo que se ve depende del rol (el público solo ve eventos con emprendedores confirmados)
eventRouter.get("/events", optionalAuthentication, getEvents);
eventRouter.get("/events/:id", optionalAuthentication, eventIdValidation, checkValidationsResult, getEventById);

// Rutas privadas solo para administradores: habilitar y eliminar fechas de eventos
eventRouter.post("/events", requireAdmin, createEventValidations, checkValidationsResult, createEvent);
eventRouter.delete("/events/:id", requireAdmin, eventIdValidation, checkValidationsResult, deleteEvent);

// Ruta privada para emprendedores: solicitar presencia en un evento habilitado
eventRouter.post("/events/:id/presence-requests", requireEntrepreneur, eventIdValidation, checkValidationsResult, requestPresence);
