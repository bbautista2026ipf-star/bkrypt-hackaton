import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import useConfirmation from "./useConfirmation.js";
import { deleteProduct, getProducts, updateProductImage } from "../services/product.service.js";

const ADMIN_PAGE_SIZE = 20;

// Moderación: el administrador puede eliminar cualquier producto publicado o cambiar su imagen (el backend lo permite solo a su rol)
function useAdminProducts() {
    const [page, setPage] = useState(1);
    const loadProducts = useCallback(() => getProducts({ page, limit: ADMIN_PAGE_SIZE }), [page]);
    const { data, status, error, reload, setData } = useAsyncData(loadProducts);
    // Abrir y cerrar se separan del producto: el modal conserva lo que mostraba durante su animación de salida
    const [imageEditor, setImageEditor] = useState({ product: null, isOpen: false, version: 0 });

    const openImageEditor = useCallback((product) => {
        setImageEditor((previous) => ({ product, isOpen: true, version: previous.version + 1 }));
    }, []);

    const closeImageEditor = useCallback(() => setImageEditor((previous) => ({ ...previous, isOpen: false })), []);

    // imageData: FormData con la imagen nueva o remove_image; el producto del listado se actualiza sin recargar la página
    const saveProductImage = useCallback(async (imageData) => {
        const { product: updatedProduct } = await updateProductImage(imageEditor.product.id, imageData);
        setData((previous) => ({
            ...previous,
            products: previous.products.map((product) => (product.id === updatedProduct.id ? { ...product, image_url: updatedProduct.image_url } : product))
        }));
        closeImageEditor();
    }, [imageEditor.product, setData, closeImageEditor]);

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
        removal,
        imageEditor,
        openImageEditor,
        closeImageEditor,
        saveProductImage
    };
}

export default useAdminProducts;
