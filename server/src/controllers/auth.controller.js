import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { User } from "../models/user.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EntrepreneurRequest } from "../models/entrepreneur_request.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken, verifyToken, TOKEN_PURPOSES } from "../helpers/jwt.helper.js";
import { createPendingEntrepreneurRequest } from "../helpers/entrepreneur.helper.js";
import { sendVerificationEmail, notifyAdminOfEntrepreneurRequest } from "../helpers/mail.helper.js";

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
    name: user.name,
    email: user.email,
    role: user.role,
    is_email_verified: user.is_email_verified
});

const fairsInclude = {
    model: EventLocation,
    as: "fairs",
    attributes: ["id", "name", "latitude", "longitude"],
    through: { attributes: [] }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role, ...businessData } = matchedData(req, { locations: ["body"] });
        const password_hash = await hashPassword(password);

        // El rol entrepreneur nunca se otorga al registrarse: queda una solicitud pendiente y la cuenta opera como consumidor.
        // Transacción: si falla la solicitud, no queda un usuario creado a medias
        const { newUser, entrepreneurRequest } = await sequelize.transaction(async (transaction) => {
            const newUser = await User.create({ name, email, password_hash, role: "consumer" }, { transaction });
            const entrepreneurRequest = role === "entrepreneur"
                ? await createPendingEntrepreneurRequest(newUser.id, businessData, transaction)
                : null;
            return { newUser, entrepreneurRequest };
        });

        sendVerificationEmail(newUser);
        if (entrepreneurRequest) {
            notifyAdminOfEntrepreneurRequest(newUser, entrepreneurRequest);
        }

        return res.status(201).json({
            message: entrepreneurRequest
                ? "Cuenta creada. Tu solicitud de emprendedor quedó pendiente de revisión; mientras tanto usás la plataforma como consumidor"
                : "Cuenta creada con éxito",
            user: toPublicUser(newUser),
            entrepreneurRequest
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

        // El token solo identifica al usuario: el rol se consulta en la base en cada petición
        const token = generateToken({ user_id: registeredUser.id, purpose: TOKEN_PURPOSES.session });
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
            include: { model: EntrepreneurProfile, as: "entrepreneurProfile", include: fairsInclude }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const latestEntrepreneurRequest = await EntrepreneurRequest.findOne({
            where: { user_id: user.id },
            attributes: ["id", "brand_name", "status", "rejection_reason", "createdAt", "reviewed_at"],
            order: [["createdAt", "DESC"]]
        });
        return res.status(200).json({
            user: toPublicUser(user),
            entrepreneurProfile: user.entrepreneurProfile,
            entrepreneurRequest: latestEntrepreneurRequest
        });
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = matchedData(req, { locations: ["body"] });
        const payload = verifyToken(token, TOKEN_PURPOSES.emailVerification);
        const user = payload ? await User.findByPk(payload.user_id) : null;
        if (!user) {
            return res.status(400).json({ message: "El enlace de verificación es inválido o ya venció. Pedí uno nuevo desde tu perfil" });
        }
        if (user.is_email_verified) {
            return res.status(200).json({ message: "Tu correo ya estaba verificado" });
        }
        await user.update({ is_email_verified: true });
        return res.status(200).json({ message: "Correo verificado con éxito" });
    } catch (error) {
        console.error("Error al verificar el correo:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const user = await User.findByPk(req.userData.user_id);
        if (user.is_email_verified) {
            return res.status(409).json({ message: "Tu correo ya está verificado" });
        }
        sendVerificationEmail(user);
        return res.status(200).json({ message: "Te enviamos un nuevo enlace de verificación" });
    } catch (error) {
        console.error("Error al reenviar la verificación de correo:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
