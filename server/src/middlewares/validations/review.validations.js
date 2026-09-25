import { body, param } from "express-validator";
import { productIdValidation } from "./product.validations.js";

export const rateProductValidations = [
    ...productIdValidation,
    body("stars")
        .isInt({ min: 1, max: 5 }).withMessage("La calificación es obligatoria y debe ser un número entero del 1 al 5")
        .toInt(),
    body("comment")
        .optional({ values: "null" })
        .trim()
        .isLength({ max: 1000 }).withMessage("El comentario no puede superar los 1000 caracteres")
];

export const reviewIdValidation = [
    param("id").isUUID().withMessage("El id de la calificación no es válido")
];
