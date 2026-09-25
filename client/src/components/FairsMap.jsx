import { memo, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { FORMOSA_CENTER } from "../lib/constants.js";
import { formatEventSchedule, pluralize } from "../lib/formatters.js";
import { DEFAULT_ZOOM, DETAIL_ZOOM, OSM_ATTRIBUTION, OSM_TILE_URL, buildMarkerStyle, toLatLng } from "../lib/leaflet.js";

const BOUNDS_PADDING_PX = 48;

const toFairLatLng = (fair) => [fair.location.latitude, fair.location.longitude];

// Encuadra los marcadores cuando cambian los resultados del buscador, sin volver a crear el mapa
function FitFairsBounds({ fairs }) {
    const map = useMap();
    useEffect(() => {
        if (fairs.length === 0) {
            return;
        }
        if (fairs.length === 1) {
            map.setView(toFairLatLng(fairs[0]), DETAIL_ZOOM);
            return;
        }
        map.fitBounds(fairs.map(toFairLatLng), { padding: [BOUNDS_PADDING_PX, BOUNDS_PADDING_PX] });
    }, [map, fairs]);
    return null;
}

// Si el usuario mueve el mapa a una zona sin ferias, se le avisa en lugar de dejarle un mapa vacío
function TrackFairsInView({ fairs, onChange }) {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onChange(fairs.some((fair) => bounds.contains(toFairLatLng(fair))));
        }
    });
    return null;
}

// Un marcador por feria con jornadas u horarios próximos; al hacer clic abre su detalle y avisa a la página para desplazarse al listado
function FairsMap({ fairs, selectedFairId = null, onSelectFair }) {
    const [hasFairsInView, setHasFairsInView] = useState(true);
    const markerStyles = useMemo(() => ({ default: buildMarkerStyle(false), selected: buildMarkerStyle(true) }), []);
    const handleMarkerClick = useCallback((fairId) => onSelectFair(fairId), [onSelectFair]);

    return (
        <div className="fairs-map">
            <MapContainer className="fairs-map-canvas" center={toLatLng(FORMOSA_CENTER)} zoom={DEFAULT_ZOOM} scrollWheelZoom={false}>
                <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
                <FitFairsBounds fairs={fairs} />
                <TrackFairsInView fairs={fairs} onChange={setHasFairsInView} />
                {fairs.map((fair) => (
                    <CircleMarker
                        key={fair.id}
                        center={toFairLatLng(fair)}
                        pathOptions={fair.id === selectedFairId ? markerStyles.selected : markerStyles.default}
                        eventHandlers={{ click: () => handleMarkerClick(fair.id) }}
                    >
                        <Popup>
                            <div className="map-info-window">
                                <p className="fw-bold mb-1">{fair.title}</p>
                                <p className="mb-1">Próxima jornada: {formatEventSchedule(fair.starts_at, fair.ends_at)}</p>
                                <p className="mb-0">{pluralize(fair.participants_count, "emprendedor presente", "emprendedores presentes")}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            {hasFairsInView ? null : (
                <p className="alert alert-light border map-overlay-message" role="status">
                    No hay ferias activas en esta zona del mapa. Alejá el mapa o elegí una feria de la lista.
                </p>
            )}
        </div>
    );
}

const fairsPropType = PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    participants_count: PropTypes.number.isRequired,
    location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
    }).isRequired
}));

FitFairsBounds.propTypes = { fairs: fairsPropType.isRequired };
TrackFairsInView.propTypes = { fairs: fairsPropType.isRequired, onChange: PropTypes.func.isRequired };

FairsMap.propTypes = {
    fairs: fairsPropType.isRequired,
    selectedFairId: PropTypes.string,
    onSelectFair: PropTypes.func.isRequired
};

// memo: el mapa solo se vuelve a renderizar si cambian las ferias o la selección
export default memo(FairsMap);
