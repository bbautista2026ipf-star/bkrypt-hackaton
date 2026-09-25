import { Router } from "express";
import { getEventLocations, createEventLocation, updateEventLocation, deleteEventLocation } from "../controllers/event_location.controller.js";
import {
    eventLocationIdValidation,
    createEventLocationValidations,
    updateEventLocationValidations
} from "../middlewares/validations/event_location.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { requireAdmin } from "../middlewares/access.middleware.js";

export const eventLocationRouter = Router();

// Ruta pública: la usa el formulario de registro del emprendedor para elegir sus ferias
eventLocationRouter.get("/event-locations", getEventLocations);

// Rutas privadas solo para administradores
eventLocationRouter.post("/event-locations", requireAdmin, createEventLocationValidations, checkValidationsResult, createEventLocation);
eventLocationRouter.put("/event-locations/:id", requireAdmin, updateEventLocationValidations, checkValidationsResult, updateEventLocation);
eventLocationRouter.delete("/event-locations/:id", requireAdmin, eventLocationIdValidation, checkValidationsResult, deleteEventLocation);
