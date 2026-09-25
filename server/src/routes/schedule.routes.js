import { Router } from "express";
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from "../controllers/schedule.controller.js";
import {
    scheduleIdValidation,
    createScheduleValidations,
    updateScheduleValidations,
    scheduleFiltersValidations
} from "../middlewares/validations/schedule.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { isScheduleOwner } from "../middlewares/ownership.middleware.js";

export const scheduleRouter = Router();

// Ruta pública: agenda de ferias (por defecto, los horarios que todavía no terminaron)
scheduleRouter.get("/schedules", scheduleFiltersValidations, checkValidationsResult, getSchedules);

// Rutas privadas: el emprendedor gestiona sus propios horarios
scheduleRouter.post("/schedules", authentication, authorizeRoles("entrepreneur"), createScheduleValidations, checkValidationsResult, createSchedule);
scheduleRouter.put("/schedules/:id", authentication, authorizeRoles("entrepreneur"), updateScheduleValidations, checkValidationsResult, isScheduleOwner, updateSchedule);
scheduleRouter.delete("/schedules/:id", authentication, authorizeRoles("entrepreneur"), scheduleIdValidation, checkValidationsResult, isScheduleOwner, deleteSchedule);
