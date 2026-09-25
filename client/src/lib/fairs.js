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

const summarizeSchedules = (schedules) => ({
    starts_at: schedules[0].start_time,
    ends_at: schedules.reduce((latest, schedule) => (schedule.end_time > latest ? schedule.end_time : latest), schedules[0].end_time),
    is_active_now: schedules.some((schedule) => schedule.is_active_now),
    participants: uniqueEntrepreneurs(schedules),
    schedules
});

const groupBy = (items, getKey) => items.reduce((groups, item) => {
    const key = getKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
    return groups;
}, new Map());

// Ferias activas para el mapa: una por ubicación, con los emprendedores que tienen horarios próximos ahí.
// Si hay filtros de productos, solo quedan los emprendedores cuyos productos coinciden (matchingEntrepreneurIds).
export const buildActiveFairs = (schedules, matchingEntrepreneurIds = null) => {
    const relevantSchedules = matchingEntrepreneurIds
        ? schedules.filter((schedule) => matchingEntrepreneurIds.has(schedule.entrepreneur.id))
        : schedules;
    return [...groupBy(relevantSchedules, (schedule) => schedule.location.id).values()].map((locationSchedules) => {
        const summary = summarizeSchedules(locationSchedules);
        return {
            id: locationSchedules[0].location.id,
            title: locationSchedules[0].location.name,
            location: toLocation(locationSchedules[0].location),
            participants_count: summary.participants.length,
            ...summary
        };
    });
};

// Jornadas de feria para la agenda: los horarios de una misma feria en un mismo día forman una sola entrada
export const buildFairDays = (schedules) => [...groupBy(schedules, (schedule) => `${schedule.location.id}|${toDateKey(schedule.start_time)}`).entries()]
    .map(([key, daySchedules]) => ({
        id: key,
        title: daySchedules[0].location.name,
        location: toLocation(daySchedules[0].location),
        ...summarizeSchedules(daySchedules)
    }));
