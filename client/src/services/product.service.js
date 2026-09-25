import { apiRequest } from "./apiClient.js";
import { MAX_PAGE_SIZE } from "../lib/constants.js";

// filters: { category, search, available, lat, lng, radius_km, page, limit } -> { products, pagination }
export const getProducts = (filters) => apiRequest("/products", { query: filters });

// Todas las páginas de un filtro: el mapa necesita saber qué emprendedores tienen productos que coinciden
export const getAllMatchingProducts = async (filters) => {
    const firstPage = await getProducts({ ...filters, page: 1, limit: MAX_PAGE_SIZE });
    const remainingPages = Array.from({ length: firstPage.pagination.total_pages - 1 }, (_, index) => index + 2);
    const otherPages = await Promise.all(remainingPages.map((page) => getProducts({ ...filters, page, limit: MAX_PAGE_SIZE })));
    return [firstPage, ...otherPages].flatMap((result) => result.products);
};

export const getProduct = (productId) => apiRequest(`/products/${productId}`);

// productData es un FormData (multipart) porque puede incluir la imagen
export const createProduct = (productData) => apiRequest("/products", { method: "POST", body: productData });

export const updateProduct = (productId, productData) => apiRequest(`/products/${productId}`, { method: "PUT", body: productData });

// Solo administrador: imageData es un FormData con el archivo en "image" o remove_image = "true"
export const updateProductImage = (productId, imageData) => apiRequest(`/products/${productId}/image`, { method: "PUT", body: imageData });

export const deleteProduct = (productId) => apiRequest(`/products/${productId}`, { method: "DELETE" });
