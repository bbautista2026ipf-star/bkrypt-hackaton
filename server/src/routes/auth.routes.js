import { Router } from "express";
import { register, login, logout, getCurrentUser, verifyEmail, resendVerificationEmail } from "../controllers/auth.controller.js";
import { submitEntrepreneurRequest } from "../controllers/entrepreneur_request.controller.js";
import {
    registerValidations,
    loginValidations,
    verifyEmailValidations,
    entrepreneurRequestValidations
} from "../middlewares/validations/auth.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { requireConsumer } from "../middlewares/access.middleware.js";

export const authRouter = Router();

// Rutas públicas
authRouter.post("/auth/register", registerValidations, checkValidationsResult, register);
authRouter.post("/auth/login", loginValidations, checkValidationsResult, login);
authRouter.post("/auth/logout", logout);
authRouter.post("/auth/verify-email", verifyEmailValidations, checkValidationsResult, verifyEmail);

// Rutas privadas
authRouter.get("/auth/me", authentication, getCurrentUser);
authRouter.post("/auth/resend-verification", authentication, resendVerificationEmail);

// Solo un consumidor puede pedir pasar a emprendedor
authRouter.post("/auth/entrepreneur-request", requireConsumer, entrepreneurRequestValidations, checkValidationsResult, submitEntrepreneurRequest);
