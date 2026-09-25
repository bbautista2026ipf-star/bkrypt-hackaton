import { useMemo } from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useMediaQuery from "../hooks/useMediaQuery.js";
import { hasEventOnDay, toCalendarEvent } from "../lib/calendarEvents.js";

const PLUGINS = [dayGridPlugin, listPlugin, interactionPlugin];
const COMPACT_TOOLBAR = { left: "prev,next", center: "title", right: "today" };
const FULL_TOOLBAR = { left: "prev,next today", center: "title", right: "dayGridMonth,listMonth" };
const TIME_FORMAT = { hour: "2-digit", minute: "2-digit", hour12: false };

// En móvil (menos de 768px) se usa la vista de lista, más legible que la grilla mensual
function EventCalendar({ events, role = null, onSelectEvent, onSelectEmptyDate }) {
    const isCompact = useMediaQuery("(max-width: 767.98px)");
    const calendarEvents = useMemo(() => events.map((event) => toCalendarEvent(event, role)), [events, role]);

    const handleEventClick = ({ event, jsEvent }) => {
        jsEvent.preventDefault();
        onSelectEvent(event.id);
    };

    const handleDateClick = ({ date }) => {
        if (!hasEventOnDay(events, date)) {
            onSelectEmptyDate(date);
        }
    };

    return (
        <FullCalendar
            key={isCompact ? "compact" : "full"}
            plugins={PLUGINS}
            locale={esLocale}
            initialView={isCompact ? "listMonth" : "dayGridMonth"}
            headerToolbar={isCompact ? COMPACT_TOOLBAR : FULL_TOOLBAR}
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDisplay="block"
            eventTimeFormat={TIME_FORMAT}
            eventInteractive
            height="auto"
            dayMaxEvents={3}
            noEventsContent="No hay eventos en este período"
        />
    );
}

EventCalendar.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired
    })).isRequired,
    role: PropTypes.string,
    onSelectEvent: PropTypes.func.isRequired,
    onSelectEmptyDate: PropTypes.func.isRequired
};

export default EventCalendar;
