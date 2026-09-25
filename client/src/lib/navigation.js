import { PATHS, ROLES } from "./constants.js";

// Catálogo, mapa y agenda están siempre en la barra principal: a un clic desde cualquier pantalla (dos en móvil).
// Ocultar enlaces por rol es solo una ayuda visual: cada ruta protegida se valida igual en el backend.
export const getNavigationLinks = (role, filterQuery = "") => {
    const links = [
        { to: { pathname: PATHS.catalog, search: filterQuery }, label: "Catálogo" },
        { to: { pathname: PATHS.map, search: filterQuery }, label: "Mapa" },
        { to: { pathname: PATHS.agenda }, label: "Agenda de ferias" }
    ];
    if (role === ROLES.entrepreneur) {
        links.push({ to: { pathname: PATHS.myCatalog }, label: "Mi catálogo" });
    }
    if (role === ROLES.admin) {
        links.push({ to: { pathname: PATHS.admin }, label: "Administración" });
    }
    return links;
};

// Al pasar entre catálogo y mapa se conservan los filtros del buscador (viven en la URL)
export const getSharedFilterQuery = (pathname, search) => ([PATHS.catalog, PATHS.map].includes(pathname) ? search : "");
