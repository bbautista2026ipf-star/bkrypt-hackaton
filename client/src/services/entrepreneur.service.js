import { apiRequest } from "./apiClient.js";

export const getEntrepreneur = (entrepreneurId) => apiRequest(`/entrepreneurs/${entrepreneurId}`);

export const getOwnEntrepreneurProfile = () => apiRequest("/entrepreneurs/me");

export const updateOwnEntrepreneurProfile = (business) => apiRequest("/entrepreneurs/me", { method: "PUT", body: business });
