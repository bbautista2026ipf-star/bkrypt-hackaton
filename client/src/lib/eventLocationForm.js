import { collectErrors, validateLength, validateNumberInRange } from "./validators.js";
import { scheduleToFormValues, toDate } from "./scheduleForm.js";

let nextSessionKey = 0;

// Cada fila de jornada lleva una clave propia para que React no mezcle los inputs al quitar filas
export const createSessionRow = (values = { date: "", start_time: "", end_time: "" }) => {
    nextSessionKey += 1;
    return { key: `session-${nextSessionKey}`, ...values };
};

export const EMPTY_LOCATION = { name: "", description: "", latitude: "", longitude: "", sessions: [] };

// El backend devuelve solo las jornadas que todavía no terminaron: son las que se pueden editar
export const locationToFormValues = (location) => ({
    name: location.name ?? "",
    description: location.description ?? "",
    latitude: String(Number(location.latitude)),
    longitude: String(Number(location.longitude)),
    sessions: (location.sessions ?? []).map((session) => {
        const { date, start_time, end_time } = scheduleToFormValues(session);
        return createSessionRow({ date, start_time, end_time });
    })
});

// Mismas reglas que el backend para cada jornada: fecha y horas completas, fin posterior al inicio y todavía no pasó
const validateSessionRow = (session) => {
    if (!session.date || !session.start_time || !session.end_time) {
        return "completá la fecha y las horas de inicio y fin";
    }
    const startsAt = toDate(session.date, session.start_time);
    const endsAt = toDate(session.date, session.end_time);
    if (endsAt <= startsAt) {
        return "la hora de fin tiene que ser posterior a la de inicio";
    }
    return endsAt <= new Date() ? "tiene que terminar en el futuro" : null;
};

// Primera jornada con error: el formulario la resalta y muestra el mensaje debajo de la lista
export const findSessionError = (sessions) => {
    for (const [index, session] of sessions.entries()) {
        const message = validateSessionRow(session);
        if (message) {
            return { index, message: `Jornada ${index + 1}: ${message}` };
        }
    }
    return null;
};

export const validateLocation = (values) => collectErrors({
    name: validateLength(values.name, { label: "El nombre de la feria", min: 2, max: 100 }),
    description: validateLength(values.description, { label: "La descripción", max: 1000, required: false }),
    latitude: validateNumberInRange(values.latitude, { label: "La latitud", min: -90, max: 90 }),
    longitude: validateNumberInRange(values.longitude, { label: "La longitud", min: -180, max: 180 }),
    sessions: findSessionError(values.sessions)?.message
});

// El backend nombra los errores de cada jornada como "sessions[0].end_time": se muestran todos en la lista de jornadas
export const mapLocationFieldErrors = (fieldErrors) => Object.entries(fieldErrors).reduce((errors, [field, message]) => {
    const formField = field.startsWith("sessions") ? "sessions" : field;
    return errors[formField] ? errors : { ...errors, [formField]: message };
}, {});

export const toLocationPayload = (values) => ({
    name: values.name.trim(),
    description: values.description.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    sessions: values.sessions.map((session) => ({
        start_time: toDate(session.date, session.start_time).toISOString(),
        end_time: toDate(session.date, session.end_time).toISOString()
    }))
});
