import { toDateKey } from "./formatters.js";

// El backend devuelve DECIMAL como texto: las coordenadas se convierten a número para el mapa
const toLocation = (location) => ({
    id: location.id,
    name: location.name,
    latitude: Number(location.latitude),
    longitude: Number(location.longitude)
});

const uniqueEntrepreneurs = (schedules) => [
    ...new Map(schedules.map((schedule) => [schedule.entrepreneur.id, schedule.entrepreneur])).values()
];

const byStartTime = (first, second) => new Date(first.start_time) - new Date(second.start_time);

// sessions: jornadas oficiales de la feria (las carga el administrador); schedules: horarios de los emprendedores.
// Una feria puede tener solo una de las dos cosas, por eso el rango total sale de ambas listas.
const summarizeFair = (schedules, sessions) => {
    const periods = [...sessions, ...schedules].sort(byStartTime);
    return {
        starts_at: periods[0].start_time,
        ends_at: periods.reduce((latest, period) => (new Date(period.end_time) > new Date(latest) ? period.end_time : latest), periods[0].end_time),
        is_active_now: periods.some((period) => period.is_active_now),
        participants: uniqueEntrepreneurs(schedules),
        schedules,
        sessions
    };
};

const groupBy = (items, getKey) => items.reduce((groups, item) => {
    const key = getKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
    return groups;
}, new Map());

const byLocation = (item) => item.location.id;

const byLocationAndDay = (item) => `${item.location.id}|${toDateKey(item.start_time)}`;

const byStartsAt = (first, second) => new Date(first.starts_at) - new Date(second.starts_at);

const buildFair = (id, schedules, sessions) => {
    const { location } = sessions[0] ?? schedules[0];
    return {
        id,
        title: location.name,
        location: toLocation(location),
        ...summarizeFair(schedules, sessions)
    };
};

// Ferias activas para el mapa: una por ubicación, con sus jornadas oficiales y los emprendedores con horarios próximos.
// Si hay filtros de productos, solo quedan las ferias con emprendedores cuyos productos coinciden (matchingEntrepreneurIds).
export const buildActiveFairs = (schedules, sessions = [], matchingEntrepreneurIds = null) => {
    const relevantSchedules = matchingEntrepreneurIds
        ? schedules.filter((schedule) => matchingEntrepreneurIds.has(schedule.entrepreneur.id))
        : schedules;
    const schedulesByLocation = groupBy(relevantSchedules, byLocation);
    const sessionsByLocation = groupBy(sessions, byLocation);
    const locationIds = matchingEntrepreneurIds
        ? [...schedulesByLocation.keys()]
        : [...new Set([...sessionsByLocation.keys(), ...schedulesByLocation.keys()])];
    return locationIds
        .map((locationId) => {
            const fair = buildFair(locationId, schedulesByLocation.get(locationId) ?? [], sessionsByLocation.get(locationId) ?? []);
            return { ...fair, participants_count: fair.participants.length };
        })
        .sort(byStartsAt);
};

// Jornadas de feria para la agenda: los horarios y jornadas de una misma feria en un mismo día forman una sola entrada
export const buildFairDays = (schedules, sessions = []) => {
    const schedulesByDay = groupBy(schedules, byLocationAndDay);
    const sessionsByDay = groupBy(sessions, byLocationAndDay);
    const dayKeys = new Set([...sessionsByDay.keys(), ...schedulesByDay.keys()]);
    return [...dayKeys]
        .map((dayKey) => buildFair(dayKey, schedulesByDay.get(dayKey) ?? [], sessionsByDay.get(dayKey) ?? []))
        .sort(byStartsAt);
};
