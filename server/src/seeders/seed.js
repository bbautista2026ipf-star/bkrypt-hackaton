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

// Datos inventados con contexto de Formosa Capital. Las coordenadas son aproximadas:
// revisarlas antes de usarlas en producción.
const EVENT_LOCATIONS = [
    {
        key: "ferroviario", name: "Paseo Ferroviario",
        description: "Feria de emprendedores en la antigua estación de trenes, sede de eventos como \"A Toda Costa\" (ubicación aproximada).",
        latitude: -26.1858, longitude: -58.1650
    },
    {
        key: "costanera", name: "Costanera Vuelta Fermoza",
        description: "Feria de fin de semana frente al río Paraguay, escenario de la Fiesta Nacional del Río (ubicación aproximada).",
        latitude: -26.1795, longitude: -58.1640
    },
    {
        key: "plaza", name: "Plaza San Martín",
        description: "Feria artesanal en la plaza central de la ciudad (ubicación aproximada).",
        latitude: -26.1852, longitude: -58.1745
    },
    {
        key: "paippa", name: "Feria PAIPPA de Pequeños Productores",
        description: "Productores de la agricultura familiar con frutas, verduras, miel y lácteos de la provincia (ubicación aproximada).",
        latitude: -26.1905, longitude: -58.1690
    },
    {
        key: "sanmiguel", name: "Feria Franca Barrio San Miguel",
        description: "Feria barrial de alimentos frescos y panificados caseros (ubicación aproximada).",
        latitude: -26.2010, longitude: -58.1935
    }
];

const CONSUMERS = [
    { key: "lucia", name: "Lucía Gómez", email: "lucia@example.com" },
    { key: "martin", name: "Martín Benítez", email: "martin@example.com" },
    { key: "sofia", name: "Sofía Ramírez", email: "sofia@example.com" },
    { key: "nicolas", name: "Nicolás Cabrera", email: "nicolas@example.com" },
    { key: "valentina", name: "Valentina Sosa", email: "valentina@example.com" }
];

