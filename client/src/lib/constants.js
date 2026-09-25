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

// Radio de cercanía en km; el backend usa 10 si no se indica
export const SEARCH_RADIUS_OPTIONS = [2, 5, 10, 25];

export const DEFAULT_SEARCH_RADIUS = 10;

export const CATALOG_PAGE_SIZE = 20;

// Máximo que acepta el backend por página
export const MAX_PAGE_SIZE = 50;

export const REVIEW_COMMENT_MAX_LENGTH = 1000;

// Imagen del producto: mismos límites que el middleware de subida del backend
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

// Centro de Formosa Capital: punto inicial del mapa cuando no hay ferias para encuadrar
export const FORMOSA_CENTER = { lat: -26.1849, lng: -58.1753 };

export const PATHS = {
    home: "/",
    catalog: "/catalogo",
    map: "/mapa",
    agenda: "/agenda",
    login: "/ingresar",
    register: "/registro",
    profile: "/perfil",
    myCatalog: "/mi-catalogo",
    newProduct: "/mi-catalogo/nuevo",
    admin: "/admin",
    forbidden: "/sin-permisos",
    product: (id) => `/productos/${id}`,
    entrepreneur: (id) => `/emprendedores/${id}`,
    editProduct: (id) => `/mi-catalogo/${id}/editar`
};
