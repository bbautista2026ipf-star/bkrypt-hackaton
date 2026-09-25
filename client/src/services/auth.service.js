import { apiRequest } from "./apiClient.js";

export const registerUser = (registration) => apiRequest("/auth/register", { method: "POST", body: registration });

export const loginUser = (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials });

export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });

export const getCurrentUser = () => apiRequest("/auth/me");

// El token llega en el enlace del correo y se valida en el backend por query string
export const verifyEmail = (token) => apiRequest("/auth/verify-email", { query: { token } });

// Público: el usuario sin verificar todavía no puede iniciar sesión, por eso se identifica con su email
export const resendVerificationEmail = (email) => apiRequest("/auth/resend-verification", { method: "POST", body: { email } });
