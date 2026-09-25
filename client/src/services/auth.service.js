import { apiRequest } from "./apiClient.js";

export const registerUser = (registration) => apiRequest("/auth/register", { method: "POST", body: registration });

export const loginUser = (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials });

export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });

export const getCurrentUser = () => apiRequest("/auth/me");

export const verifyEmail = (token) => apiRequest("/auth/verify-email", { method: "POST", body: { token } });

export const resendVerificationEmail = () => apiRequest("/auth/resend-verification", { method: "POST" });

export const submitEntrepreneurRequest = (business) => apiRequest("/auth/entrepreneur-request", { method: "POST", body: business });
