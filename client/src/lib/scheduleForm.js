import { collectErrors } from "./validators.js";

export const EMPTY_SCHEDULE = {
    event_location_id: "",
    date: "",
    start_time: "",
    end_time: ""
};

const pad = (number) => String(number).padStart(2, "0");

const toDateInputValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toTimeInputValue = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// Fecha y horas se cargan en hora local; al backend viajan en ISO 8601
export const toDate = (date, time) => new Date(`${date}T${time}`);

export const scheduleToFormValues = (schedule) => {
    const start = new Date(schedule.start_time);
    return {
        event_location_id: schedule.event_location_id,
        date: toDateInputValue(start),
        start_time: toTimeInputValue(start),
        end_time: toTimeInputValue(new Date(schedule.end_time))
    };
};

export const scheduleForDate = (date) => ({ ...EMPTY_SCHEDULE, date: toDateInputValue(date) });

// Si la jornada tiene horario oficial se propone ese mismo horario; si no, solo la feria y el día
export const scheduleForFairDay = (fairDay) => {
    const [officialSession] = fairDay.sessions;
    if (officialSession) {
        return scheduleToFormValues(officialSession);
    }
    return { ...scheduleForDate(new Date(fairDay.starts_at)), event_location_id: fairDay.location.id };
};

// Mismas reglas que el backend: el fin es posterior al inicio y todavía no pasó
const validateEndTime = (values) => {
    if (!values.end_time) {
        return "Indicá la hora de fin";
    }
    if (!values.date || !values.start_time) {
        return null;
    }
    const startsAt = toDate(values.date, values.start_time);
    const endsAt = toDate(values.date, values.end_time);
    if (endsAt <= startsAt) {
        return "La hora de fin tiene que ser posterior a la de inicio";
    }
    return endsAt <= new Date() ? "El horario tiene que terminar en el futuro" : null;
};

export const validateSchedule = (values) => collectErrors({
    event_location_id: values.event_location_id ? null : "Elegí la feria",
    date: values.date ? null : "Elegí la fecha",
    start_time: values.start_time ? null : "Indicá la hora de inicio",
    end_time: validateEndTime(values)
});

export const toSchedulePayload = (values) => ({
    event_location_id: values.event_location_id,
    start_time: toDate(values.date, values.start_time).toISOString(),
    end_time: toDate(values.date, values.end_time).toISOString()
});
