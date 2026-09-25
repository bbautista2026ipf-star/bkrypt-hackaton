//importamos librerías y herramientas para trabajar con el servidor
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { rundb } from './src/config/database.js'
import { setupRelations } from './src/models/relations.js'
import { ensureAdminUser } from './src/helpers/admin.helper.js'
import { authRouter } from './src/routes/auth.routes.js'
import { productRouter } from './src/routes/product.routes.js'
import { entrepreneurRouter } from './src/routes/entrepreneur.routes.js'
import { eventLocationRouter } from './src/routes/event_location.routes.js'
import { eventRouter } from './src/routes/event.routes.js'
import { opinionRouter } from './src/routes/opinion.routes.js'
import { adminRouter } from './src/routes/admin.routes.js'

//guardamos instancia activa de express en memoria como constante "app"
const app = express()

//activamos middleware global para que nuestro sv pueda leer JSON
app.use(express.json())

//activamos middleware global CORS (cross origin resource sharing), va estrictamente antes de las rutas, le decimos a nuestra app express que la use pasandole por parametros el origen y credentials
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true //esto es necesario para habilitar el uso de las cookies desde el frontend
}))

//activamos middleware global çookieParser, permite decodificar cookies y leer tokens
app.use(cookieParser())

//invocamos a la función que trae toda la configuración de nuestras relaciones entre los modelos
setupRelations()

//acá activamos nuestras rutas pasandole a nuestra constante app por parametros la ruta general y el enrutador
app.use('/api', authRouter) //rutas de autenticación (registro, login, logout, verificación de correo, solicitud de emprendedor)
app.use('/api', productRouter) //rutas del catálogo de productos, buscador avanzado y calificaciones
app.use('/api', entrepreneurRouter) //rutas de perfiles de emprendedores, locales y opiniones
app.use('/api', eventLocationRouter) //rutas de ubicaciones de ferias
app.use('/api', eventRouter) //rutas de eventos (agenda) y solicitudes de presencia
app.use('/api', opinionRouter) //rutas de reportes de opiniones
app.use('/api/admin', adminRouter) //rutas del panel de administración (todas exigen rol admin)

//cualquier ruta que no exista responde en JSON, igual que el resto de la API
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" })
})

//manejador final de errores: un JSON mal formado es un error del cliente (400), el resto se registra y se responde genérico
app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" })
    }
    console.error("Error no controlado:", error)
    return res.status(500).json({ message: "Ocurrió un error interno en el servidor" })
})

//dejamos al servidor en escucha pasandole por parametros el puerto (variable de entorno) y una función asíncrona que ejecuta la función que activa nuestra bd y asegura que exista la cuenta del administrador
app.listen(process.env.PORT, async () => {
    await rundb()
    await ensureAdminUser()
    console.log("El servidor está corriendo correctamente")
})
