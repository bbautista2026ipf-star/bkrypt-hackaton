import { apiRequest } from "./apiClient.js";

// Perfil público con productos, ferias habituales y horarios próximos
export const getEntrepreneur = (entrepreneurId) => apiRequest(`/entrepreneurs/${entrepreneurId}`);

export const updateOwnEntrepreneurProfile = (changes) => apiRequest("/entrepreneurs/me", { method: "PUT", body: changes });
