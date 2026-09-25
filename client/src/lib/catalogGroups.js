import { PRODUCT_CATEGORIES } from "./constants.js";

// Agrupa los productos por categoría, en el orden fijo de las categorías, omitiendo las vacías
export const groupProductsByCategory = (products) => PRODUCT_CATEGORIES
    .map((category) => ({
        ...category,
        products: products.filter((product) => product.category === category.value)
    }))
    .filter((group) => group.products.length > 0);
