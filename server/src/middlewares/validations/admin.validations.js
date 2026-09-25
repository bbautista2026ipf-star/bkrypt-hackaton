import { body, param, query } from "express-validator";

const REVIEW_DECISIONS = ["approved", "rejected"];

const requestIdValidation = [
    param("id").isUUID().withMessage("El id de la solicitud no es válido")
];

const reviewDecisionValidation = body("status")
    .isIn(REVIEW_DECISIONS).withMessage("La decisión debe ser approved o rejected");

export const requestStatusFilterValidations = [
    query("status")
        .optional({ values: "falsy" })
        .isIn(["pending", ...REVIEW_DECISIONS]).withMessage("El estado debe ser pending, approved o rejected")
];

export const reviewEntrepreneurRequestValidations = [
    ...requestIdValidation,
    reviewDecisionValidation,
    body("rejection_reason")
        .if(body("status").equals("rejected"))
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 500 }).withMessage("El motivo del rechazo no puede superar los 500 caracteres")
];

export const reviewPresenceRequestValidations = [
    ...requestIdValidation,
    reviewDecisionValidation
];
