import { useMemo } from "react";
import useSearchFilters from "./useSearchFilters.js";
import useGeolocation from "./useGeolocation.js";
import useDebouncedValue from "./useDebouncedValue.js";

const SEARCH_DEBOUNCE_MS = 350;

// Traduce los filtros de la URL a los parámetros de GET /products (compartido por el catálogo y el mapa).
// La distancia la calcula el backend: el frontend solo envía la ubicación y el radio.
function useSearchQuery() {
    const searchFilters = useSearchFilters();
    const { filters } = searchFilters;
    const location = useGeolocation(filters.nearby);
    const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS);

    const coords = filters.nearby ? location.coords : null;
    const isWaitingForLocation = filters.nearby && location.status === "locating";

    const productFilters = useMemo(() => ({
        category: filters.category,
        search: debouncedSearch.trim(),
        available: filters.onlyAvailable ? "true" : "",
        lat: coords?.lat,
        lng: coords?.lng,
        radius_km: coords ? filters.radius : undefined
    }), [filters.category, filters.onlyAvailable, filters.radius, debouncedSearch, coords]);

    return {
        ...searchFilters,
        location,
        productFilters,
        isWaitingForLocation,
        isSortedByDistance: Boolean(coords)
    };
}

export default useSearchQuery;
