import { useCallback, useState } from "react";
import useCalendarEvents from "./useCalendarEvents.js";
import { ROLES } from "../lib/constants.js";
import { formatDate } from "../lib/formatters.js";

// Mensaje al tocar una fecha sin eventos: al emprendedor se le explica por qué no puede solicitar presencia ahí
const buildEmptyDateMessage = (date, role) => {
    const day = formatDate(date);
    if (role === ROLES.entrepreneur) {
        return `El ${day} no tiene eventos habilitados por la administración. Solo podés solicitar presencia en los eventos que aparecen en el calendario.`;
    }
    if (role === ROLES.admin) {
        return `No hay eventos el ${day}. Podés habilitar uno desde el panel de Administración.`;
    }
    return `No hay ferias confirmadas el ${day}.`;
};

function useAgenda(role) {
    const calendar = useCalendarEvents();
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [emptyDateMessage, setEmptyDateMessage] = useState(null);

    const openEvent = useCallback((eventId) => {
        setEmptyDateMessage(null);
        setSelectedEventId(eventId);
    }, []);

    const closeEvent = useCallback(() => setSelectedEventId(null), []);

    const showEmptyDate = useCallback((date) => setEmptyDateMessage(buildEmptyDateMessage(date, role)), [role]);

    return {
        ...calendar,
        selectedEvent: calendar.events.find((event) => event.id === selectedEventId) ?? null,
        isEventOpen: Boolean(selectedEventId),
        openEvent,
        closeEvent,
        emptyDateMessage,
        showEmptyDate
    };
}

export default useAgenda;
