import { useCallback } from "react";
import useAsyncData from "./useAsyncData.js";
import useForbiddenRedirect from "./useForbiddenRedirect.js";
import { getOwnEntrepreneurProfile } from "../services/entrepreneur.service.js";
import { deleteProduct } from "../services/product.service.js";

// "Mi catálogo": solo los productos del emprendedor con sesión. El backend responde 403 a cualquier otro rol.
function useOwnCatalog() {
    const { data, status, error, reload, setData } = useAsyncData(getOwnEntrepreneurProfile);
    useForbiddenRedirect(error);

    const removeProduct = useCallback(async (productId) => {
        await deleteProduct(productId);
        setData((previous) => ({
            ...previous,
            entrepreneur: {
                ...previous.entrepreneur,
                products: previous.entrepreneur.products.filter((product) => product.id !== productId)
            }
        }));
    }, [setData]);

    return {
        entrepreneur: data?.entrepreneur ?? null,
        products: data?.entrepreneur?.products ?? [],
        status,
        error,
        reload,
        removeProduct
    };
}

export default useOwnCatalog;
