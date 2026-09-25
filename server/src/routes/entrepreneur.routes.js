import { Router } from "express";
import { getEntrepreneurById, getEntrepreneursWithStore } from "../controllers/entrepreneur.controller.js";
import { entrepreneurIdValidation } from "../middlewares/validations/entrepreneur.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";

export const entrepreneurRouter = Router();

// "/stores" va antes que "/:id" para que Express no lo interprete como un id
entrepreneurRouter.get("/entrepreneurs/stores", getEntrepreneursWithStore);
entrepreneurRouter.get("/entrepreneurs/:id", entrepreneurIdValidation, checkValidationsResult, getEntrepreneurById);
