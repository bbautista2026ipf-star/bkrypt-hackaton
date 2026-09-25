import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/auth.controller.js";
import { registerValidations, loginValidations } from "../middlewares/validations/auth.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

// Rutas públicas
authRouter.post("/auth/register", registerValidations, checkValidationsResult, register);
authRouter.post("/auth/login", loginValidations, checkValidationsResult, login);
authRouter.post("/auth/logout", logout);

// Rutas privadas
authRouter.get("/auth/me", authentication, getCurrentUser);
