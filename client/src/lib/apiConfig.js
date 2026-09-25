// URL base de la API (client/.env). Las imágenes subidas se sirven en /uploads del mismo servidor, fuera de /api.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const API_ORIGIN = new URL(API_URL, window.location.origin).origin;

// El backend guarda la ruta pública de la imagen ("/uploads/products/archivo.jpg"): se completa con el origen del servidor
export const toAssetUrl = (path) => {
    if (!path) {
        return null;
    }
    return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
};
