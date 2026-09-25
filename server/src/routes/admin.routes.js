import { Router } from "express";
import { listEntrepreneurRequests, reviewEntrepreneurRequest } from "../controllers/entrepreneur_request.controller.js";
import { listPresenceRequests, reviewPresenceRequest } from "../controllers/presence_request.controller.js";
import { listReportedOpinions, dismissOpinionReport, deleteOpinion } from "../controllers/opinion.controller.js";
import {
    requestStatusFilterValidations,
    reviewEntrepreneurRequestValidations,
    reviewPresenceRequestValidations
} from "../middlewares/validations/admin.validations.js";
import { opinionIdValidation } from "../middlewares/validations/opinion.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { requireAdmin } from "../middlewares/access.middleware.js";

// Se monta en "/api/admin": la política requireAdmin se declara una sola vez y cubre todas las rutas de este enrutador
export const adminRouter = Router();
adminRouter.use(requireAdmin);

// Solicitudes para pasar a rol emprendedor
adminRouter.get("/entrepreneur-requests", requestStatusFilterValidations, checkValidationsResult, listEntrepreneurRequests);
adminRouter.patch("/entrepreneur-requests/:id", reviewEntrepreneurRequestValidations, checkValidationsResult, reviewEntrepreneurRequest);

// Solicitudes de presencia en eventos
adminRouter.get("/presence-requests", requestStatusFilterValidations, checkValidationsResult, listPresenceRequests);
adminRouter.patch("/presence-requests/:id", reviewPresenceRequestValidations, checkValidationsResult, reviewPresenceRequest);

// Moderación de opiniones reportadas por los emprendedores
adminRouter.get("/opinions/reported", listReportedOpinions);
adminRouter.patch("/opinions/:id/dismiss-report", opinionIdValidation, checkValidationsResult, dismissOpinionReport);
adminRouter.delete("/opinions/:id", opinionIdValidation, checkValidationsResult, deleteOpinion);
