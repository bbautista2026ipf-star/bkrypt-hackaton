import { API_URL } from "../lib/apiConfig.js";

const VALIDATION_MESSAGE = "Revisá los datos marcados en el formulario.";

export class ApiError extends Error {
    constructor(status, message, fieldErrors = {}) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

// El backend devuelve los errores de validación como texto "campo: mensaje"; el formulario necesita { campo: mensaje }.
// Los campos de listas ("event_location_ids[0]") se asignan al campo de la lista.
const toFieldErrors = (errors = []) => errors.reduce((fieldErrors, entry) => {
    const separatorIndex = entry.indexOf(": ");
    if (separatorIndex === -1) {
        return fieldErrors;
    }
    const fieldName = entry.slice(0, separatorIndex).replace(/\[\d+\]$/, "");
    return fieldErrors[fieldName] ? fieldErrors : { ...fieldErrors, [fieldName]: entry.slice(separatorIndex + 2) };
}, {});

const buildUrl = (path, query) => {
    const params = new URLSearchParams(
        Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
    const queryString = params.toString();
    return `${API_URL}${path}${queryString ? `?${queryString}` : ""}`;
};

// FormData (productos con imagen) se envía tal cual: el navegador arma el multipart y su Content-Type
const buildRequestOptions = (method, body) => {
    const options = { method, credentials: "include" };
    if (body instanceof FormData) {
        options.body = body;
    } else if (body !== undefined) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }
    return options;
};

const buildErrorMessage = (data) => {
    if (data?.message) {
        return data.message;
    }
    return Array.isArray(data?.errors) ? VALIDATION_MESSAGE : "Ocurrió un error inesperado. Intentá de nuevo en unos minutos.";
};

// Único punto de salida hacia la API: la sesión viaja en la cookie httpOnly (credentials: "include")
export const apiRequest = async (path, { method = "GET", body, query } = {}) => {
    let response;
    try {
        response = await fetch(buildUrl(path, query), buildRequestOptions(method, body));
    } catch {
        throw new ApiError(0, "No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.");
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(response.status, buildErrorMessage(data), toFieldErrors(data?.errors));
    }
    return data;
};
