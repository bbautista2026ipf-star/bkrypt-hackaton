import { verifyToken, TOKEN_PURPOSES } from "../helpers/jwt.helper.js";
import { User } from "../models/user.model.js";

const SESSION_COOKIE = "sessionToken";

// El header Authorization tiene prioridad sobre la cookie: permite probar la API con distintos roles (Thunder Client)
const readSessionToken = (req) => {
    const authorizationHeader = req.get("authorization");
    if (authorizationHeader?.startsWith("Bearer ")) {
        return authorizationHeader.slice("Bearer ".length).trim();
    }
    return req.cookies[SESSION_COOKIE];
};

// El rol se lee de la base en cada petición y no del token: una aprobación o un cambio de rol rige al instante
const findSessionUser = async (token) => {
    const payload = verifyToken(token, TOKEN_PURPOSES.session);
    if (!payload) {
        return null;
    }
    return await User.findByPk(payload.user_id, { attributes: ["id", "role", "is_email_verified"] });
};

const toUserData = (user) => ({
    user_id: user.id,
    user_role: user.role,
    is_email_verified: user.is_email_verified
});

export const authentication = async (req, res, next) => {
    try {
        const sessionToken = readSessionToken(req);
        if (!sessionToken) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        const user = await findSessionUser(sessionToken);
        if (!user) {
            return res.status(401).json({ message: "Sesión inválida o expirada" });
        }
        req.userData = toUserData(user);
        next();
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Para rutas públicas que muestran más datos a ciertos roles: si no hay sesión válida sigue como visitante
export const optionalAuthentication = async (req, res, next) => {
    try {
        const sessionToken = readSessionToken(req);
        const user = sessionToken ? await findSessionUser(sessionToken) : null;
        if (user) {
            req.userData = toUserData(user);
        }
        next();
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
