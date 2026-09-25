import { PRODUCT_CATEGORIES, PRODUCT_IMAGE_MAX_BYTES, PRODUCT_IMAGE_TYPES } from "./constants.js";
import { collectErrors, validateLength, validateNumberInRange } from "./validators.js";

export const EMPTY_PRODUCT = {
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
    image: null,
    remove_image: false
};

export const productToFormValues = (product) => ({
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(Number(product.price)),
    category: product.category ?? "",
    is_available: Boolean(product.is_available),
    image: null,
    remove_image: false
});

export const validateImage = (file) => {
    if (!file) {
        return null;
    }
    if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
        return "La imagen debe ser JPG, PNG o WEBP";
    }
    return file.size > PRODUCT_IMAGE_MAX_BYTES ? "La imagen supera el tamaño máximo permitido de 5 MB" : null;
};

export const validateProduct = (values) => collectErrors({
    name: validateLength(values.name, { label: "El nombre del producto", min: 2, max: 100 }),
    description: validateLength(values.description, { label: "La descripción", max: 2000, required: false }),
    price: validateNumberInRange(values.price, { label: "El precio", min: 0, max: 99999999.99, exclusiveMin: true }),
    category: PRODUCT_CATEGORIES.some((category) => category.value === values.category) ? null : "Elegí una categoría",
    image: validateImage(values.image)
});

// El backend recibe los productos como multipart/form-data: la imagen va como archivo en el campo "image"
export const toProductFormData = (values, { isEditing }) => {
    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("description", values.description.trim());
    formData.append("price", String(Number(values.price)));
    formData.append("category", values.category);
    formData.append("is_available", String(values.is_available));
    if (values.image) {
        formData.append("image", values.image);
    } else if (isEditing && values.remove_image) {
        formData.append("remove_image", "true");
    }
    return formData;
};
