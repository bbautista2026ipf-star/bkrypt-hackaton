import { useCallback } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth.js";
import useAsyncData from "./useAsyncData.js";
import useConfirmation from "./useConfirmation.js";
import { deleteProduct, getProduct } from "../services/product.service.js";
import { deleteReview, rateProduct } from "../services/review.service.js";
import { PATHS, ROLES } from "../lib/constants.js";

// Detalle de producto con sus reseñas. Los permisos se muestran según el rol, pero el backend los vuelve a validar:
// consumidores y emprendedores califican (no sus propios productos); el autor o el administrador borran una reseña.
function useProductDetail(productId) {
    const navigate = useNavigate();
    const { user, role, entrepreneurProfile, isAuthenticated } = useAuth();
    const loadProduct = useCallback(() => getProduct(productId), [productId]);
    const { data, status, error, reload } = useAsyncData(loadProduct);
    const product = data?.product ?? null;

    const isOwnProduct = Boolean(product && entrepreneurProfile && product.entrepreneur.id === entrepreneurProfile.id);
    const canReview = isAuthenticated && [ROLES.consumer, ROLES.entrepreneur].includes(role) && !isOwnProduct;
    const ownReview = product?.reviews.find((review) => review.author.id === user?.id) ?? null;
    const canDeleteReview = useCallback((review) => role === ROLES.admin || review.author.id === user?.id, [role, user]);

    // Se recarga el producto para que la reseña aparezca con su autor y el promedio quede actualizado
    const submitReview = useCallback(async (review) => {
        await rateProduct(productId, review);
        reload();
    }, [productId, reload]);

    const reviewRemoval = useConfirmation(useCallback(async (review) => {
        await deleteReview(review.id);
        reload();
    }, [reload]));

    const productRemoval = useConfirmation(useCallback(async () => {
        await deleteProduct(productId);
        navigate(PATHS.catalog, { state: { flash: "Producto eliminado" } });
    }, [productId, navigate]));

    return {
        product,
        status,
        error,
        reload,
        isOwnProduct,
        canReview,
        ownReview,
        canDeleteReview,
        canDeleteProduct: role === ROLES.admin || isOwnProduct,
        submitReview,
        reviewRemoval,
        productRemoval
    };
}

export default useProductDetail;
