import { lazy, Suspense } from "react";
import LoadingState from "./LoadingState.jsx";

// Leaflet se descarga recién cuando el formulario muestra el mapa, no en la carga inicial del sitio
const LocationPicker = lazy(() => import("./LocationPicker.jsx"));

function LazyLocationPicker(props) {
    return (
        <Suspense fallback={<LoadingState message="Cargando el mapa..." />}>
            <LocationPicker {...props} />
        </Suspense>
    );
}

export default LazyLocationPicker;
