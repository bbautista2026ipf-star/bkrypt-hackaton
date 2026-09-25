import { apiRequest } from "./apiClient.js";

export const getOpinions = (entrepreneurId) => apiRequest(`/entrepreneurs/${entrepreneurId}/opinions`);

export const saveOpinion = (entrepreneurId, opinion) => apiRequest(`/entrepreneurs/${entrepreneurId}/opinions`, { method: "POST", body: opinion });

export const reportOpinion = (opinionId, reason) => apiRequest(`/opinions/${opinionId}/report`, { method: "POST", body: { reason } });
