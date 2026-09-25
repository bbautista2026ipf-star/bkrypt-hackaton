import { collectErrors, validateEmail, validateLength, validateNumberInRange, validateOptionalUrl, validateWhatsApp } from "./validators.js";

// Formulario extendido del emprendimiento: lo usan el registro, la solicitud desde el perfil y la edición del perfil
export const EMPTY_BUSINESS = {
    brand_name: "",
    biography: "",
    whatsapp_number: "",
    contact_email: "",
    instagram_url: "",
    facebook_url: "",
    has_store: false,
    store_address: "",
    store_latitude: "",
    store_longitude: "",
    event_location_ids: []
};

export const businessFromProfile = (profile) => ({
    brand_name: profile.brand_name ?? "",
    biography: profile.biography ?? "",
    whatsapp_number: profile.whatsapp_number ?? "",
    contact_email: profile.contact_email ?? "",
    instagram_url: profile.instagram_url ?? "",
    facebook_url: profile.facebook_url ?? "",
    has_store: Boolean(profile.has_store),
    store_address: profile.store_address ?? "",
    store_latitude: profile.store_latitude ?? "",
    store_longitude: profile.store_longitude ?? "",
    event_location_ids: (profile.fairs ?? []).map((fair) => fair.id)
});

export const validateBusiness = (values) => collectErrors({
    brand_name: validateLength(values.brand_name, { label: "El nombre del emprendimiento", min: 2, max: 100 }),
    biography: validateLength(values.biography, { label: "La descripción", max: 1000, required: false }),
    whatsapp_number: !values.whatsapp_number && !values.contact_email
        ? "Indicá al menos un medio de contacto: WhatsApp o correo electrónico"
        : validateWhatsApp(values.whatsapp_number),
    contact_email: values.contact_email ? validateEmail(values.contact_email, "El correo de contacto") : null,
    instagram_url: validateOptionalUrl(values.instagram_url, "El enlace de Instagram"),
    facebook_url: validateOptionalUrl(values.facebook_url, "El enlace de Facebook"),
    store_address: values.has_store ? validateLength(values.store_address, { label: "La dirección del local", min: 3, max: 255 }) : null,
    store_latitude: values.has_store ? validateNumberInRange(values.store_latitude, { label: "La latitud", min: -90, max: 90 }) : null,
    store_longitude: values.has_store ? validateNumberInRange(values.store_longitude, { label: "La longitud", min: -180, max: 180 }) : null,
    event_location_ids: !values.has_store && values.event_location_ids.length === 0
        ? "Si no tenés local, elegí al menos una feria a la que asistís"
        : null
});

export const toggleFairSelection = (selectedIds, fairId) => (
    selectedIds.includes(fairId) ? selectedIds.filter((id) => id !== fairId) : [...selectedIds, fairId]
);

export const toBusinessPayload = (values) => ({
    brand_name: values.brand_name.trim(),
    biography: values.biography.trim(),
    whatsapp_number: values.whatsapp_number.trim(),
    contact_email: values.contact_email.trim(),
    instagram_url: values.instagram_url.trim(),
    facebook_url: values.facebook_url.trim(),
    has_store: values.has_store,
    ...(values.has_store
        ? { store_address: values.store_address.trim(), store_latitude: Number(values.store_latitude), store_longitude: Number(values.store_longitude) }
        : {}),
    event_location_ids: values.event_location_ids
});
