import { toDateKey } from "./formatters.js";

// Colores tomados de las variables de la paleta; la presencia propia también va escrita en el título (no depende solo del color)
const CALENDAR_STYLES = {
    fair: { backgroundColor: "var(--brand-teal)", borderColor: "var(--brand-teal)" },
    own: { backgroundColor: "var(--brand-yellow)", borderColor: "var(--brand-yellow)" }
};

export const includesEntrepreneur = (fairDay, entrepreneurProfileId) =>
    Boolean(entrepreneurProfileId) && fairDay.participants.some((participant) => participant.id === entrepreneurProfileId);

export const toCalendarEvent = (fairDay, ownProfileId) => {
    const isOwn = includesEntrepreneur(fairDay, ownProfileId);
    const style = isOwn ? CALENDAR_STYLES.own : CALENDAR_STYLES.fair;
    return {
        id: fairDay.id,
        title: isOwn ? `${fairDay.title} · Vas a estar` : fairDay.title,
        start: fairDay.starts_at,
        end: fairDay.ends_at,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        textColor: "var(--bs-body-color)"
    };
};

export const hasFairOnDay = (fairDays, day) => fairDays.some((fairDay) => toDateKey(fairDay.starts_at) === toDateKey(day));
