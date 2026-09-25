//importamos librerías y herramientas para trabajar con el servidor
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { rundb } from './src/config/database.js'
import { setupRelations } from './src/models/relations.js'
import { authRouter } from './src/routes/auth.routes.js'
import { productRouter } from './src/routes/product.routes.js'
import { entrepreneurRouter } from './src/routes/entrepreneur.routes.js'
import { eventLocationRouter } from './src/routes/event_location.routes.js'
import { reviewRouter } from './src/routes/review.routes.js'
import { notFoundHandler, errorHandler } from './src/middlewares/errorHandler.middleware.js'
import { UPLOADS_ROOT } from './src/helpers/file.helper.js'

//guardamos instancia activa de express en memoria como constante "app"
const app = express()

//activamos middleware global para que nuestro sv pueda leer JSON
app.use(express.json())

//activamos middleware global CORS (cross origin resource sharing), va estrictamente antes de las rutas, le decimos a nuestra app express que la use pasandole por parametros el origen y credentials
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true //esto es necesario para habilitar el uso de las cookies desde el frontend
}))

//activamos middleware global çookieParser, permite decodificar cookies y leer tokens
app.use(cookieParser())

//invocamos a la función que trae toda la configuración de nuestras relaciones entre los modelos
setupRelations()

//acá activamos nuestras rutas pasandole a nuestra constante app por parametros la ruta general y el enrutador
app.use('/api', authRouter) //rutas de autenticación (registro, login, logout)
app.use('/api', productRouter) //rutas del catálogo de productos
app.use('/api', reviewRouter) //rutas de calificaciones de productos
app.use('/api', entrepreneurRouter) //rutas de perfiles de emprendedores y locales
app.use('/api', eventLocationRouter) //rutas de ferias

//servimos de forma estática las imágenes subidas (por ejemplo /uploads/products/archivo.jpg)
app.use('/uploads', express.static(UPLOADS_ROOT))

//manejadores finales: rutas inexistentes y errores no controlados, siempre después de todas las rutas
app.use(notFoundHandler)
app.use(errorHandler)

//dejamos al servidor en escucha pasandole por parametros el puerto (variable de entorno) y una función asíncrona que ejecuta la función que activa nuestra bd junto con un mensaje de éxito
app.listen(process.env.PORT, async () => {
    await rundb()
    console.log("El servidor está corriendo correctamente")
})