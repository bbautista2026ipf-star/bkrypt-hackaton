import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { DEFAULT_SEARCH_RADIUS, PRODUCT_CATEGORIES, SEARCH_RADIUS_OPTIONS } from "../lib/constants.js";

// Nombre de cada filtro en la URL
const PARAM_NAMES = {
    category: "categoria",
    search: "buscar",
    onlyAvailable: "disponibles",
    nearby: "cerca",
    radius: "radio",
    page: "pagina"
};

const serializeFilter = (value) => {
    if (value === true) {
        return "1";
    }
    return value === false || value === null || value === undefined ? "" : String(value);
};

const toPageNumber = (value) => {
    const page = Number(value);
    return Number.isInteger(page) && page > 1 ? page : 1;
};

// Estado único de filtros del buscador: vive en la URL, así el catálogo y el mapa leen lo mismo y quedan sincronizados
// (también al pasar de una página a la otra o al compartir el enlace)
function useSearchFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(() => {
        const category = searchParams.get(PARAM_NAMES.category);
        const radius = Number(searchParams.get(PARAM_NAMES.radius));
        return {
            category: PRODUCT_CATEGORIES.some((option) => option.value === category) ? category : "",
            search: searchParams.get(PARAM_NAMES.search) ?? "",
            onlyAvailable: searchParams.get(PARAM_NAMES.onlyAvailable) === "1",
            nearby: searchParams.get(PARAM_NAMES.nearby) === "1",
            radius: SEARCH_RADIUS_OPTIONS.includes(radius) ? radius : DEFAULT_SEARCH_RADIUS,
            page: toPageNumber(searchParams.get(PARAM_NAMES.page))
        };
    }, [searchParams]);

    // Cambiar cualquier filtro vuelve a la primera página; cambiar solo la página conserva el resto
    const updateFilters = useCallback((changes) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            const nextChanges = "page" in changes ? changes : { ...changes, page: null };
            Object.entries(nextChanges).forEach(([name, value]) => {
                const serialized = name === "page" && value === 1 ? "" : serializeFilter(value);
                if (serialized === "") {
                    nextParams.delete(PARAM_NAMES[name]);
                } else {
                    nextParams.set(PARAM_NAMES[name], serialized);
                }
            });
            return nextParams;
        }, { replace: true });
    }, [setSearchParams]);

    const clearFilters = useCallback(() => {
        updateFilters({ category: "", search: "", onlyAvailable: false, nearby: false, radius: null });
    }, [updateFilters]);

    const hasActiveFilters = Boolean(filters.category || filters.search || filters.onlyAvailable || filters.nearby);

    return { filters, updateFilters, clearFilters, hasActiveFilters };
}

export default useSearchFilters;
