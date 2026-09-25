import { apiRequest } from "./apiClient.js";

// Crea la reseña del usuario o reemplaza la que ya tenía sobre ese producto
export const rateProduct = (productId, review) => apiRequest(`/products/${productId}/reviews`, { method: "POST", body: review });

export const deleteReview = (reviewId) => apiRequest(`/reviews/${reviewId}`, { method: "DELETE" });
