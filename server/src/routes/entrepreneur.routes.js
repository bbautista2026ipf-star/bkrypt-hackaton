import { Router } from "express";
import {
    getEntrepreneurById,
    getEntrepreneursWithStore,
    getOwnEntrepreneurProfile,
    updateOwnEntrepreneurProfile
} from "../controllers/entrepreneur.controller.js";
import { getEntrepreneurOpinions, upsertOpinion } from "../controllers/opinion.controller.js";
import { entrepreneurIdValidation, updateOwnProfileValidations } from "../middlewares/validations/entrepreneur.validations.js";
import { createOpinionValidations } from "../middlewares/validations/opinion.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { optionalAuthentication } from "../middlewares/auth.middleware.js";
import { requireVerifiedEmail } from "../middlewares/authorization.middleware.js";
import { requireEntrepreneur, requireMember } from "../middlewares/access.middleware.js";

export const entrepreneurRouter = Router();

// "/stores" y "/me" van antes que "/:id" para que Express no los interprete como un id
entrepreneurRouter.get("/entrepreneurs/stores", getEntrepreneursWithStore);

// Rutas privadas: perfil propio del emprendedor ("Mi catálogo")
entrepreneurRouter.get("/entrepreneurs/me", requireEntrepreneur, getOwnEntrepreneurProfile);
entrepreneurRouter.put("/entrepreneurs/me", requireEntrepreneur, updateOwnProfileValidations, checkValidationsResult, updateOwnEntrepreneurProfile);

// Rutas públicas: perfil y muro de opiniones (con sesión, el dueño del muro ve además qué opiniones reportó)
entrepreneurRouter.get("/entrepreneurs/:id", entrepreneurIdValidation, checkValidationsResult, getEntrepreneurById);
entrepreneurRouter.get("/entrepreneurs/:id/opinions", optionalAuthentication, entrepreneurIdValidation, checkValidationsResult, getEntrepreneurOpinions);

// Ruta privada: dejar una opinión exige una cuenta de la comunidad con el correo verificado
entrepreneurRouter.post("/entrepreneurs/:id/opinions", requireMember, requireVerifiedEmail, createOpinionValidations, checkValidationsResult, upsertOpinion);
