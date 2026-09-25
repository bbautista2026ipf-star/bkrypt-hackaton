import { useCallback } from "react";
import useAsyncData from "./useAsyncData.js";
import { deleteEvent, getEvents, requestPresence } from "../services/event.service.js";

// Eventos de la agenda. El backend decide qué ve cada rol: el público solo recibe eventos confirmados
// y nunca el estado de solicitudes ajenas; el emprendedor recibe además el estado de su propia solicitud.
function useCalendarEvents() {
    const { data, status, error, reload, setData } = useAsyncData(getEvents);

    const askForPresence = useCallback(async (eventId) => {
        const { presenceRequest } = await requestPresence(eventId);
        setData((previous) => ({
            events: previous.events.map((event) => (
                event.id === eventId ? { ...event, my_request: { id: presenceRequest.id, status: presenceRequest.status } } : event
            ))
        }));
    }, [setData]);

    const removeEvent = useCallback(async (eventId) => {
        await deleteEvent(eventId);
        setData((previous) => ({ events: previous.events.filter((event) => event.id !== eventId) }));
    }, [setData]);

    return {
        events: data?.events ?? [],
        status,
        error,
        reload,
        askForPresence,
        removeEvent
    };
}

export default useCalendarEvents;
