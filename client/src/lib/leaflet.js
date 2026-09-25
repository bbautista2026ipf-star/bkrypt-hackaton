// Los estilos de Leaflet se cargan junto con los mapas (que se descargan bajo demanda), no en la carga inicial
import "leaflet/dist/leaflet.css";
import { readCssVariable } from "./cssTokens.js";

// Mapas de OpenStreetMap: no requieren clave de API. La atribución es obligatoria por su licencia.
export const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const DEFAULT_ZOOM = 13;
export const DETAIL_ZOOM = 16;

// Leaflet usa [latitud, longitud]
export const toLatLng = ({ lat, lng }) => [lat, lng];

// Marcadores circulares con la paleta del sitio: evitan depender de las imágenes de marcador de Leaflet
export const buildMarkerStyle = (isSelected) => ({
    radius: isSelected ? 13 : 10,
    color: readCssVariable(isSelected ? "--brand-fuchsia" : "--brand-white"),
    weight: 3,
    fillColor: readCssVariable(isSelected ? "--brand-yellow" : "--brand-fuchsia"),
    fillOpacity: 1
});
