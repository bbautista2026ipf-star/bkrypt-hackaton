import useAsyncData from "./useAsyncData.js";
import { getEvents } from "../services/event.service.js";

const HOME_EVENTS_LIMIT = 3;

// Para la portada: próximos eventos confirmados (el backend ya filtra lo que el público puede ver)
const loadUpcomingEvents = async () => {
    const { events } = await getEvents();
    const now = new Date();
    return events
        .filter((event) => event.participants_count > 0 && new Date(event.ends_at) >= now)
        .slice(0, HOME_EVENTS_LIMIT);
};

function useUpcomingEvents() {
    const { data, status, error, reload } = useAsyncData(loadUpcomingEvents);
    return { events: data ?? [], status, error, reload };
}

export default useUpcomingEvents;