const ENTREPRENEURS = [
    {
        key: "mieles", name: "Carlos Duarte", email: "mieles@example.com",
        profile: {
            brand_name: "Mieles del Monte Formoseño",
            biography: "Apicultores de segunda generación. Cosechamos miel de monte nativo en el interior de la provincia y la envasamos en Formosa Capital.",
            whatsapp_number: "+5493704000001",
            has_store: true, store_address: "Av. 25 de Mayo 850", store_latitude: -26.1890, store_longitude: -58.1780
        },
        fairs: ["ferroviario", "paippa"]
    },
    {
        key: "cesteria", name: "Rosa Molina", email: "cesteria@example.com",
        profile: {
            brand_name: "Cestería Qom del Namqom",
            biography: "Artesanas qom del barrio Namqom. Tejemos canastas, paneras y sombreros con hoja de palma carandillo, como nos enseñaron nuestras abuelas.",
            whatsapp_number: "+5493704000002",
            has_store: false
        },
        fairs: ["ferroviario", "costanera"]
    },
    {
        key: "chaguar", name: "Teresa Pérez", email: "chaguar@example.com",
        profile: {
            brand_name: "Yica y Chaguar",
            biography: "Tejidos wichí en fibra de chaguar: yicas, tapices y accesorios. Cada pieza lleva semanas de trabajo a mano.",
            whatsapp_number: "+5493704000003",
            has_store: false
        },
        fairs: ["plaza", "costanera"]
    },
    {
        key: "cosmetica", name: "Paula Ortiz", email: "cosmetica@example.com",
        profile: {
            brand_name: "Aloe & Monte Cosmética Natural",
            biography: "Jabones, geles y cremas con aloe vera, miel y cera de abeja de productores formoseños. Sin conservantes artificiales.",
            whatsapp_number: "+5493704000004",
            has_store: true, store_address: "Calle España 420", store_latitude: -26.1760, store_longitude: -58.1820
        },
        fairs: []
    },
    {
        key: "chipa", name: "Juan Acosta", email: "chipa@example.com",
        profile: {
            brand_name: "Chipá de Ña Rosa",
            biography: "Chipá, mbejú y sopa paraguaya con la receta de mi abuela. Horneamos todas las mañanas en horno de barro.",
            whatsapp_number: "+5493704000005",
            has_store: false
        },
        fairs: ["plaza", "sanmiguel"]
    },
    {
        key: "dulces", name: "Mirta Giménez", email: "dulces@example.com",
        profile: {
            brand_name: "Dulces del Mamón",
            biography: "Dulces caseros con frutas de la región: mamón, pomelo de Laguna Blanca y mburucuyá. Envasado artesanal.",
            whatsapp_number: "+5493704000006",
            has_store: true, store_address: "Av. Napoleón Uriburu 1450", store_latitude: -26.1950, store_longitude: -58.1700
        },
        fairs: ["paippa"]
    },
    {
        key: "textil", name: "Lucas Villalba", email: "textil@example.com",
        profile: {
            brand_name: "Ñandutí Textil",
            biography: "Indumentaria con encaje ñandutí y bordado ao po'i, diseñada y confeccionada en Formosa.",
            whatsapp_number: "+5493704000007",
            has_store: false
        },
        fairs: ["ferroviario", "costanera"]
    },
    {
        key: "huerta", name: "Ramón Ayala", email: "huerta@example.com",
        profile: {
            brand_name: "Huerta de Colonia Pastoril",
            biography: "Familia productora de Colonia Pastoril. Verduras de estación, mandioca, huevos de campo y quesos, sin agroquímicos.",
            whatsapp_number: "+5493704000008",
            has_store: false
        },
        fairs: ["paippa", "sanmiguel"]
    },
    {
        key: "madera", name: "Diego Fernández", email: "madera@example.com",
        profile: {
            brand_name: "Palo Santo Artesanal",
            biography: "Tablas, mates y utensilios en maderas nativas del Chaco formoseño: palo santo y algarrobo.",
            whatsapp_number: "+5493704000009",
            has_store: true, store_address: "Av. Gutnisky 2100", store_latitude: -26.1700, store_longitude: -58.1900
        },
        fairs: ["costanera"]
    }
];

