// Reglas equivalentes a las de Express-validator del backend: el formulario marca el error antes de enviar y el backend vuelve a validar

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_PATTERN = /^\+?\d{8,15}$/;
const PERSON_NAME_PATTERN = /^[\p{L}\s'.-]+$/u;

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

export const validateEmail = (value) => {
    if (isBlank(value)) {
        return "El email es obligatorio";
    }
    return EMAIL_PATTERN.test(String(value).trim()) ? null : "El email debe tener un formato válido, por ejemplo nombre@correo.com";
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

export const validatePersonName = (value) => {
    const lengthError = validateLength(value, { label: "El nombre", min: 2, max: 100 });
    if (lengthError) {
        return lengthError;
    }
    return PERSON_NAME_PATTERN.test(String(value).trim()) ? null : "El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones";
};

export const validateWhatsApp = (value) => {
    if (isBlank(value)) {
        return null;
    }
    return WHATSAPP_PATTERN.test(String(value).trim()) ? null : "El número de WhatsApp debe contener entre 8 y 15 dígitos, con + opcional al inicio";
};

export const validateNumberInRange = (value, { label, min, max, exclusiveMin = false }) => {
    if (isBlank(value)) {
        return `${label} es obligatorio`;
    }
    const number = Number(value);
    if (Number.isNaN(number)) {
        return `${label} debe ser un número`;
    }
    if (exclusiveMin ? number <= min : number < min) {
        return exclusiveMin ? `${label} debe ser mayor a ${min}` : `${label} debe ser mayor o igual a ${min}`;
    }
    return max !== undefined && number > max ? `${label} no puede superar ${max}` : null;
};

// Devuelve solo los campos con error: un objeto vacío significa formulario válido
export const collectErrors = (checks) => Object.fromEntries(Object.entries(checks).filter(([, message]) => message));
