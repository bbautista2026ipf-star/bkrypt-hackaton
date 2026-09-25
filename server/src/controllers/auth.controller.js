import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { User } from "../models/user.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { EventLocation } from "../models/event_location.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken, generateEmailVerificationToken, verifyToken, TOKEN_PURPOSES } from "../helpers/jwt.helper.js";
import { buildEmailVerificationLink, sendVerificationEmail } from "../helpers/mailer.helper.js";

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

const createEntrepreneurProfile = async (userId, profileData, transaction) => {
    const { brand_name, biography, whatsapp_number, has_store, store_address, store_latitude, store_longitude, event_location_ids } = profileData;
    const newProfile = await EntrepreneurProfile.create({
        user_id: userId,
        brand_name,
        biography,
        whatsapp_number,
        has_store,
        store_address: has_store ? store_address : null,
        store_latitude: has_store ? store_latitude : null,
        store_longitude: has_store ? store_longitude : null
    }, { transaction });

    if (Array.isArray(event_location_ids) && event_location_ids.length > 0) {
        await newProfile.setFairs([...new Set(event_location_ids)], { transaction });
    }
    return newProfile;
};

// Si el correo falla, el registro no se revierte: el usuario puede pedir que se le reenvíe
const trySendVerificationEmail = async (user) => {
    try {
        const verificationLink = buildEmailVerificationLink(generateEmailVerificationToken(user.id));
        await sendVerificationEmail({ email: user.email, name: user.name, verificationLink });
        return true;
    } catch (error) {
        console.error("Error al enviar el correo de verificación:", error);
        return false;
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role, ...profileData } = matchedData(req, { locations: ["body"] });
        const password_hash = await hashPassword(password);

        // Transacción: si falla la creación del perfil o de sus ferias, no queda un usuario emprendedor a medias
        const { newUser, newProfileId } = await sequelize.transaction(async (transaction) => {
            const newUser = await User.create({ name, email, password_hash, role }, { transaction });
            let newProfileId = null;
            if (role === "entrepreneur") {
                const newProfile = await createEntrepreneurProfile(newUser.id, profileData, transaction);
                newProfileId = newProfile.id;
            }
            return { newUser, newProfileId };
        });

        const entrepreneurProfile = newProfileId
            ? await EntrepreneurProfile.findByPk(newProfileId, { include: fairsInclude })
            : null;
        const emailSent = await trySendVerificationEmail(newUser);

        return res.status(201).json({
            message: emailSent
                ? "Usuario registrado con éxito. Te enviamos un email para verificar tu cuenta"
                : "Usuario registrado con éxito, pero no pudimos enviar el email de verificación. Pedí que te lo reenviemos",
            user: toPublicUser(newUser),
            entrepreneurProfile
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
        // Se revisa después de la contraseña para no revelar el estado de cuentas ajenas
        if (!registeredUser.is_email_verified) {
            return res.status(403).json({ message: "Tenés que verificar tu email antes de iniciar sesión" });
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

export const verifyEmail = async (req, res) => {
    try {
        const { token } = matchedData(req, { locations: ["query"] });
        let decoded;
        try {
            decoded = verifyToken(token, TOKEN_PURPOSES.emailVerification);
        } catch (error) {
            return res.status(400).json({ message: "El link de verificación es inválido o expiró" });
        }
        const user = await User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (!user.is_email_verified) {
            await user.update({ is_email_verified: true });
        }
        return res.status(200).json({ message: "Email verificado con éxito. Ya podés iniciar sesión" });
    } catch (error) {
        console.error("Error al verificar el email:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Siempre responde lo mismo, exista o no el email, para no revelar qué cuentas están registradas
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = matchedData(req, { locations: ["body"] });
        const user = await User.findOne({ where: { email } });
        if (user && !user.is_email_verified) {
            await trySendVerificationEmail(user);
        }
        return res.status(200).json({
            message: "Si el email está registrado y falta verificarlo, te enviamos un nuevo link de verificación"
        });
    } catch (error) {
        console.error("Error al reenviar el email de verificación:", error);
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
        return res.status(200).json({
            user: toPublicUser(user),
            entrepreneurProfile: user.entrepreneurProfile
        });
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
