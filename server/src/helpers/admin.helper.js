import { User } from "../models/user.model.js";
import { hashPassword } from "./bcrypt.helper.js";

const MIN_ADMIN_PASSWORD_LENGTH = 8;

// El único administrador es el creador de la plataforma: se define por variables de entorno, nunca desde una ruta pública
export const ensureAdminUser = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.error("ADMIN_EMAIL y ADMIN_PASSWORD no están configurados: la plataforma queda sin administrador");
            return;
        }
        if (ADMIN_PASSWORD.length < MIN_ADMIN_PASSWORD_LENGTH) {
            console.error(`ADMIN_PASSWORD debe tener al menos ${MIN_ADMIN_PASSWORD_LENGTH} caracteres: no se creó el administrador`);
            return;
        }
        const email = ADMIN_EMAIL.trim().toLowerCase();
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            // Nunca se promueve una cuenta existente: alguien podría haberse registrado antes con el correo del administrador
            if (existingUser.role !== "admin") {
                console.error(`El correo ${email} pertenece a una cuenta que no es de administrador; revisá ADMIN_EMAIL`);
            }
            return;
        }
        await User.create({
            name: ADMIN_NAME || "Administración",
            email,
            password_hash: await hashPassword(ADMIN_PASSWORD),
            role: "admin",
            is_email_verified: true
        });
        console.info(`Cuenta de administrador creada para ${email}`);
    } catch (error) {
        console.error("No se pudo crear la cuenta de administrador:", error);
    }
};
