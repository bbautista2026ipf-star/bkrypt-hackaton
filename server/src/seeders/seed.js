// Recrea todas las tablas y carga datos de ejemplo para desarrollo y la demo.
// ATENCIÓN: borra todos los datos existentes. Uso: npm run db:reset
import "dotenv/config";
import { sequelize } from "../config/database.js";
import { setupRelations } from "../models/relations.js";
import { User } from "../models/user.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Schedule } from "../models/schedule.model.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

// Coordenadas aproximadas de Formosa Capital: revisarlas antes de usarlas en producción
const EVENT_LOCATIONS = [
    { key: "ferroviario", name: "Paseo Ferroviario", description: "Feria de emprendedores en el Paseo Ferroviario (ubicación aproximada)", latitude: -26.1858, longitude: -58.1650 },
    { key: "costanera", name: "Costanera Vuelta Fermoza", description: "Feria de fin de semana sobre la costanera (ubicación aproximada)", latitude: -26.1795, longitude: -58.1640 },
    { key: "plaza", name: "Plaza San Martín", description: "Feria artesanal en la plaza central (ubicación aproximada)", latitude: -26.1852, longitude: -58.1745 }
];

const CONSUMERS = [
    { key: "lucia", name: "Lucía Gómez", email: "lucia@example.com" },
    { key: "martin", name: "Martín Benítez", email: "martin@example.com" }
];

const ENTREPRENEURS = [
    {
        key: "mieles", name: "Carlos Duarte", email: "mieles@example.com",
        profile: { brand_name: "Mieles del Monte", biography: "Miel pura de monte formoseño, cosechada por productores de la zona.", whatsapp_number: "+5493704000001", has_store: true, store_address: "Av. 25 de Mayo 850", store_latitude: -26.1890, store_longitude: -58.1780 },
        fairs: ["ferroviario"]
    },
    {
        key: "tejidos", name: "Rosa Molina", email: "tejidos@example.com",
        profile: { brand_name: "Tejidos del Litoral", biography: "Tejidos y cestería artesanal hechos a mano.", whatsapp_number: "+5493704000002", has_store: false },
        fairs: ["ferroviario", "costanera"]
    },
    {
        key: "cosmetica", name: "Paula Ortiz", email: "cosmetica@example.com",
        profile: { brand_name: "Cosmética Natural Formosa", biography: "Jabones y cremas con ingredientes naturales de la región.", whatsapp_number: "+5493704000003", has_store: true, store_address: "Calle España 420", store_latitude: -26.1760, store_longitude: -58.1820 },
        fairs: []
    },
    {
        key: "chipa", name: "Juan Acosta", email: "chipa@example.com",
        profile: { brand_name: "Chipá de la Abuela", biography: "Chipá y panificados caseros, recetas familiares.", whatsapp_number: "+5493704000004", has_store: false },
        fairs: ["plaza"]
    }
];

const PRODUCTS = [
    { key: "miel1kg", owner: "mieles", name: "Miel de monte 1 kg", description: "Frasco de vidrio de 1 kg.", price: 6500, category: "alimentos" },
    { key: "miel500", owner: "mieles", name: "Miel de monte 500 g", description: "Frasco de vidrio de 500 g.", price: 3800, category: "alimentos" },
    { key: "propoleo", owner: "mieles", name: "Propóleo en gotas", description: "Tintura de propóleo de 30 ml.", price: 2900, category: "cosmetica", is_available: false },
    { key: "canasta", owner: "tejidos", name: "Canasta de palma", description: "Canasta tejida a mano con hoja de palma.", price: 9000, category: "artesanias" },
    { key: "poncho", owner: "tejidos", name: "Poncho tejido", description: "Poncho de lana tejido en telar.", price: 28000, category: "indumentaria" },
    { key: "jabon", owner: "cosmetica", name: "Jabón de avena y miel", description: "Jabón artesanal de 100 g.", price: 1800, category: "cosmetica" },
    { key: "crema", owner: "cosmetica", name: "Crema de karité", description: "Crema hidratante de 200 ml.", price: 5200, category: "cosmetica" },
    { key: "chipa", owner: "chipa", name: "Chipá por docena", description: "Chipá recién horneado, docena.", price: 3000, category: "alimentos" },
    { key: "pastelitos", owner: "chipa", name: "Pastelitos de batata", description: "Bandeja de 6 pastelitos.", price: 2500, category: "alimentos" }
];

