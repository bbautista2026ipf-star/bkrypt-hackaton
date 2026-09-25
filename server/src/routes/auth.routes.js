import { Router } from "express";
import { register, login, logout, getCurrentUser, verifyEmail, resendVerificationEmail } from "../controllers/auth.controller.js";
import {
    registerValidations,
    loginValidations,
    verifyEmailValidations,
    resendVerificationValidations
} from "../middlewares/validations/auth.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

// Rutas públicas
authRouter.post("/auth/register", registerValidations, checkValidationsResult, register);
authRouter.post("/auth/login", loginValidations, checkValidationsResult, login);
authRouter.post("/auth/logout", logout);
authRouter.get("/auth/verify-email", verifyEmailValidations, checkValidationsResult, verifyEmail);
authRouter.post("/auth/resend-verification", resendVerificationValidations, checkValidationsResult, resendVerificationEmail);

// Rutas privadas
authRouter.get("/auth/me", authentication, getCurrentUser);
