const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Fórmula de Haversine: distancia en km entre dos puntos { latitude, longitude } sobre la superficie terrestre
export const distanceInKm = (from, to) => {
    const latitudeDelta = toRadians(to.latitude - from.latitude);
    const longitudeDelta = toRadians(to.longitude - from.longitude);
    const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
};

// Distancia al punto más cercano de la lista, o null si no hay puntos conocidos
export const distanceToNearestPoint = (origin, points) => {
    if (points.length === 0) {
        return null;
    }
    return Math.min(...points.map((point) => distanceInKm(origin, point)));
};

export const roundDistance = (distance) => (distance === null ? null : Math.round(distance * 10) / 10);

// MySQL devuelve los DECIMAL como texto; se normalizan a número antes de calcular o responder
export const toCoordinates = (latitude, longitude) => {
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
        return null;
    }
    return { latitude: Number(latitude), longitude: Number(longitude) };
};
