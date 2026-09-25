// Reglas equivalentes a las de Express-validator: el formulario marca el error antes de enviar y el backend vuelve a validar

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_PATTERN = /^\+?\d{8,15}$/;
const URL_PATTERN = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

export const validateEmail = (value, label = "El email") => {
    if (isBlank(value)) {
        return `${label} es obligatorio`;
    }
    return EMAIL_PATTERN.test(String(value).trim()) ? null : `${label} debe tener un formato válido, por ejemplo nombre@correo.com`;
};

export const validatePassword = (value) => {
    const password = String(value ?? "");
    const isStrong = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
    return isStrong ? null : "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número";
};

export const validateLength = (value, { label, min = 0, max, required = true }) => {
    const text = String(value ?? "").trim();
    if (!required && text === "") {
        return null;
    }
    if (text.length < Math.max(min, required ? 1 : 0)) {
        return min > 1 ? `${label} debe tener al menos ${min} caracteres` : `${label} es obligatorio`;
    }
    return max && text.length > max ? `${label} no puede superar los ${max} caracteres` : null;
};

export const validateWhatsApp = (value) => {
    if (isBlank(value)) {
        return null;
    }
    return WHATSAPP_PATTERN.test(String(value).trim()) ? null : "El número de WhatsApp debe contener entre 8 y 15 dígitos, con + opcional al inicio";
};

export const validateOptionalUrl = (value, label) => {
    if (isBlank(value)) {
        return null;
    }
    return URL_PATTERN.test(String(value).trim()) ? null : `${label} debe ser una URL válida que empiece con http:// o https://`;
};

export const validateNumberInRange = (value, { label, min, max, integer = false, exclusiveMin = false }) => {
    if (isBlank(value)) {
        return `${label} es obligatorio`;
    }
    const number = Number(value);
    if (Number.isNaN(number) || (integer && !Number.isInteger(number))) {
        return integer ? `${label} debe ser un número entero` : `${label} debe ser un número`;
    }
    if (exclusiveMin ? number <= min : number < min) {
        return exclusiveMin ? `${label} debe ser mayor a ${min}` : `${label} debe ser mayor o igual a ${min}`;
    }
    return max !== undefined && number > max ? `${label} no puede superar ${max}` : null;
};

// Devuelve solo los campos con error: un objeto vacío significa formulario válido
export const collectErrors = (checks) => Object.fromEntries(Object.entries(checks).filter(([, message]) => message));