// [autor, producto, estrellas, comentario]
const REVIEWS = [
    ["lucia", "miel1kg", 5, "Riquísima, se nota que es pura."],
    ["martin", "miel1kg", 4, "Muy buena, el frasco llegó impecable."],
    ["tejidos", "miel1kg", 5, null],
    ["lucia", "canasta", 5, "Hermosa terminación."],
    ["martin", "jabon", 3, "Buen jabón, el aroma es suave."],
    ["lucia", "chipa", 4, "Muy rico, calentito."],
    ["mieles", "chipa", 5, "El mejor chipá de la feria."]
];

// [emprendedor, feria, días desde hoy, hora de inicio, hora de fin]
const SCHEDULES = [
    ["mieles", "ferroviario", 2, 9, 13],
    ["tejidos", "ferroviario", 2, 9, 13],
    ["tejidos", "costanera", 3, 17, 21],
    ["chipa", "plaza", 1, 8, 12],
    ["chipa", "plaza", 8, 8, 12]
];

const atDaysFromNow = (days, hour) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
};

const resetDatabase = async () => {
    sequelize.options.logging = false;
    setupRelations();
    await sequelize.authenticate();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
};

const seedEventLocations = async () => {
    const eventLocationIds = {};
    for (const { key, ...data } of EVENT_LOCATIONS) {
        const eventLocation = await EventLocation.create(data);
        eventLocationIds[key] = eventLocation.id;
    }
    return eventLocationIds;
};

const createUser = (data, password_hash) =>
    User.create({ ...data, password_hash });

const seedUsers = async (password_hash, eventLocationIds) => {
    const userIds = {};
    const profileIds = {};

    await createUser({ name: "Administración", email: "admin@example.com", role: "admin" }, password_hash);
    for (const { key, name, email } of CONSUMERS) {
        const user = await createUser({ name, email, role: "consumer" }, password_hash);
        userIds[key] = user.id;
    }
    for (const { key, name, email, profile, fairs } of ENTREPRENEURS) {
        const user = await createUser({ name, email, role: "entrepreneur" }, password_hash);
        const newProfile = await EntrepreneurProfile.create({ ...profile, user_id: user.id });
        await newProfile.setFairs(fairs.map((fairKey) => eventLocationIds[fairKey]));
        userIds[key] = user.id;
        profileIds[key] = newProfile.id;
    }
    return { userIds, profileIds };
};

const seedProducts = async (profileIds) => {
    const productIds = {};
    for (const { key, owner, ...data } of PRODUCTS) {
        const product = await Product.create({ ...data, entrepreneur_profile_id: profileIds[owner] });
        productIds[key] = product.id;
    }
    return productIds;
};

const seedReviews = (userIds, productIds) =>
    Review.bulkCreate(REVIEWS.map(([author, product, stars, comment]) => ({
        user_id: userIds[author],
        product_id: productIds[product],
        stars,
        comment
    })));

const seedSchedules = (profileIds, eventLocationIds) =>
    Schedule.bulkCreate(SCHEDULES.map(([owner, fair, days, startHour, endHour]) => ({
        entrepreneur_profile_id: profileIds[owner],
        event_location_id: eventLocationIds[fair],
        start_time: atDaysFromNow(days, startHour),
        end_time: atDaysFromNow(days, endHour)
    })));

const runSeed = async () => {
    if (process.env.NODE_ENV === "production") {
        throw new Error("El seed borra todos los datos: no se puede ejecutar con NODE_ENV=production");
    }
    if (!process.env.SEED_PASSWORD) {
        throw new Error("Definí SEED_PASSWORD en el archivo .env (contraseña de los usuarios de ejemplo)");
    }
    await resetDatabase();
    const password_hash = await hashPassword(process.env.SEED_PASSWORD);
    const eventLocationIds = await seedEventLocations();
    const { userIds, profileIds } = await seedUsers(password_hash, eventLocationIds);
    const productIds = await seedProducts(profileIds);
    await seedReviews(userIds, productIds);
    await seedSchedules(profileIds, eventLocationIds);
    console.log("Base de datos recreada con datos de ejemplo.");
    console.log("Usuarios (contraseña = SEED_PASSWORD): admin@example.com, lucia@example.com, martin@example.com,");
    console.log(ENTREPRENEURS.map((entrepreneur) => entrepreneur.email).join(", "));
};

try {
    await runSeed();
} catch (error) {
    console.error("Error al cargar los datos de ejemplo:", error);
    process.exitCode = 1;
} finally {
    await sequelize.close();
}
