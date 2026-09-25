import { Router } from "express";
import { reportOpinion } from "../controllers/opinion.controller.js";
import { reportOpinionValidations } from "../middlewares/validations/opinion.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { requireEntrepreneur } from "../middlewares/access.middleware.js";

export const opinionRouter = Router();

// El emprendedor no puede borrar opiniones de su muro: solo reportarlas ante el administrador
opinionRouter.post("/opinions/:id/report", requireEntrepreneur, reportOpinionValidations, checkValidationsResult, reportOpinion);
