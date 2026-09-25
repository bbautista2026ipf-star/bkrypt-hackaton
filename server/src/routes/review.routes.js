import { Router } from "express";
import { rateProduct, deleteReview } from "../controllers/review.controller.js";
import { rateProductValidations, reviewIdValidation } from "../middlewares/validations/review.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { canDeleteReview } from "../middlewares/ownership.middleware.js";

export const reviewRouter = Router();

// Rutas privadas: calificar un producto y borrar una calificación (su autor o un admin como moderador)
reviewRouter.post("/products/:id/reviews", authentication, authorizeRoles("consumer", "entrepreneur"), rateProductValidations, checkValidationsResult, rateProduct);
reviewRouter.delete("/reviews/:id", authentication, reviewIdValidation, checkValidationsResult, canDeleteReview, deleteReview);
