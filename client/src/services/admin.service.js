import { apiRequest } from "./apiClient.js";

export const getEntrepreneurRequests = (status) => apiRequest("/admin/entrepreneur-requests", { query: { status } });

// decision: { status: "approved" | "rejected", rejection_reason }
export const reviewEntrepreneurRequest = (requestId, decision) => apiRequest(`/admin/entrepreneur-requests/${requestId}`, { method: "PATCH", body: decision });

export const getPresenceRequests = (status) => apiRequest("/admin/presence-requests", { query: { status } });

export const reviewPresenceRequest = (requestId, status) => apiRequest(`/admin/presence-requests/${requestId}`, { method: "PATCH", body: { status } });

export const getReportedOpinions = () => apiRequest("/admin/opinions/reported");

export const dismissOpinionReport = (opinionId) => apiRequest(`/admin/opinions/${opinionId}/dismiss-report`, { method: "PATCH" });

export const deleteOpinion = (opinionId) => apiRequest(`/admin/opinions/${opinionId}`, { method: "DELETE" });
