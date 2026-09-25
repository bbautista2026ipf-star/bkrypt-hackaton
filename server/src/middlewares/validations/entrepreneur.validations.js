import { param } from "express-validator";

export const entrepreneurIdValidation = [
    param("id").isUUID().withMessage("El id del emprendedor no es válido")
];
