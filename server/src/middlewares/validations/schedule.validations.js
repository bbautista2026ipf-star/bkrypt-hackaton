import { body, param, query } from "express-validator";

// En la actualización todos los campos son opcionales; que el fin sea posterior al inicio
// se revisa también en el controlador, porque puede cambiar solo uno de los dos
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

const scheduleBodyValidations = (isUpdate) => [
    field("event_location_id", isUpdate)
        .isUUID().withMessage("La feria es obligatoria y debe indicarse con un id válido"),
    field("start_time", isUpdate)
        .isISO8601().withMessage("La fecha y hora de inicio es obligatoria (formato ISO 8601, por ejemplo 2026-10-04T09:00:00-03:00)")
        .toDate(),
    field("end_time", isUpdate)
        .isISO8601().withMessage("La fecha y hora de fin es obligatoria (formato ISO 8601, por ejemplo 2026-10-04T13:00:00-03:00)")
        .toDate()
        .custom((endTime, { req }) => {
            if (endTime <= new Date()) {
                throw new Error("El horario debe terminar en el futuro");
            }
            if (req.body.start_time instanceof Date && endTime <= req.body.start_time) {
                throw new Error("La hora de fin debe ser posterior a la de inicio");
            }
            return true;
        })
];

export const scheduleIdValidation = [
    param("id").isUUID().withMessage("El id del horario no es válido")
];

export const createScheduleValidations = scheduleBodyValidations(false);

export const updateScheduleValidations = [
    ...scheduleIdValidation,
    ...scheduleBodyValidations(true)
];

export const scheduleFiltersValidations = [
    query("event_location_id")
        .optional()
        .isUUID().withMessage("El id de la feria no es válido"),
    query("entrepreneur_id")
        .optional()
        .isUUID().withMessage("El id del emprendedor no es válido"),
    query("from")
        .optional()
        .isISO8601().withMessage("La fecha \"from\" debe tener formato ISO 8601")
        .toDate(),
    query("to")
        .optional()
        .isISO8601().withMessage("La fecha \"to\" debe tener formato ISO 8601")
        .toDate()
];
