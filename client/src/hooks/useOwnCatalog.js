import { useCallback } from "react";
import useAuth from "./useAuth.js";
import useAsyncData from "./useAsyncData.js";
import { getEntrepreneur } from "../services/entrepreneur.service.js";
import { deleteProduct } from "../services/product.service.js";

// "Mi catálogo": el perfil propio se identifica con la sesión (/auth/me) y se lee del perfil público.
// Borrar un producto ajeno lo rechaza el backend (403), aunque el botón solo aparezca en productos propios.
function useOwnCatalog() {
    const { entrepreneurProfile } = useAuth();
    const profileId = entrepreneurProfile?.id ?? null;
    const loadProfile = useCallback(() => getEntrepreneur(profileId), [profileId]);
    const { data, status, error, reload, setData } = useAsyncData(loadProfile, { enabled: Boolean(profileId) });

    const removeProduct = useCallback(async (product) => {
        await deleteProduct(product.id);
        setData((previous) => ({
            ...previous,
            entrepreneur: {
                ...previous.entrepreneur,
                products: previous.entrepreneur.products.filter((existing) => existing.id !== product.id)
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
