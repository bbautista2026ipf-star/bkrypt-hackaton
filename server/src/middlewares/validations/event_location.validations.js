import { body, param, query } from "express-validator";

const MAX_SESSIONS = 60;

// En la actualización todos los campos son opcionales; en la creación, los obligatorios se exigen
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

// El índice sale de la ruta del campo ("sessions[2].end_time") para comparar con el inicio de la misma jornada
const getSessionStart = (req, path) => {
    const index = Number(path.match(/\[(\d+)\]/)[1]);
    return req.body.sessions[index].start_time;
};

// Jornadas oficiales de la feria: al enviarlas reemplazan a las próximas ya cargadas (las pasadas quedan como historial)
const sessionsValidations = [
    body("sessions")
        .optional()
        .isArray({ max: MAX_SESSIONS }).withMessage(`Las jornadas deben enviarse como una lista de hasta ${MAX_SESSIONS} elementos`),
    body("sessions.*.start_time")
        .isISO8601().withMessage("La fecha y hora de inicio de la jornada es obligatoria (formato ISO 8601)")
        .toDate(),
    body("sessions.*.end_time")
        .isISO8601().withMessage("La fecha y hora de fin de la jornada es obligatoria (formato ISO 8601)")
        .toDate()
        .custom((endTime, { req, path }) => {
            if (endTime <= new Date()) {
                throw new Error("Cada jornada debe terminar en el futuro");
            }
            const startTime = getSessionStart(req, path);
            if (startTime instanceof Date && endTime <= startTime) {
                throw new Error("La hora de fin de la jornada debe ser posterior a la de inicio");
            }
            return true;
        })
];

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
        .toFloat(),
    ...sessionsValidations
];

export const eventLocationIdValidation = [
    param("id").isUUID().withMessage("El id de la feria no es válido")
];

export const createEventLocationValidations = eventLocationBodyValidations(false);

export const updateEventLocationValidations = [
    ...eventLocationIdValidation,
    ...eventLocationBodyValidations(true)
];

export const fairSessionFiltersValidations = [
    query("from")
        .optional()
        .isISO8601().withMessage("La fecha \"from\" debe tener formato ISO 8601")
        .toDate()
];
