import { Router } from "express";
import {
    getEventLocations,
    getEventLocationById,
    getFairSessions,
    createEventLocation,
    updateEventLocation,
    deleteEventLocation
} from "../controllers/event_location.controller.js";
import {
    eventLocationIdValidation,
    createEventLocationValidations,
    updateEventLocationValidations,
    fairSessionFiltersValidations
} from "../middlewares/validations/event_location.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

export const eventLocationRouter = Router();

// Rutas públicas: listado (lo usa el registro del emprendedor) y detalle con sus emprendedores y próximos horarios
eventLocationRouter.get("/event-locations", getEventLocations);
// Jornadas oficiales de todas las ferias: las muestran la agenda y el mapa
eventLocationRouter.get("/fair-sessions", fairSessionFiltersValidations, checkValidationsResult, getFairSessions);
eventLocationRouter.get("/event-locations/:id", eventLocationIdValidation, checkValidationsResult, getEventLocationById);

// Rutas privadas solo para administradores
eventLocationRouter.post("/event-locations", authentication, authorizeRoles("admin"), createEventLocationValidations, checkValidationsResult, createEventLocation);
eventLocationRouter.put("/event-locations/:id", authentication, authorizeRoles("admin"), updateEventLocationValidations, checkValidationsResult, updateEventLocation);
eventLocationRouter.delete("/event-locations/:id", authentication, authorizeRoles("admin"), eventLocationIdValidation, checkValidationsResult, deleteEventLocation);
