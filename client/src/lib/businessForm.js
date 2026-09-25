import { collectErrors, validateLength, validateNumberInRange, validateWhatsApp } from "./validators.js";

// Formulario extendido del emprendimiento: lo usan el registro y la edición del perfil del emprendedor
export const EMPTY_BUSINESS = {
    brand_name: "",
    biography: "",
    whatsapp_number: "",
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
    has_store: Boolean(profile.has_store),
    store_address: profile.store_address ?? "",
    store_latitude: profile.store_latitude ?? "",
    store_longitude: profile.store_longitude ?? "",
    event_location_ids: (profile.fairs ?? []).map((fair) => fair.id)
});

export const validateBusiness = (values) => collectErrors({
    brand_name: validateLength(values.brand_name, { label: "El nombre del emprendimiento", min: 2, max: 100 }),
    biography: validateLength(values.biography, { label: "La descripción", max: 1000, required: false }),
    whatsapp_number: validateWhatsApp(values.whatsapp_number),
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

// El backend rechaza un WhatsApp vacío: al registrarse se omite y al editar se envía null (deja el guardado sin cambios)
export const toBusinessPayload = (values, { isUpdate = false } = {}) => {
    const whatsapp = values.whatsapp_number.trim();
    return {
        brand_name: values.brand_name.trim(),
        biography: values.biography.trim(),
        whatsapp_number: whatsapp || (isUpdate ? null : undefined),
        has_store: values.has_store,
        ...(values.has_store
            ? { store_address: values.store_address.trim(), store_latitude: Number(values.store_latitude), store_longitude: Number(values.store_longitude) }
            : {}),
        event_location_ids: values.event_location_ids
    };
};
