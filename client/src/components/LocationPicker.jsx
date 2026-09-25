import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { FORMOSA_CENTER } from "../lib/constants.js";
import { DEFAULT_ZOOM, DETAIL_ZOOM, OSM_ATTRIBUTION, OSM_TILE_URL, buildMarkerStyle, toLatLng } from "../lib/leaflet.js";

// 6 decimales equivalen a unos 10 cm: más precisión no aporta nada para ubicar un local o una feria
const COORDINATE_DECIMALS = 6;

const roundCoordinate = (value) => Number(value.toFixed(COORDINATE_DECIMALS));

const toValidPoint = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const isFilled = latitude !== "" && longitude !== "" && latitude !== null && longitude !== null;
    return isFilled && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
};

function PickOnClick({ onPick }) {
    useMapEvents({
        click: (event) => onPick(roundCoordinate(event.latlng.lat), roundCoordinate(event.latlng.lng))
    });
    return null;
}

// Mapa en el que se marca una ubicación con un clic; completa la latitud y la longitud del formulario
function LocationPicker({ latitude, longitude, onPick, label }) {
    const point = toValidPoint(latitude, longitude);
    // El centro y el zoom iniciales solo se calculan al montar: después el usuario mueve el mapa libremente
    const [initialView] = useState(() => ({ center: toLatLng(point ?? FORMOSA_CENTER), zoom: point ? DETAIL_ZOOM : DEFAULT_ZOOM }));
    const markerStyle = useMemo(() => buildMarkerStyle(true), []);

    return (
        <div className="mb-3">
            <p className="form-label fw-semibold mb-1">{label}</p>
            <p className="form-text mt-0">Hacé clic en el mapa para marcar la ubicación. Podés ajustar las coordenadas a mano abajo.</p>
            <div className="location-picker">
                <MapContainer className="location-picker-canvas" center={initialView.center} zoom={initialView.zoom} scrollWheelZoom={false}>
                    <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
                    <PickOnClick onPick={onPick} />
                    {point ? <CircleMarker center={toLatLng(point)} pathOptions={markerStyle} /> : null}
                </MapContainer>
            </div>
        </div>
    );
}

PickOnClick.propTypes = { onPick: PropTypes.func.isRequired };

LocationPicker.propTypes = {
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onPick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};

export default LocationPicker;
