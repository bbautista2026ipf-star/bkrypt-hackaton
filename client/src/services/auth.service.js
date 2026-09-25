import { apiRequest } from "./apiClient.js";

export const registerUser = (registration) => apiRequest("/auth/register", { method: "POST", body: registration });

export const loginUser = (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials });

export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });

export const getCurrentUser = () => apiRequest("/auth/me");
