import { useCallback } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth.js";
import useAsyncData from "./useAsyncData.js";
import useForbiddenRedirect from "./useForbiddenRedirect.js";
import { ApiError } from "../services/apiClient.js";
import { createProduct, getProduct, updateProduct } from "../services/product.service.js";
import { PATHS } from "../lib/constants.js";
import { toProductFormData } from "../lib/productForm.js";

// Alta y edición de productos. Si el producto es de otro emprendimiento se redirige a la página de permisos;
// el backend igual responde 403 si alguien intenta guardarlo.
function useProductEditor(productId) {
    const navigate = useNavigate();
    const { entrepreneurProfile } = useAuth();
    const ownProfileId = entrepreneurProfile?.id ?? null;

    const loadProduct = useCallback(async () => {
        if (!productId) {
            return null;
        }
        const { product } = await getProduct(productId);
        if (product.entrepreneur.id !== ownProfileId) {
            throw new ApiError(403, "Ese producto pertenece a otro emprendimiento");
        }
        return product;
    }, [productId, ownProfileId]);

    const { data: product, status, error } = useAsyncData(loadProduct);
    useForbiddenRedirect(error);

    const saveProduct = useCallback(async (values) => {
        const productData = toProductFormData(values, { isEditing: Boolean(productId) });
        if (productId) {
            await updateProduct(productId, productData);
        } else {
            await createProduct(productData);
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
