//importamos librerías y herramientas para trabajar con el servidor
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { rundb } from './src/config/database.js'

//guardamos instancia activa de express en memoria como constante "app"
const app = express()

//activamos middleware global para que nuestro sv pueda leer JSON
app.use(express.json())

//activamos middleware global CORS (cross origin resource sharing), va estrictamente antes de las rutas, le decimos a nuestra app express que la use pasandole por parametros el origen y credentials
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //esto es necesario para habilitar el uso de las cookies desde el frontend
}))

//activamos middleware global çookieParser, permite decodificar cookies y leer tokens
app.use(cookieParser())

//invocamos a la función que trae toda la configuración de nuestras relaciones entre los modelos
setupRelations()

//acá activamos nuestras rutas pasandole a nuestra constante app por parametros la ruta general y el enrutador 

//dejamos al servidor en escucha pasandole por parametros el puerto (variable de entorno) y una función asíncrona que ejecuta la función que activa nuestra bd junto con un mensaje de éxito
app.listen(process.env.PORT, async () => {
    await rundb()
    console.log("El servidor está corriendo correctamente")
})