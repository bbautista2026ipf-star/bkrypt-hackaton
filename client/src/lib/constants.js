export const APP_NAME = "FormoBuy";

// Mismos valores que el ENUM "category" del modelo Product en el backend
export const PRODUCT_CATEGORIES = [
    { value: "alimentos", label: "Alimentos" },
    { value: "artesanias", label: "Artesanías" },
    { value: "indumentaria", label: "Indumentaria" },
    { value: "cosmetica", label: "Cosmética" },
    { value: "otros", label: "Otros" }
];

export const getCategoryLabel = (value) => PRODUCT_CATEGORIES.find((category) => category.value === value)?.label ?? value;

export const ROLES = {
    consumer: "consumer",
    entrepreneur: "entrepreneur",
    admin: "admin"
};

export const ROLE_LABELS = {
    consumer: "Consumidor",
    entrepreneur: "Emprendedor",
    admin: "Administrador"
};

export const REQUEST_STATUS_LABELS = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada"
};

export const SEARCH_RADIUS_OPTIONS = [2, 5, 10, 25];

export const DEFAULT_SEARCH_RADIUS = 10;

export const OPINION_COMMENT_MAX_LENGTH = 500;

// Centro de Formosa Capital: punto inicial del mapa cuando no hay eventos para encuadrar
export const FORMOSA_CENTER = { lat: -26.1849, lng: -58.1753 };

export const PATHS = {
    home: "/",
    catalog: "/catalogo",
    map: "/mapa",
    agenda: "/agenda",
    login: "/ingresar",
    register: "/registro",
    verifyEmail: "/verificar-email",
    profile: "/perfil",
    myCatalog: "/mi-catalogo",
    newProduct: "/mi-catalogo/nuevo",
    admin: "/admin",
    forbidden: "/sin-permisos",
    entrepreneur: (id) => `/emprendedores/${id}`,
    editProduct: (id) => `/mi-catalogo/${id}/editar`
};
