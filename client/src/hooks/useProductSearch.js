import { useCallback } from "react";
import useSearchQuery from "./useSearchQuery.js";
import useAsyncData from "./useAsyncData.js";
import { getProducts } from "../services/product.service.js";
import { CATALOG_PAGE_SIZE } from "../lib/constants.js";

// Página actual del catálogo para los filtros de la URL
function useProductSearch() {
    const search = useSearchQuery();
    const { productFilters, filters } = search;

    const loadResults = useCallback(
        () => getProducts({ ...productFilters, page: filters.page, limit: CATALOG_PAGE_SIZE }),
        [productFilters, filters.page]
    );
    const results = useAsyncData(loadResults, { enabled: !search.isWaitingForLocation });

    return {
        ...search,
        products: results.data?.products ?? [],
        pagination: results.data?.pagination ?? null,
        status: search.isWaitingForLocation ? "loading" : results.status,
        hasResults: results.data !== null,
        error: results.error,
        reload: results.reload
    };
}

export default useProductSearch;
