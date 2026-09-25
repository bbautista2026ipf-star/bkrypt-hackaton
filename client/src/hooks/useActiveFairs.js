import { useCallback } from "react";
import useSearchQuery from "./useSearchQuery.js";
import useAsyncData from "./useAsyncData.js";
import { getSchedules } from "../services/schedule.service.js";
import { getAllMatchingProducts } from "../services/product.service.js";
import { getFairSessions } from "../services/eventLocation.service.js";
import { buildActiveFairs } from "../lib/fairs.js";

// Sin filtros se muestran todas las ferias con jornadas u horarios próximos. Con filtros, cada feria conserva solo a los emprendedores
// cuyos productos cumplen todos los filtros (el backend resuelve la búsqueda y la cercanía; acá solo se cruzan los resultados).
const hasProductFilters = (productFilters) => Boolean(
    productFilters.category || productFilters.search || productFilters.available || productFilters.lat !== undefined
);

const loadActiveFairs = async (productFilters) => {
    const [{ schedules }, { sessions }, matchingProducts] = await Promise.all([
        getSchedules(),
        getFairSessions(),
        hasProductFilters(productFilters) ? getAllMatchingProducts(productFilters) : Promise.resolve(null)
    ]);
    const matchingEntrepreneurIds = matchingProducts
        ? new Set(matchingProducts.map((product) => product.entrepreneur_profile_id))
        : null;
    return buildActiveFairs(schedules, sessions, matchingEntrepreneurIds);
};

function useActiveFairs() {
    const search = useSearchQuery();
    const { productFilters } = search;

    const loadFairs = useCallback(() => loadActiveFairs(productFilters), [productFilters]);
    const results = useAsyncData(loadFairs, { enabled: !search.isWaitingForLocation });

    return {
        ...search,
        fairs: results.data ?? [],
        status: search.isWaitingForLocation ? "loading" : results.status,
        hasResults: results.data !== null,
        error: results.error,
        reload: results.reload
    };
}

export default useActiveFairs;
