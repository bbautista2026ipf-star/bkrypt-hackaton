const priceFormatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" });

// El backend devuelve DECIMAL como texto: se convierte antes de formatear
export const formatPrice = (price) => priceFormatter.format(Number(price));

export const formatDate = (value) => dateFormatter.format(new Date(value));

export const formatDateTime = (value) => dateTimeFormatter.format(new Date(value));

export const formatEventSchedule = (startsAt, endsAt) => `${formatDateTime(startsAt)} a ${timeFormatter.format(new Date(endsAt))} h`;

export const formatDistance = (distanceInKm) => {
    if (distanceInKm === null || distanceInKm === undefined) {
        return null;
    }
    return distanceInKm < 1
        ? `a ${Math.round(distanceInKm * 1000)} m`
        : `a ${distanceInKm.toLocaleString("es-AR", { maximumFractionDigits: 1 })} km`;
};

export const formatRating = (rating) => rating.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;