const PRODUCTS = [
    { key: "miel1kg", owner: "mieles", name: "Miel de monte 1 kg", description: "Miel pura de monte nativo en frasco de vidrio de 1 kg.", price: 6500, category: "alimentos" },
    { key: "miel500", owner: "mieles", name: "Miel de monte 500 g", description: "Miel pura de monte nativo en frasco de vidrio de 500 g.", price: 3800, category: "alimentos" },
    { key: "panal", owner: "mieles", name: "Miel con panal 250 g", description: "Trozo de panal entero en su propia miel.", price: 4200, category: "alimentos" },
    { key: "propoleo", owner: "mieles", name: "Propóleo en gotas", description: "Tintura de propóleo de 30 ml.", price: 2900, category: "otros", is_available: false },

    { key: "canasta", owner: "cesteria", name: "Canasta de palma carandillo", description: "Canasta mediana tejida a mano con hoja de palma.", price: 9000, category: "artesanias" },
    { key: "panera", owner: "cesteria", name: "Panera tejida", description: "Panera redonda de palma, ideal para la mesa.", price: 5500, category: "artesanias" },
    { key: "individuales", owner: "cesteria", name: "Individuales de palma x4", description: "Juego de cuatro individuales tejidos.", price: 7000, category: "artesanias" },
    { key: "sombrero", owner: "cesteria", name: "Sombrero de palma", description: "Sombrero liviano tejido a mano, ideal para el verano formoseño.", price: 6000, category: "indumentaria" },

    { key: "yica", owner: "chaguar", name: "Yica de chaguar", description: "Bolso tradicional wichí tejido en fibra de chaguar teñida con tintes naturales.", price: 15000, category: "artesanias" },
    { key: "tapiz", owner: "chaguar", name: "Tapiz de chaguar", description: "Tapiz de 40 x 60 cm con diseños tradicionales.", price: 22000, category: "artesanias" },
    { key: "collar", owner: "chaguar", name: "Collar de semillas", description: "Collar con semillas del monte y fibra de chaguar.", price: 3500, category: "artesanias" },

    { key: "jabon", owner: "cosmetica", name: "Jabón de miel y avena", description: "Jabón artesanal de 100 g para piel sensible.", price: 1800, category: "cosmetica" },
    { key: "aloe", owner: "cosmetica", name: "Gel de aloe vera", description: "Gel de aloe vera puro de 150 ml, ideal después del sol.", price: 3200, category: "cosmetica" },
    { key: "crema", owner: "cosmetica", name: "Crema de karité y miel", description: "Crema hidratante corporal de 200 ml.", price: 5200, category: "cosmetica" },
    { key: "labial", owner: "cosmetica", name: "Protector labial de cera de abeja", description: "Bálsamo labial de 5 g.", price: 1500, category: "cosmetica" },

    { key: "chipa", owner: "chipa", name: "Chipá por docena", description: "Chipá recién horneado en horno de barro, docena.", price: 3000, category: "alimentos" },
    { key: "mbeju", owner: "chipa", name: "Mbejú", description: "Mbejú de almidón de mandioca y queso, porción grande.", price: 2500, category: "alimentos" },
    { key: "sopa", owner: "chipa", name: "Sopa paraguaya", description: "Porción de sopa paraguaya casera.", price: 2200, category: "alimentos" },
    { key: "chipaguazu", owner: "chipa", name: "Chipá guazú", description: "Chipá guazú de choclo, fuente para 4 personas.", price: 4500, category: "alimentos" },

    { key: "mamon", owner: "dulces", name: "Dulce de mamón en almíbar", description: "Frasco de 500 g, receta tradicional.", price: 3500, category: "alimentos" },
    { key: "pomelo", owner: "dulces", name: "Mermelada de pomelo", description: "Mermelada de pomelo de Laguna Blanca, 400 g.", price: 3000, category: "alimentos" },
    { key: "mburucuya", owner: "dulces", name: "Mermelada de mburucuyá", description: "Mermelada de maracuyá regional, 400 g.", price: 3200, category: "alimentos" },
    { key: "dulceleche", owner: "dulces", name: "Dulce de leche casero", description: "Frasco de 500 g.", price: 4000, category: "alimentos", is_available: false },

    { key: "blusa", owner: "textil", name: "Blusa con ñandutí", description: "Blusa de algodón con apliques de encaje ñandutí.", price: 18000, category: "indumentaria" },
    { key: "camisa", owner: "textil", name: "Camisa bordada ao po'i", description: "Camisa liviana con bordado ao po'i hecho a mano.", price: 25000, category: "indumentaria" },
    { key: "panuelo", owner: "textil", name: "Pañuelo pintado a mano", description: "Pañuelo de seda con motivos de flora regional.", price: 6000, category: "indumentaria" },

    { key: "bolson", owner: "huerta", name: "Bolsón de verduras de estación", description: "Bolsón de 5 kg con verduras frescas de la semana.", price: 5000, category: "alimentos" },
    { key: "mandioca", owner: "huerta", name: "Mandioca 2 kg", description: "Mandioca fresca pelada y lista para cocinar.", price: 2000, category: "alimentos" },
    { key: "huevos", owner: "huerta", name: "Huevos de campo (maple)", description: "Maple de 30 huevos de gallinas criadas a campo.", price: 4500, category: "alimentos" },
    { key: "queso", owner: "huerta", name: "Queso de campo 1 kg", description: "Queso fresco artesanal.", price: 9000, category: "alimentos", is_available: false },

    { key: "tabla", owner: "madera", name: "Tabla de asado de algarrobo", description: "Tabla de 40 x 25 cm, tratada con aceite natural.", price: 12000, category: "artesanias" },
    { key: "mate", owner: "madera", name: "Mate de palo santo", description: "Mate torneado a mano en palo santo, aromático.", price: 7500, category: "artesanias" },
    { key: "cucharas", owner: "madera", name: "Set de cucharas de madera x3", description: "Tres cucharas de algarrobo para cocina.", price: 4000, category: "otros" }
];

