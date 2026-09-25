import { Router } from "express";
import { getEntrepreneurById, getEntrepreneursWithStore, updateMyProfile } from "../controllers/entrepreneur.controller.js";
import { entrepreneurIdValidation, updateEntrepreneurProfileValidations } from "../middlewares/validations/entrepreneur.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

export const entrepreneurRouter = Router();

// "/stores" y "/me" van antes que "/:id" para que Express no los interprete como un id
entrepreneurRouter.get("/entrepreneurs/stores", getEntrepreneursWithStore);
entrepreneurRouter.put("/entrepreneurs/me", authentication, authorizeRoles("entrepreneur"), updateEntrepreneurProfileValidations, checkValidationsResult, updateMyProfile);
entrepreneurRouter.get("/entrepreneurs/:id", entrepreneurIdValidation, checkValidationsResult, getEntrepreneurById);
