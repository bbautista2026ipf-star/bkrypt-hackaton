import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import LoadingState from "./LoadingState.jsx";
import { FORMOSA_CENTER } from "../lib/constants.js";
import { pluralize } from "../lib/formatters.js";
import { readCssVariable } from "../lib/cssTokens.js";

// Objetos fijos a nivel de módulo: GoogleMap recibe siempre las mismas referencias y no se vuelve a configurar en cada render
const MAP_OPTIONS = {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    gestureHandling: "cooperative"
};
const DEFAULT_ZOOM = 13;
const SINGLE_EVENT_ZOOM = 15;
const BOUNDS_PADDING_PX = 48;

const toPosition = (event) => ({ lat: event.location.latitude, lng: event.location.longitude });

const buildMarkerIcon = (isSelected) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isSelected ? 13 : 10,
    fillColor: readCssVariable(isSelected ? "--brand-yellow" : "--brand-fuchsia"),
    fillOpacity: 1,
    strokeColor: readCssVariable(isSelected ? "--brand-fuchsia" : "--brand-white"),
    strokeWeight: 3
});

// Un marcador por evento confirmado; al hacer clic abre su InfoWindow y avisa a la página para desplazarse al listado
function GoogleEventsMap({ apiKey, events, selectedEventId = null, onSelectEvent }) {
    const { isLoaded, loadError } = useJsApiLoader({ id: "formobuy-google-maps", googleMapsApiKey: apiKey, language: "es", region: "AR" });
    const [map, setMap] = useState(null);
    const [openEventId, setOpenEventId] = useState(null);
    const [hasEventsInView, setHasEventsInView] = useState(true);

    const markerIcons = useMemo(
        () => (isLoaded ? { default: buildMarkerIcon(false), selected: buildMarkerIcon(true) } : null),
        [isLoaded]
    );

    // Encuadra los marcadores cuando cambian los resultados del buscador, sin volver a crear el mapa
    useEffect(() => {
        if (!map || events.length === 0) {
            return;
        }
        if (events.length === 1) {
            map.setCenter(toPosition(events[0]));
            map.setZoom(SINGLE_EVENT_ZOOM);
            return;
        }
        const bounds = new window.google.maps.LatLngBounds();
        events.forEach((event) => bounds.extend(toPosition(event)));
        map.fitBounds(bounds, BOUNDS_PADDING_PX);
    }, [map, events]);

    // Si el usuario mueve el mapa a una zona sin eventos, se le avisa en lugar de dejarle un mapa vacío
    const updateEventsInView = useCallback(() => {
        const bounds = map?.getBounds();
        if (bounds) {
            setHasEventsInView(events.some((event) => bounds.contains(toPosition(event))));
        }
    }, [map, events]);

    const handleMarkerClick = useCallback((eventId) => {
        setOpenEventId(eventId);
        onSelectEvent(eventId);
    }, [onSelectEvent]);

    const handleUnmount = useCallback(() => setMap(null), []);

    if (loadError) {
        return <p className="alert alert-warning" role="alert">No se pudo cargar el mapa. Podés elegir el evento desde la lista.</p>;
    }
    if (!isLoaded) {
        return <LoadingState message="Cargando el mapa..." />;
    }

    const openEvent = events.find((event) => event.id === openEventId) ?? null;

    return (
        <div className="events-map">
            <GoogleMap
                mapContainerClassName="events-map-canvas"
                center={FORMOSA_CENTER}
                zoom={DEFAULT_ZOOM}
                options={MAP_OPTIONS}
                onLoad={setMap}
                onUnmount={handleUnmount}
                onIdle={updateEventsInView}
            >
                {events.map((event) => (
                    <MarkerF
                        key={event.id}
                        position={toPosition(event)}
                        title={event.title}
                        icon={event.id === selectedEventId ? markerIcons.selected : markerIcons.default}
                        onClick={() => handleMarkerClick(event.id)}
                    />
                ))}
                {openEvent ? (
                    <InfoWindowF position={toPosition(openEvent)} onCloseClick={() => setOpenEventId(null)}>
                        <div className="map-info-window">
                            <p className="fw-bold mb-1">{openEvent.title}</p>
                            <p className="mb-0">{pluralize(openEvent.participants_count, "emprendedor presente", "emprendedores presentes")}</p>
                        </div>
                    </InfoWindowF>
                ) : null}
            </GoogleMap>
            {hasEventsInView ? null : (
                <p className="alert alert-light border map-overlay-message" role="status">
                    No hay eventos activos en esta zona del mapa. Alejá el mapa o elegí un evento de la lista.
                </p>
            )}
        </div>
    );
}

GoogleEventsMap.propTypes = {
    apiKey: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        participants_count: PropTypes.number.isRequired,
        location: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired
        }).isRequired
    })).isRequired,
    selectedEventId: PropTypes.string,
    onSelectEvent: PropTypes.func.isRequired
};

// memo: el mapa solo se vuelve a renderizar si cambian los eventos o la selección (cuida la cuota de la API)
export default memo(GoogleEventsMap);
