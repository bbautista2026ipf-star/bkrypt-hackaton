import { useCallback } from "react";
import { useNavigate } from "react-router";
import useAsyncData from "./useAsyncData.js";
import useForbiddenRedirect from "./useForbiddenRedirect.js";
import { ApiError } from "../services/apiClient.js";
import { getOwnEntrepreneurProfile } from "../services/entrepreneur.service.js";
import { createProduct, getProduct, updateProduct } from "../services/product.service.js";
import { PATHS } from "../lib/constants.js";
import { toProductPayload } from "../lib/productForm.js";

// Busca el producto dentro del catálogo propio: el servidor responde 403 si quien pide no es emprendedor.
// Si el producto existe pero es de otro emprendedor, también es un problema de permisos.
const findOwnProduct = async (productId) => {
    const { entrepreneur } = await getOwnEntrepreneurProfile();
    if (!productId) {
        return null;
    }
    const ownProduct = entrepreneur.products.find((product) => product.id === productId);
    if (ownProduct) {
        return ownProduct;
    }
    await getProduct(productId);
    throw new ApiError(403, "Ese producto pertenece a otro emprendimiento");
};

function useProductEditor(productId) {
    const navigate = useNavigate();
    const loadProduct = useCallback(() => findOwnProduct(productId), [productId]);
    const { data: product, status, error } = useAsyncData(loadProduct);
    useForbiddenRedirect(error);

    const saveProduct = useCallback(async (values) => {
        const payload = toProductPayload(values);
        if (productId) {
            await updateProduct(productId, payload);
        } else {
            await createProduct(payload);
        }
        navigate(PATHS.myCatalog, { state: { flash: productId ? "Producto actualizado" : "Producto publicado" } });
    }, [productId, navigate]);

    return {
        isEditing: Boolean(productId),
        product,
        status,
        error,
        saveProduct
    };
}

export default useProductEditor;
