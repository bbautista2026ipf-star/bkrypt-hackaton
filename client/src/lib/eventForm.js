import { collectErrors, validateLength } from "./validators.js";

export const EMPTY_EVENT = {
    title: "",
    description: "",
    event_location_id: "",
    date: "",
    start_time: "",
    end_time: ""
};

// Fecha y horas se cargan en hora local; al backend viajan en ISO (UTC)
const toDate = (date, time) => new Date(`${date}T${time}`);

export const validateEvent = (values) => {
    const hasSchedule = values.date && values.start_time && values.end_time;
    const startsAt = hasSchedule ? toDate(values.date, values.start_time) : null;
    const endsAt = hasSchedule ? toDate(values.date, values.end_time) : null;
    return collectErrors({
        title: validateLength(values.title, { label: "El nombre del evento", min: 3, max: 100 }),
        description: validateLength(values.description, { label: "La descripción", max: 1000, required: false }),
        event_location_id: values.event_location_id ? null : "Elegí la ubicación del evento",
        date: values.date ? null : "Elegí la fecha del evento",
        start_time: !values.start_time
            ? "Indicá la hora de inicio"
            : startsAt && startsAt <= new Date() ? "El evento tiene que empezar en una fecha y hora futuras" : null,
        end_time: !values.end_time
            ? "Indicá la hora de fin"
            : startsAt && endsAt <= startsAt ? "La hora de fin tiene que ser posterior a la de inicio" : null
    });
};

export const toEventPayload = (values) => ({
    title: values.title.trim(),
    description: values.description.trim(),
    event_location_id: values.event_location_id,
    starts_at: toDate(values.date, values.start_time).toISOString(),
    ends_at: toDate(values.date, values.end_time).toISOString()
});

// Los errores del backend llegan como starts_at/ends_at; en el formulario se muestran junto a las horas
export const mapEventFieldErrors = ({ starts_at: startsAtError, ends_at: endsAtError, ...otherErrors }) => ({
    ...otherErrors,
    ...(startsAtError ? { start_time: startsAtError } : {}),
    ...(endsAtError ? { end_time: endsAtError } : {})
});
