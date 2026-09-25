import { ROLES } from "./constants.js";

// Colores tomados de las variables de la paleta; el estado también va escrito en el título (no depende solo del color)
const CALENDAR_STYLES = {
    confirmed: { backgroundColor: "var(--brand-teal)", borderColor: "var(--brand-teal)", label: "Confirmado" },
    approved: { backgroundColor: "var(--brand-teal)", borderColor: "var(--brand-teal)", label: "Confirmado" },
    pending: { backgroundColor: "var(--brand-yellow)", borderColor: "var(--brand-yellow)", label: "Pendiente" },
    rejected: { backgroundColor: "var(--bs-secondary-bg)", borderColor: "var(--bs-secondary-color)", label: "Rechazado" },
    available: { backgroundColor: "var(--brand-white)", borderColor: "var(--brand-fuchsia)", label: "Podés solicitar" },
    unconfirmed: { backgroundColor: "var(--brand-white)", borderColor: "var(--brand-fuchsia)", label: "Sin confirmados" }
};

export const isEventFinished = (event) => new Date(event.ends_at) < new Date();

// Estado que ve cada rol: el emprendedor, el de su propia solicitud; el administrador, si ya hay confirmados
const resolveStatus = (event, role) => {
    if (role === ROLES.entrepreneur) {
        return event.my_request?.status ?? "available";
    }
    if (role === ROLES.admin) {
        return event.participants_count > 0 ? "confirmed" : "unconfirmed";
    }
    return "confirmed";
};

export const toCalendarEvent = (event, role) => {
    const status = resolveStatus(event, role);
    const style = CALENDAR_STYLES[status];
    const showStatus = role === ROLES.entrepreneur || role === ROLES.admin;
    return {
        id: event.id,
        title: showStatus ? `${event.title} · ${style.label}` : event.title,
        start: event.starts_at,
        end: event.ends_at,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        textColor: "var(--bs-body-color)"
    };
};

export const hasEventOnDay = (events, day) => events.some((event) => {
    const start = new Date(event.starts_at);
    return start.getFullYear() === day.getFullYear() && start.getMonth() === day.getMonth() && start.getDate() === day.getDate();
});
