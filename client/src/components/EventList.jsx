import PropTypes from "prop-types";
import { formatDistance, formatEventSchedule, pluralize } from "../lib/formatters.js";

// Alternativa accesible al mapa: los mismos eventos como botones navegables con teclado
function EventList({ events, selectedEventId = null, onSelectEvent }) {
    return (
        <div className="list-group">
            {events.map((event) => {
                const distance = formatDistance(event.distance_km);
                const isSelected = event.id === selectedEventId;
                return (
                    <button
                        key={event.id}
                        type="button"
                        className={`list-group-item list-group-item-action event-list-item${isSelected ? " is-selected" : ""}`}
                        aria-current={isSelected ? "true" : undefined}
                        onClick={() => onSelectEvent(event.id)}
                    >
                        <span className="d-flex flex-wrap align-items-center gap-2">
                            <span className="fw-bold">{event.title}</span>
                            {event.is_active_now ? <span className="badge badge-brand-yellow">En curso</span> : null}
                        </span>
                        <span className="d-block">{formatEventSchedule(event.starts_at, event.ends_at)}</span>
                        <span className="d-block text-body-secondary">
                            {event.location.name}
                            {distance ? ` · ${distance}` : ""}
                            {` · ${pluralize(event.participants_count, "emprendedor", "emprendedores")}`}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

EventList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired,
        ends_at: PropTypes.string.isRequired,
        is_active_now: PropTypes.bool,
        distance_km: PropTypes.number,
        participants_count: PropTypes.number.isRequired,
        location: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired
    })).isRequired,
    selectedEventId: PropTypes.string,
    onSelectEvent: PropTypes.func.isRequired
};

export default EventList;
