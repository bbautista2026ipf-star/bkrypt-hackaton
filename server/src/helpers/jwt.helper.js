import jwt from "jsonwebtoken";

// "purpose" distingue un token de sesión de uno de verificación de correo: ninguno sirve para lo que hace el otro
export const TOKEN_PURPOSES = {
    session: "session",
    emailVerification: "email-verification"
};

export const generateToken = (payload, expiresIn = "1h") => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    } catch (error) {
        throw new Error("Error generando el token: " + error.message);
    }
};

// Devuelve null si el token es inválido, está vencido o fue emitido para otro propósito
export const verifyToken = (token, expectedPurpose) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return payload.purpose === expectedPurpose ? payload : null;
    } catch {
        return null;
    }
};
