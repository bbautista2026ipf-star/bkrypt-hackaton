import { useCallback, useEffect, useMemo } from "react";
import useForm from "./useForm.js";
import { EMPTY_PRODUCT, productToFormValues, validateProduct } from "../lib/productForm.js";
import { toAssetUrl } from "../lib/apiConfig.js";

// Vista previa de la imagen elegida; la URL temporal se libera al cambiarla o al salir
const useImagePreview = (file) => {
    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    }, [previewUrl]);

    return previewUrl;
};

function useProductForm(product, onSave) {
    const initialValues = useMemo(() => (product ? productToFormValues(product) : EMPTY_PRODUCT), [product]);
    const form = useForm(initialValues, validateProduct);
    const { submit, setFieldValue, values } = form;
    const newImagePreview = useImagePreview(values.image);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit(onSave);
    }, [submit, onSave]);

    const handleImageChange = useCallback((event) => {
        setFieldValue("image", event.target.files?.[0] ?? null);
        setFieldValue("remove_image", false);
    }, [setFieldValue]);

    const currentImageUrl = product?.image_url && !values.remove_image ? toAssetUrl(product.image_url) : null;

    return {
        ...form,
        handleSubmit,
        handleImageChange,
        imagePreviewUrl: newImagePreview ?? currentImageUrl,
        hasSavedImage: Boolean(product?.image_url)
    };
}

export default useProductForm;
