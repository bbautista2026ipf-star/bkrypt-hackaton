const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
    constructor(status, message, fieldErrors = {}, code = null) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
        this.code = code;
    }
}

// El backend devuelve [{ field, message }]; el formulario necesita { campo: mensaje }
const toFieldErrors = (errors = []) => errors.reduce((fieldErrors, { field, message }) => {
    const fieldName = field ? field.replace(/\[\d+\]$/, "") : "form";
    return fieldErrors[fieldName] ? fieldErrors : { ...fieldErrors, [fieldName]: message };
}, {});

const buildUrl = (path, query) => {
    const params = new URLSearchParams(
        Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
    const queryString = params.toString();
    return `${API_URL}${path}${queryString ? `?${queryString}` : ""}`;
};

const buildRequestOptions = (method, body) => {
    const options = { method, credentials: "include" };
    if (body !== undefined) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }
    return options;
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
        throw new ApiError(
            response.status,
            data?.message ?? "Ocurrió un error inesperado. Intentá de nuevo en unos minutos.",
            toFieldErrors(data?.errors),
            data?.code ?? null
        );
    }
    return data;
};
