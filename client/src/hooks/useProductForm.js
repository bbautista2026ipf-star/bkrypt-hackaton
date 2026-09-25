import { useCallback, useMemo } from "react";
import useForm from "./useForm.js";
import { EMPTY_PRODUCT, productToFormValues, validateProduct } from "../lib/productForm.js";

function useProductForm(product, onSave) {
    const initialValues = useMemo(() => (product ? productToFormValues(product) : EMPTY_PRODUCT), [product]);
    const form = useForm(initialValues, validateProduct);
    const { submit } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit(onSave);
    }, [submit, onSave]);

    return { ...form, handleSubmit };
}

export default useProductForm;
