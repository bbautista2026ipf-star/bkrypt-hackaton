import { useMemo } from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useMediaQuery from "../hooks/useMediaQuery.js";
import { hasFairOnDay, toCalendarEvent } from "../lib/calendarEvents.js";

const PLUGINS = [dayGridPlugin, listPlugin, interactionPlugin];
const COMPACT_TOOLBAR = { left: "prev,next", center: "title", right: "today" };
const FULL_TOOLBAR = { left: "prev,next today", center: "title", right: "dayGridMonth,listMonth" };
const TIME_FORMAT = { hour: "2-digit", minute: "2-digit", hour12: false };

// Cada entrada del calendario es una jornada de feria (una ubicación en un día). En móvil se usa la vista de lista.
function EventCalendar({ fairDays, ownProfileId = null, onSelectFairDay, onSelectEmptyDate }) {
    const isCompact = useMediaQuery("(max-width: 767.98px)");
    const calendarEvents = useMemo(() => fairDays.map((fairDay) => toCalendarEvent(fairDay, ownProfileId)), [fairDays, ownProfileId]);

    const handleEventClick = ({ event, jsEvent }) => {
        jsEvent.preventDefault();
        onSelectFairDay(event.id);
    };

    const handleDateClick = ({ date }) => {
        if (!hasFairOnDay(fairDays, date)) {
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
            noEventsContent="No hay ferias en este período"
        />
    );
}

EventCalendar.propTypes = {
    fairDays: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired
    })).isRequired,
    ownProfileId: PropTypes.string,
    onSelectFairDay: PropTypes.func.isRequired,
    onSelectEmptyDate: PropTypes.func.isRequired
};

export default EventCalendar;
