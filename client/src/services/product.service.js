import { apiRequest } from "./apiClient.js";

// filters: { category, search, available, lat, lng, radius }
export const searchProducts = (filters) => apiRequest("/products/search", { query: filters });

export const getProduct = (productId) => apiRequest(`/products/${productId}`);

export const createProduct = (product) => apiRequest("/products", { method: "POST", body: product });

export const updateProduct = (productId, product) => apiRequest(`/products/${productId}`, { method: "PUT", body: product });

export const deleteProduct = (productId) => apiRequest(`/products/${productId}`, { method: "DELETE" });