// [autor, producto, estrellas, comentario]. Nadie califica sus propios productos.
const REVIEWS = [
    ["lucia", "miel1kg", 5, "Riquísima, se nota que es pura de monte."],
    ["martin", "miel1kg", 4, "Muy buena, el frasco llegó impecable."],
    ["sofia", "miel1kg", 5, "La compro siempre en el Paseo Ferroviario."],
    ["cesteria", "miel1kg", 5, null],
    ["valentina", "panal", 5, "Un lujo para el desayuno."],
    ["lucia", "canasta", 5, "Hermosa terminación, se nota el trabajo a mano."],
    ["nicolas", "canasta", 4, "Muy linda, un poco más chica de lo que esperaba."],
    ["sofia", "panera", 5, "Quedó perfecta en la mesa."],
    ["martin", "sombrero", 4, "Fresco y liviano, ideal para la costanera."],
    ["valentina", "yica", 5, "Una obra de arte. Vale cada peso."],
    ["lucia", "yica", 5, "Me encantaron los colores naturales."],
    ["nicolas", "tapiz", 4, null],
    ["martin", "jabon", 3, "Buen jabón, el aroma es muy suave."],
    ["sofia", "aloe", 5, "Salvador después de un día de sol."],
    ["valentina", "crema", 4, "Hidrata muchísimo."],
    ["chipa", "labial", 5, null],
    ["lucia", "chipa", 4, "Muy rico, calentito."],
    ["mieles", "chipa", 5, "El mejor chipá de la feria de la plaza."],
    ["nicolas", "chipa", 5, "Crocante por fuera y blandito por dentro."],
    ["martin", "mbeju", 4, "Muy bueno, como el de casa."],
    ["sofia", "chipaguazu", 5, "Lo pedí para un cumpleaños y volaron."],
    ["lucia", "mamon", 5, "Igual al que hacía mi abuela."],
    ["nicolas", "pomelo", 3, "Rica pero un poco amarga para mi gusto."],
    ["huerta", "mburucuya", 4, null],
    ["valentina", "blusa", 5, "El ñandutí es precioso."],
    ["sofia", "camisa", 4, "Muy buena calidad, el talle viene grande."],
    ["martin", "bolson", 5, "Verduras fresquísimas y de buen tamaño."],
    ["lucia", "bolson", 4, "Buen precio para la cantidad."],
    ["dulces", "huevos", 5, "Yemas bien naranjas, de campo de verdad."],
    ["nicolas", "mandioca", 2, "La última vez vino algo dura."],
    ["valentina", "mate", 5, "El aroma del palo santo es increíble."],
    ["martin", "tabla", 4, "Sólida y bien terminada."]
];

// [emprendedor, feria, días desde hoy, hora de inicio, hora de fin]
// Cada emprendedor solo tiene horarios en ferias que figuran en su perfil
const SCHEDULES = [
    ["chipa", "plaza", 1, 8, 12],
    ["huerta", "sanmiguel", 1, 7, 11],
    ["mieles", "ferroviario", 2, 9, 13],
    ["cesteria", "ferroviario", 2, 9, 13],
    ["textil", "ferroviario", 2, 17, 21],
    ["chaguar", "plaza", 2, 9, 13],
    ["cesteria", "costanera", 3, 17, 21],
    ["madera", "costanera", 3, 17, 21],
    ["chaguar", "costanera", 3, 17, 21],
    ["mieles", "paippa", 4, 8, 12],
    ["dulces", "paippa", 4, 8, 12],
    ["huerta", "paippa", 4, 8, 12],
    ["chipa", "sanmiguel", 5, 8, 12],
    ["chipa", "plaza", 8, 8, 12],
    ["textil", "costanera", 10, 17, 21],
    ["madera", "costanera", 10, 17, 21],
    ["dulces", "paippa", 11, 8, 12],
    ["mieles", "ferroviario", 9, 9, 13]
];

