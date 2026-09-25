import PropTypes from "prop-types";
import GoogleEventsMap from "./GoogleEventsMap.jsx";

// La clave se define en VITE_GOOGLE_MAPS_API_KEY (client/.env), nunca en el código
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function EventsMap({ events, selectedEventId = null, onSelectEvent }) {
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <p className="alert alert-info" role="status">
                El mapa interactivo no está disponible en este momento. Podés elegir el evento desde la lista.
            </p>
        );
    }
    return <GoogleEventsMap apiKey={GOOGLE_MAPS_API_KEY} events={events} selectedEventId={selectedEventId} onSelectEvent={onSelectEvent} />;
}

EventsMap.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedEventId: PropTypes.string,
    onSelectEvent: PropTypes.func.isRequired
};

export default EventsMap;
