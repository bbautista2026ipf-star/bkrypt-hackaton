import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import useConfirmation from "./useConfirmation.js";
import { deleteProduct, getProducts } from "../services/product.service.js";

const ADMIN_PAGE_SIZE = 20;

// Moderación: el administrador puede eliminar cualquier producto publicado (el backend lo permite solo a su rol)
function useAdminProducts() {
    const [page, setPage] = useState(1);
    const loadProducts = useCallback(() => getProducts({ page, limit: ADMIN_PAGE_SIZE }), [page]);
    const { data, status, error, reload } = useAsyncData(loadProducts);

    const removal = useConfirmation(useCallback(async (product) => {
        await deleteProduct(product.id);
        reload();
    }, [reload]));

    return {
        products: data?.products ?? [],
        pagination: data?.pagination ?? null,
        page,
        setPage,
        status,
        error,
        reload,
        removal
    };
}

export default useAdminProducts;
