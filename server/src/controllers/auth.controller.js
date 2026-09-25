import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { User } from "../models/user.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

const SESSION_COOKIE = "sessionToken";

const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 // 1 hora, igual que la expiración del token
};

// Nunca se devuelve el hash de la contraseña al cliente
const toPublicUser = (user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    is_email_verified: user.is_email_verified
});

export const register = async (req, res) => {
    try {
        const { email, password, role, brand_name, biography, whatsapp_number, verification_document_url } =
            matchedData(req, { locations: ["body"] });
        const password_hash = await hashPassword(password);

        // Transacción: si falla la creación del perfil, no queda un usuario emprendedor huérfano
        const { newUser, newProfile } = await sequelize.transaction(async (transaction) => {
            const newUser = await User.create({ email, password_hash, role }, { transaction });
            let newProfile = null;
            if (role === "entrepreneur") {
                newProfile = await EntrepreneurProfile.create({
                    user_id: newUser.id,
                    brand_name,
                    biography,
                    whatsapp_number,
                    verification_document_url
                }, { transaction });
            }
            return { newUser, newProfile };
        });

        return res.status(201).json({
            message: "Usuario registrado con éxito",
            user: toPublicUser(newUser),
            entrepreneurProfile: newProfile
        });
    } catch (error) {
        console.error("Error en el registro de usuario:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = matchedData(req, { locations: ["body"] });
        const registeredUser = await User.findOne({ where: { email } });

        // Mismo mensaje para email inexistente y contraseña incorrecta, así no se revela qué emails existen
        if (!registeredUser) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }
        const isValidPassword = await comparePassword(password, registeredUser.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = generateToken({ user_id: registeredUser.id, user_role: registeredUser.role });
        res.cookie(SESSION_COOKIE, token, cookieOptions);

        return res.status(200).json({
            message: "Sesión iniciada correctamente",
            user: toPublicUser(registeredUser)
        });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const logout = (req, res) => {
    try {
        const { maxAge, ...clearOptions } = cookieOptions;
        res.clearCookie(SESSION_COOKIE, clearOptions);
        return res.status(200).json({ message: "Sesión cerrada con éxito" });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.userData.user_id, {
            include: { model: EntrepreneurProfile, as: "entrepreneurProfile" }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json({
            user: toPublicUser(user),
            entrepreneurProfile: user.entrepreneurProfile
        });
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
