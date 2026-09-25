// Carga datos de demostración para probar la plataforma y correr la colección de Thunder Client.
// Uso: node seed.js           -> crea los datos de demostración si todavía no existen
//      node seed.js --reset   -> borra y recrea todas las tablas antes de cargarlos (solo desarrollo)
import 'dotenv/config'
import { sequelize } from './src/config/database.js'
import { setupRelations } from './src/models/relations.js'
import { ensureAdminUser } from './src/helpers/admin.helper.js'
import { hashPassword } from './src/helpers/bcrypt.helper.js'
import { User } from './src/models/user.model.js'
import { EntrepreneurProfile } from './src/models/entrepreneur_profile.model.js'
import { EntrepreneurRequest } from './src/models/entrepreneur_request.model.js'
import { EventLocation } from './src/models/event_location.model.js'
import { Event } from './src/models/event.model.js'
import { PresenceRequest } from './src/models/presence_request.model.js'
import { Product } from './src/models/product.model.js'
import { Opinion } from './src/models/opinion.model.js'

const DEMO_PASSWORD = "Demo1234"
const ARGENTINA_UTC_OFFSET_HOURS = -3
const SATURDAY = 6
const SUNDAY = 0

// Próximo día de la semana indicado (0 = domingo) a la hora local de Argentina, al menos a 2 días de hoy
const nextWeekdayAt = (weekday, hour, weeksAhead = 0) => {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() + 2)
    while (date.getUTCDay() !== weekday) {
        date.setUTCDate(date.getUTCDate() + 1)
    }
    date.setUTCDate(date.getUTCDate() + weeksAhead * 7)
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour - ARGENTINA_UTC_OFFSET_HOURS))
}

const daysAgoAt = (days, hour) => {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() - days)
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour - ARGENTINA_UTC_OFFSET_HOURS))
}

const createDemoUser = async (name, email, role = "consumer") => User.create({
    name,
    email,
    password_hash: await hashPassword(DEMO_PASSWORD),
    role,
    is_email_verified: true
})

