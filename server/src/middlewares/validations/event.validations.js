import { body, param } from "express-validator";
import { EventLocation } from "../../models/event_location.model.js";

export const eventIdValidation = [
    param("id").isUUID().withMessage("El id del evento no es válido")
];

export const createEventValidations = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage("El nombre del evento es obligatorio y debe tener entre 3 y 100 caracteres"),
    body("description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 1000 }).withMessage("La descripción no puede superar los 1000 caracteres"),
    body("event_location_id")
        .isUUID().withMessage("Elegí una ubicación válida").bail()
        .custom(async (eventLocationId) => {
            const eventLocation = await EventLocation.findByPk(eventLocationId, { attributes: ["id"] });
            if (!eventLocation) {
                throw new Error("La ubicación elegida no existe");
            }
            return true;
        }),
    body("starts_at")
        .isISO8601().withMessage("La fecha y hora de inicio deben tener un formato válido").bail()
        .custom((startsAt) => {
            if (new Date(startsAt) <= new Date()) {
                throw new Error("El evento tiene que empezar en una fecha y hora futuras");
            }
            return true;
        })
        .toDate(),
    body("ends_at")
        .isISO8601().withMessage("La fecha y hora de fin deben tener un formato válido").bail()
        .custom((endsAt, { req }) => {
            if (new Date(endsAt) <= new Date(req.body.starts_at)) {
                throw new Error("El evento tiene que terminar después de su hora de inicio");
            }
            return true;
        })
        .toDate()
];
