//importamos sequelize 
import { Sequelize } from "sequelize";

//guardamos en memoria una nueva instancia de sequelize pasandole por parametros la configuración de nuestra base de datos (nombre, host, etc)
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT 
})

//creamos función asíncrona que tendrá la responsabilidad de activar la conexión entre nuestra bd, sequelize y el servidor
//al igual que nuestra i
export const rundb = async () => {
    //estructura try/catch para manejar errores externos
    try {
        //este metodo junto a nuestra instancia de sequelize verifica las credenciales (host, name, pass etc) y comprobar si hay conexión
        await sequelize.authenticate()
        //metodo junto a la instancia sequelize que conecta modelos en nuestro código con las tablas de la bd créandolas
        //force: false indica que la opción de borrar las tablas y recrearlas cuando se reinicia el sv NO está activada
        //alter: true modifica columnas existentes
        //por defecto, el método sync() solo crea tablas si no existen
        await sequelize.sync( {force: false})
        console.log("Conexión a la BD exitosa")
    } catch(error) {
        console.error("Ocurrió un error al conectar a la base de datos: ", error)
    }
}