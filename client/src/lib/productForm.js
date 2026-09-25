import { PRODUCT_CATEGORIES } from "./constants.js";
import { collectErrors, validateLength, validateNumberInRange, validateOptionalUrl } from "./validators.js";

export const EMPTY_PRODUCT = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image_url: ""
};

export const productToFormValues = (product) => ({
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(Number(product.price)),
    stock: String(product.stock),
    category: product.category ?? "",
    image_url: product.image_url ?? ""
});

export const validateProduct = (values) => collectErrors({
    name: validateLength(values.name, { label: "El nombre del producto", min: 2, max: 100 }),
    description: validateLength(values.description, { label: "La descripción", max: 2000, required: false }),
    price: validateNumberInRange(values.price, { label: "El precio", min: 0, max: 99999999.99, exclusiveMin: true }),
    stock: validateNumberInRange(values.stock, { label: "El stock", min: 0, max: 100000, integer: true }),
    category: PRODUCT_CATEGORIES.some((category) => category.value === values.category) ? null : "Elegí una categoría",
    image_url: validateOptionalUrl(values.image_url, "La imagen")
});

export const toProductPayload = (values) => ({
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    category: values.category,
    image_url: values.image_url.trim()
});
