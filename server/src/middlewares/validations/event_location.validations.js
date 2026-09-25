import { body, param } from "express-validator";

// En la actualización todos los campos son opcionales; en la creación, los obligatorios se exigen
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

const eventLocationBodyValidations = (isUpdate) => [
    field("name", isUpdate)
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre de la feria es obligatorio y debe tener entre 2 y 100 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("La descripción no puede superar los 1000 caracteres"),
    field("latitude", isUpdate)
        .isFloat({ min: -90, max: 90 }).withMessage("La latitud es obligatoria y debe estar entre -90 y 90")
        .toFloat(),
    field("longitude", isUpdate)
        .isFloat({ min: -180, max: 180 }).withMessage("La longitud es obligatoria y debe estar entre -180 y 180")
        .toFloat()
];

export const eventLocationIdValidation = [
    param("id").isUUID().withMessage("El id de la feria no es válido")
];

export const createEventLocationValidations = eventLocationBodyValidations(false);

export const updateEventLocationValidations = [
    ...eventLocationIdValidation,
    ...eventLocationBodyValidations(true)
];
