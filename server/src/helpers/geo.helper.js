const EARTH_RADIUS_KM = 6371;

// Valor alto que se usa cuando el emprendedor no tiene local o no tiene ferias: queda fuera de cualquier radio
const NO_LOCATION_DISTANCE_KM = 1000000;

// Las coordenadas se insertan en el SQL: solo se aceptan números finitos (ya validados por express-validator)
const toSafeCoordinate = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        throw new Error("Coordenada inválida para calcular la distancia");
    }
    return number;
};

// Fórmula de Haversine: distancia en km entre el punto del usuario y las columnas de latitud/longitud indicadas.
// LEAST/GREATEST evitan que errores de redondeo dejen el valor fuera del dominio de ACOS.
const haversineSql = (lat, lng, latColumn, lngColumn) =>
    `(${EARTH_RADIUS_KM} * ACOS(LEAST(1, GREATEST(-1,
        COS(RADIANS(${lat})) * COS(RADIANS(${latColumn})) * COS(RADIANS(${lngColumn}) - RADIANS(${lng}))
        + SIN(RADIANS(${lat})) * SIN(RADIANS(${latColumn}))
    ))))`;

// Distancia de un producto = la menor entre el local de su emprendedor y cada una de sus ferias
export const productDistanceSql = (userLat, userLng, tableAlias = "Product") => {
    const lat = toSafeCoordinate(userLat);
    const lng = toSafeCoordinate(userLng);
    const entrepreneurIdColumn = `\`${tableAlias}\`.\`entrepreneur_profile_id\``;
    return `ROUND(LEAST(
        COALESCE((
            SELECT ${haversineSql(lat, lng, "ep.store_latitude", "ep.store_longitude")}
            FROM entrepreneur_profiles AS ep
            WHERE ep.id = ${entrepreneurIdColumn} AND ep.has_store = true
        ), ${NO_LOCATION_DISTANCE_KM}),
        COALESCE((
            SELECT MIN(${haversineSql(lat, lng, "el.latitude", "el.longitude")})
            FROM entrepreneur_event_locations AS eel
            JOIN event_locations AS el ON el.id = eel.event_location_id
            WHERE eel.entrepreneur_profile_id = ${entrepreneurIdColumn}
        ), ${NO_LOCATION_DISTANCE_KM})
    ), 2)`;
};