const seedDemoData = async (admin) => {
    const [costanera, plaza, paseoFerroviario] = await EventLocation.bulkCreate([
        { name: "Costanera Vuelta Fermoza", description: "Paseo costanero sobre el río Paraguay (ubicación aproximada, dato de demostración)", latitude: -26.1830, longitude: -58.1640 },
        { name: "Plaza San Martín", description: "Plaza central de Formosa Capital (ubicación aproximada, dato de demostración)", latitude: -26.1849, longitude: -58.1753 },
        { name: "Paseo Ferroviario", description: "Predio del paseo ferroviario (ubicación aproximada, dato de demostración)", latitude: -26.1767, longitude: -58.1690 }
    ])

    const consumer = await createDemoUser("Lucía Gómez", "consumidora.demo@formobuy.local")
    const sweetsOwner = await createDemoUser("Marta Benítez", "emprendedora.demo@formobuy.local", "entrepreneur")
    const leatherOwner = await createDemoUser("Ramón Acosta", "emprendedor.demo@formobuy.local", "entrepreneur")
    const applicant = await createDemoUser("Sofía Duarte", "solicitante.demo@formobuy.local")

    const sweets = await EntrepreneurProfile.create({
        user_id: sweetsOwner.id,
        brand_name: "Dulces de la Abuela Marta",
        biography: "Dulces caseros elaborados con frutas de la región, sin conservantes.",
        whatsapp_number: "+5493704123456",
        contact_email: "dulces.demo@formobuy.local",
        instagram_url: "https://www.instagram.com/formobuy.demo",
        has_store: false
    })
    await sweets.setFairs([costanera.id, plaza.id])

    const leather = await EntrepreneurProfile.create({
        user_id: leatherOwner.id,
        brand_name: "Cuero y Monte",
        biography: "Marroquinería y mates artesanales hechos a mano.",
        whatsapp_number: "+5493704654321",
        has_store: true,
        store_address: "Av. 25 de Mayo 1200, Formosa",
        store_latitude: -26.1790,
        store_longitude: -58.1735
    })

    await EntrepreneurRequest.create({
        user_id: applicant.id,
        brand_name: "Aromas del Litoral",
        biography: "Jabones y velas aromáticas con esencias naturales.",
        whatsapp_number: "+5493704111222",
        has_store: false,
        event_location_ids: [plaza.id]
    })

    await Product.bulkCreate([
        { entrepreneur_profile_id: sweets.id, name: "Dulce de leche casero 500 g", description: "Receta familiar, cocción lenta.", price: 3500, stock: 12, category: "alimentos" },
        { entrepreneur_profile_id: sweets.id, name: "Mermelada de mamón 400 g", description: "Mamón de la zona con azúcar orgánica.", price: 2800, stock: 0, category: "alimentos" },
        { entrepreneur_profile_id: sweets.id, name: "Alfajores de maicena x6", description: "Rellenos de dulce de leche casero.", price: 4200, stock: 8, category: "alimentos" },
        { entrepreneur_profile_id: leather.id, name: "Mate de calabaza forrado en cuero", description: "Calabaza curada y forrada a mano.", price: 9500, stock: 5, category: "artesanias" },
        { entrepreneur_profile_id: leather.id, name: "Cinturón de cuero trenzado", description: "Cuero vacuno curtido al vegetal.", price: 15000, stock: 3, category: "indumentaria" }
    ])

    const [pastFair, costaneraFair, plazaFair] = await Event.bulkCreate([
        { event_location_id: plaza.id, created_by: admin.id, title: "Feria de Otoño", description: "Edición anterior de la feria de la plaza.", starts_at: daysAgoAt(21, 9), ends_at: daysAgoAt(21, 13) },
        { event_location_id: costanera.id, created_by: admin.id, title: "Feria de la Costanera", description: "Feria de emprendedores locales frente al río.", starts_at: nextWeekdayAt(SATURDAY, 9), ends_at: nextWeekdayAt(SATURDAY, 13) },
        { event_location_id: plaza.id, created_by: admin.id, title: "Feria de la Plaza", description: "Feria de la tarde en la plaza central.", starts_at: nextWeekdayAt(SUNDAY, 17), ends_at: nextWeekdayAt(SUNDAY, 21) },
        { event_location_id: paseoFerroviario.id, created_by: admin.id, title: "A Toda Costa", description: "Evento de activación comercial en el Paseo Ferroviario.", starts_at: nextWeekdayAt(SATURDAY, 10, 2), ends_at: nextWeekdayAt(SATURDAY, 20, 2) }
    ])

    await PresenceRequest.bulkCreate([
        { event_id: pastFair.id, entrepreneur_profile_id: sweets.id, status: "approved", reviewed_at: daysAgoAt(28, 12) },
        { event_id: costaneraFair.id, entrepreneur_profile_id: sweets.id, status: "approved", reviewed_at: new Date() },
        { event_id: costaneraFair.id, entrepreneur_profile_id: leather.id, status: "approved", reviewed_at: new Date() },
        { event_id: plazaFair.id, entrepreneur_profile_id: sweets.id, status: "approved", reviewed_at: new Date() },
        { event_id: plazaFair.id, entrepreneur_profile_id: leather.id, status: "pending" }
    ])

    await Opinion.create({
        user_id: consumer.id,
        entrepreneur_profile_id: sweets.id,
        stars: 5,
        comment: "Muy buena atención y el dulce de leche es riquísimo."
    })
}

const run = async () => {
    const shouldReset = process.argv.includes("--reset")
    if (process.env.NODE_ENV === "production") {
        console.error("El seed de demostración no se ejecuta en producción")
        process.exitCode = 1
        return
    }
    try {
        setupRelations()
        await sequelize.authenticate()
        await sequelize.sync({ force: shouldReset })
        await ensureAdminUser()

        const admin = await User.findOne({ where: { role: "admin" } })
        if (!admin) {
            console.error("No hay administrador: configurá ADMIN_EMAIL y ADMIN_PASSWORD en el .env")
            process.exitCode = 1
            return
        }
        const alreadySeeded = await User.findOne({ where: { email: "consumidora.demo@formobuy.local" } })
        if (alreadySeeded) {
            console.info("Los datos de demostración ya existen. Usá --reset para recrearlos desde cero")
            return
        }
        await seedDemoData(admin)
        console.info(`Datos de demostración cargados. Contraseña de las cuentas demo: ${DEMO_PASSWORD}`)
    } catch (error) {
        console.error("No se pudieron cargar los datos de demostración:", error)
        process.exitCode = 1
    } finally {
        await sequelize.close()
    }
}

run()
