import { verifyToken } from "../helpers/jwt.helper.js";

export const authentication = (req, res, next) => {
    try {
        const sessionToken = req.cookies["sessionToken"];
        if (!sessionToken) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        req.userData = verifyToken(sessionToken);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Sesión inválida o expirada" });
    }
};
