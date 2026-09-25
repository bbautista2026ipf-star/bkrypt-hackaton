import { body, param } from "express-validator";
import { OPINION_COMMENT_MAX_LENGTH } from "../../models/opinion.model.js";
import { entrepreneurIdValidation } from "./entrepreneur.validations.js";

export const opinionIdValidation = [
    param("id").isUUID().withMessage("El id de la opinión no es válido")
];

export const createOpinionValidations = [
    ...entrepreneurIdValidation,
    body("stars")
        .isInt({ min: 1, max: 5 }).withMessage("La valoración es obligatoria y debe ser un número entero del 1 al 5")
        .toInt(),
    body("comment")
        .isString().withMessage("El comentario es obligatorio").bail()
        .trim()
        .isLength({ min: 3, max: OPINION_COMMENT_MAX_LENGTH })
        .withMessage(`El comentario es obligatorio y debe tener entre 3 y ${OPINION_COMMENT_MAX_LENGTH} caracteres`)
];

export const reportOpinionValidations = [
    ...opinionIdValidation,
    body("reason")
        .isString().withMessage("Contanos el motivo del reporte").bail()
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage("El motivo del reporte debe tener entre 5 y 255 caracteres")
];