// Horarios que están ocurriendo al momento de cargar los datos, para mostrar "activos ahora" en la demo
const ACTIVE_NOW_SCHEDULES = [
    ["chipa", "plaza"],
    ["textil", "ferroviario"]
];

const atDaysFromNow = (days, hour) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
};

const HOUR_IN_MS = 60 * 60 * 1000;

// Los datos de ejemplo tienen que respetar las mismas reglas que la API
const assertSeedDataIsConsistent = () => {
    const fairsByEntrepreneur = Object.fromEntries(ENTREPRENEURS.map(({ key, fairs }) => [key, fairs]));
    const ownerByProduct = Object.fromEntries(PRODUCTS.map(({ key, owner }) => [key, owner]));

    for (const [owner, fair] of [...SCHEDULES, ...ACTIVE_NOW_SCHEDULES]) {
        if (!fairsByEntrepreneur[owner]?.includes(fair)) {
            throw new Error(`Horario inválido: "${owner}" no tiene la feria "${fair}" en su perfil`);
        }
    }
    for (const [author, product] of REVIEWS) {
        if (ownerByProduct[product] === author) {
            throw new Error(`Calificación inválida: "${author}" no puede calificar su propio producto "${product}"`);
        }
    }
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

const seedSchedules = (profileIds, eventLocationIds) => {
    const upcoming = SCHEDULES.map(([owner, fair, days, startHour, endHour]) => ({
        entrepreneur_profile_id: profileIds[owner],
        event_location_id: eventLocationIds[fair],
        start_time: atDaysFromNow(days, startHour),
        end_time: atDaysFromNow(days, endHour)
    }));
    const now = Date.now();
    const activeNow = ACTIVE_NOW_SCHEDULES.map(([owner, fair]) => ({
        entrepreneur_profile_id: profileIds[owner],
        event_location_id: eventLocationIds[fair],
        start_time: new Date(now - HOUR_IN_MS),
        end_time: new Date(now + 3 * HOUR_IN_MS)
    }));
    return Schedule.bulkCreate([...activeNow, ...upcoming]);
};

const runSeed = async () => {
    if (process.env.NODE_ENV === "production") {
        throw new Error("El seed borra todos los datos: no se puede ejecutar con NODE_ENV=production");
    }
    if (!process.env.SEED_PASSWORD) {
        throw new Error("Definí SEED_PASSWORD en el archivo .env (contraseña de los usuarios de ejemplo)");
    }
    assertSeedDataIsConsistent();
    await resetDatabase();
    const password_hash = await hashPassword(process.env.SEED_PASSWORD);
    const eventLocationIds = await seedEventLocations();
    const { userIds, profileIds } = await seedUsers(password_hash, eventLocationIds);
    const productIds = await seedProducts(profileIds);
    await seedReviews(userIds, productIds);
    await seedSchedules(profileIds, eventLocationIds);
    console.log("Base de datos recreada con datos de ejemplo. Todos los usuarios usan la contraseña SEED_PASSWORD.");
    console.log("Admin: admin@example.com");
    console.log(`Consumidores: ${CONSUMERS.map((consumer) => consumer.email).join(", ")}`);
    console.log(`Emprendedores: ${ENTREPRENEURS.map((entrepreneur) => entrepreneur.email).join(", ")}`);
};

try {
    await runSeed();
} catch (error) {
    console.error("Error al cargar los datos de ejemplo:", error);
    process.exitCode = 1;
} finally {
    await sequelize.close();
}
