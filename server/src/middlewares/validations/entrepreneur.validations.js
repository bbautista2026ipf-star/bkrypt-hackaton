import { body, param } from "express-validator";
import { EventLocation } from "../../models/event_location.model.js";

const isTrueValue = (value) => value === true || value === "true";

const URL_OPTIONS = { protocols: ["http", "https"], require_protocol: true };

// Aplica cada regla solo si se cumple "condition" (en el registro: que el rol elegido sea entrepreneur)
const onlyWhen = (chain, condition) => (condition ? chain.if(condition) : chain);

// Reglas del formulario extendido del emprendimiento; las comparten el registro, la solicitud desde el perfil y la edición del perfil
export const businessValidations = (condition = null) => {
    const hasStore = (value, meta) => (!condition || condition(value, meta)) && isTrueValue(meta.req.body.has_store);

    return [
        onlyWhen(body("brand_name"), condition)
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage("El nombre del emprendimiento es obligatorio y debe tener entre 2 y 100 caracteres"),
        onlyWhen(body("biography"), condition)
            .optional({ values: "falsy" })
            .trim()
            .isLength({ max: 1000 }).withMessage("La descripción no puede superar los 1000 caracteres"),

        // Contacto: al menos un medio para que los consumidores puedan comunicarse
        onlyWhen(body("whatsapp_number"), condition)
            .custom((value, { req }) => {
                if (!value && !req.body.contact_email) {
                    throw new Error("Indicá al menos un medio de contacto: WhatsApp o correo electrónico");
                }
                return true;
            }),
        onlyWhen(body("whatsapp_number"), condition)
            .optional({ values: "falsy" })
            .trim()
            .matches(/^\+?\d{8,15}$/).withMessage("El número de WhatsApp debe contener entre 8 y 15 dígitos, con + opcional al inicio"),
        onlyWhen(body("contact_email"), condition)
            .optional({ values: "falsy" })
            .trim()
            .toLowerCase()
            .isEmail().withMessage("El correo de contacto debe tener un formato válido")
            .isLength({ max: 255 }).withMessage("El correo de contacto no puede superar los 255 caracteres"),
        onlyWhen(body("instagram_url"), condition)
            .optional({ values: "falsy" })
            .trim()
            .isURL(URL_OPTIONS).withMessage("El enlace de Instagram debe ser una URL válida que empiece con http:// o https://")
            .isLength({ max: 255 }).withMessage("El enlace de Instagram no puede superar los 255 caracteres"),
        onlyWhen(body("facebook_url"), condition)
            .optional({ values: "falsy" })
            .trim()
            .isURL(URL_OPTIONS).withMessage("El enlace de Facebook debe ser una URL válida que empiece con http:// o https://")
            .isLength({ max: 255 }).withMessage("El enlace de Facebook no puede superar los 255 caracteres"),

        onlyWhen(body("has_store"), condition)
            .isBoolean().withMessage("Indicá si el emprendimiento tiene local (true o false)")
            .toBoolean(),

        // Ubicación del local: obligatoria solo si el emprendedor indicó que tiene local
        body("store_address")
            .if(hasStore)
            .trim()
            .isLength({ min: 3, max: 255 }).withMessage("La dirección del local es obligatoria y debe tener entre 3 y 255 caracteres"),
        body("store_latitude")
            .if(hasStore)
            .isFloat({ min: -90, max: 90 }).withMessage("La latitud del local es obligatoria y debe estar entre -90 y 90")
            .toFloat(),
        body("store_longitude")
            .if(hasStore)
            .isFloat({ min: -180, max: 180 }).withMessage("La longitud del local es obligatoria y debe estar entre -180 y 180")
            .toFloat(),

        // Ferias: obligatorias (al menos una) si no tiene local, opcionales si lo tiene
        onlyWhen(body("event_location_ids.*"), condition)
            .isUUID().withMessage("Cada feria debe indicarse con un id válido"),
        onlyWhen(body("event_location_ids"), condition)
            .custom(async (eventLocationIds, { req }) => {
                const storeDeclared = isTrueValue(req.body.has_store);
                if (eventLocationIds === undefined || eventLocationIds === null) {
                    if (!storeDeclared) {
                        throw new Error("Si no tenés local, indicá al menos una feria a la que asistís");
                    }
                    return true;
                }
                if (!Array.isArray(eventLocationIds)) {
                    throw new Error("Las ferias deben enviarse como una lista de ids");
                }
                if (!storeDeclared && eventLocationIds.length === 0) {
                    throw new Error("Si no tenés local, indicá al menos una feria a la que asistís");
                }
                const uniqueIds = [...new Set(eventLocationIds)];
                const existingCount = await EventLocation.count({ where: { id: uniqueIds } });
                if (existingCount !== uniqueIds.length) {
                    throw new Error("Alguna de las ferias indicadas no existe");
                }
                return true;
            })
    ];
};

export const entrepreneurIdValidation = [
    param("id").isUUID().withMessage("El id del emprendedor no es válido")
];

export const updateOwnProfileValidations = businessValidations();
