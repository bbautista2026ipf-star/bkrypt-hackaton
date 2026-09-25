import { useCallback, useMemo } from "react";
import useSearchFilters from "./useSearchFilters.js";
import useGeolocation from "./useGeolocation.js";
import useDebouncedValue from "./useDebouncedValue.js";
import useAsyncData from "./useAsyncData.js";
import { searchProducts } from "../services/product.service.js";

const SEARCH_DEBOUNCE_MS = 350;

// Resultados del buscador avanzado (productos + eventos del mapa) para los filtros actuales de la URL
function useProductSearch() {
    const { filters, updateFilters, clearFilters, hasActiveFilters } = useSearchFilters();
    const location = useGeolocation(filters.nearby);
    const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS);

    const coords = filters.nearby ? location.coords : null;
    const isWaitingForLocation = filters.nearby && location.status === "locating";

    const query = useMemo(() => ({
        category: filters.category,
        search: debouncedSearch.trim(),
        available: filters.onlyAvailable ? "true" : "",
        lat: coords?.lat,
        lng: coords?.lng,
        radius: coords ? filters.radius : undefined
    }), [filters.category, filters.onlyAvailable, filters.radius, debouncedSearch, coords]);

    const loadResults = useCallback(() => searchProducts(query), [query]);
    const results = useAsyncData(loadResults, { enabled: !isWaitingForLocation });

    return {
        filters,
        updateFilters,
        clearFilters,
        hasActiveFilters,
        location,
        isSortedByDistance: Boolean(coords),
        products: results.data?.products ?? [],
        events: results.data?.events ?? [],
        status: isWaitingForLocation ? "loading" : results.status,
        hasResults: results.data !== null,
        error: results.error,
        reload: results.reload
    };
}

export default useProductSearch;
