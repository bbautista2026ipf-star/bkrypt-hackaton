import { body, param } from "express-validator";
import { EventLocation } from "../../models/event_location.model.js";

// Compartida por el registro y la edición del perfil: todas las ferias indicadas deben existir
export const assertEventLocationsExist = async (eventLocationIds) => {
    if (!Array.isArray(eventLocationIds)) {
        throw new Error("Las ferias deben enviarse como una lista de ids");
    }
    const uniqueIds = [...new Set(eventLocationIds)];
    if (uniqueIds.length === 0) {
        return true;
    }
    const existingCount = await EventLocation.count({ where: { id: uniqueIds } });
    if (existingCount !== uniqueIds.length) {
        throw new Error("Alguna de las ferias indicadas no existe");
    }
    return true;
};

export const entrepreneurIdValidation = [
    param("id").isUUID().withMessage("El id del emprendedor no es válido")
];

// Todos los campos son opcionales; la coherencia entre local y ferias se revisa en el controlador
// porque depende de los datos que el perfil ya tiene guardados
export const updateEntrepreneurProfileValidations = [
    body("brand_name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre del emprendimiento debe tener entre 2 y 100 caracteres"),
    body("biography")
        .optional({ values: "null" })
        .trim()
        .isLength({ max: 1000 }).withMessage("La biografía no puede superar los 1000 caracteres"),
    body("whatsapp_number")
        .optional({ values: "null" })
        .trim()
        .matches(/^\+?\d{8,15}$/).withMessage("El número de WhatsApp debe contener entre 8 y 15 dígitos, con + opcional al inicio"),
    body("has_store")
        .optional()
        .isBoolean().withMessage("Indicá si el emprendimiento tiene local (true o false)")
        .toBoolean(),
    body("store_address")
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage("La dirección del local debe tener entre 3 y 255 caracteres"),
    body("store_latitude")
        .optional()
        .isFloat({ min: -90, max: 90 }).withMessage("La latitud del local debe estar entre -90 y 90")
        .toFloat(),
    body("store_longitude")
        .optional()
        .isFloat({ min: -180, max: 180 }).withMessage("La longitud del local debe estar entre -180 y 180")
        .toFloat(),
    body("event_location_ids.*")
        .isUUID().withMessage("Cada feria debe indicarse con un id válido"),
    body("event_location_ids")
        .optional()
        .custom(assertEventLocationsExist)
];
