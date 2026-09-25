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
const SINGLE_FAIR_ZOOM = 15;
const BOUNDS_PADDING_PX = 48;

const toPosition = (fair) => ({ lat: fair.location.latitude, lng: fair.location.longitude });

const buildMarkerIcon = (isSelected) => ({
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isSelected ? 13 : 10,
    fillColor: readCssVariable(isSelected ? "--brand-yellow" : "--brand-fuchsia"),
    fillOpacity: 1,
    strokeColor: readCssVariable(isSelected ? "--brand-fuchsia" : "--brand-white"),
    strokeWeight: 3
});

// Un marcador por feria con horarios próximos; al hacer clic abre su InfoWindow y avisa a la página para desplazarse al listado
function GoogleFairsMap({ apiKey, fairs, selectedFairId = null, onSelectFair }) {
    const { isLoaded, loadError } = useJsApiLoader({ id: "formobuy-google-maps", googleMapsApiKey: apiKey, language: "es", region: "AR" });
    const [map, setMap] = useState(null);
    const [openFairId, setOpenFairId] = useState(null);
    const [hasFairsInView, setHasFairsInView] = useState(true);

    const markerIcons = useMemo(
        () => (isLoaded ? { default: buildMarkerIcon(false), selected: buildMarkerIcon(true) } : null),
        [isLoaded]
    );

    // Encuadra los marcadores cuando cambian los resultados del buscador, sin volver a crear el mapa
    useEffect(() => {
        if (!map || fairs.length === 0) {
            return;
        }
        if (fairs.length === 1) {
            map.setCenter(toPosition(fairs[0]));
            map.setZoom(SINGLE_FAIR_ZOOM);
            return;
        }
        const bounds = new window.google.maps.LatLngBounds();
        fairs.forEach((fair) => bounds.extend(toPosition(fair)));
        map.fitBounds(bounds, BOUNDS_PADDING_PX);
    }, [map, fairs]);

    // Si el usuario mueve el mapa a una zona sin ferias, se le avisa en lugar de dejarle un mapa vacío
    const updateFairsInView = useCallback(() => {
        const bounds = map?.getBounds();
        if (bounds) {
            setHasFairsInView(fairs.some((fair) => bounds.contains(toPosition(fair))));
        }
    }, [map, fairs]);

    const handleMarkerClick = useCallback((fairId) => {
        setOpenFairId(fairId);
        onSelectFair(fairId);
    }, [onSelectFair]);

    const handleUnmount = useCallback(() => setMap(null), []);

    if (loadError) {
        return <p className="alert alert-warning" role="alert">No se pudo cargar el mapa. Podés elegir la feria desde la lista.</p>;
    }
    if (!isLoaded) {
        return <LoadingState message="Cargando el mapa..." />;
    }

    const openFair = fairs.find((fair) => fair.id === openFairId) ?? null;

    return (
        <div className="fairs-map">
            <GoogleMap
                mapContainerClassName="fairs-map-canvas"
                center={FORMOSA_CENTER}
                zoom={DEFAULT_ZOOM}
                options={MAP_OPTIONS}
                onLoad={setMap}
                onUnmount={handleUnmount}
                onIdle={updateFairsInView}
            >
                {fairs.map((fair) => (
                    <MarkerF
                        key={fair.id}
                        position={toPosition(fair)}
                        title={fair.title}
                        icon={fair.id === selectedFairId ? markerIcons.selected : markerIcons.default}
                        onClick={() => handleMarkerClick(fair.id)}
                    />
                ))}
                {openFair ? (
                    <InfoWindowF position={toPosition(openFair)} onCloseClick={() => setOpenFairId(null)}>
                        <div className="map-info-window">
                            <p className="fw-bold mb-1">{openFair.title}</p>
                            <p className="mb-0">{pluralize(openFair.participants_count, "emprendedor presente", "emprendedores presentes")}</p>
                        </div>
                    </InfoWindowF>
                ) : null}
            </GoogleMap>
            {hasFairsInView ? null : (
                <p className="alert alert-light border map-overlay-message" role="status">
                    No hay ferias activas en esta zona del mapa. Alejá el mapa o elegí una feria de la lista.
                </p>
            )}
        </div>
    );
}

GoogleFairsMap.propTypes = {
    apiKey: PropTypes.string.isRequired,
    fairs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        participants_count: PropTypes.number.isRequired,
        location: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired
        }).isRequired
    })).isRequired,
    selectedFairId: PropTypes.string,
    onSelectFair: PropTypes.func.isRequired
};

// memo: el mapa solo se vuelve a renderizar si cambian las ferias o la selección (cuida la cuota de la API)
export default memo(GoogleFairsMap);
