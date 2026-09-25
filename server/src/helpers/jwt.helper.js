import jwt from "jsonwebtoken";

// El "purpose" impide usar un token de verificación de email como token de sesión (y viceversa)
export const TOKEN_PURPOSES = {
    session: "session",
    emailVerification: "email_verification"
};

const signToken = (payload, expiresIn) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    } catch (error) {
        throw new Error("Error generando el token: " + error.message);
    }
};

export const generateToken = (payload) => signToken({ ...payload, purpose: TOKEN_PURPOSES.session }, "1h");

export const generateEmailVerificationToken = (userId) =>
    signToken({ user_id: userId, purpose: TOKEN_PURPOSES.emailVerification }, "24h");

export const verifyToken = (token, expectedPurpose = TOKEN_PURPOSES.session) => {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Error verificando el token: " + error.message);
    }
    if (decoded.purpose !== expectedPurpose) {
        throw new Error("El token no corresponde a esta operación");
    }
    return decoded;
};
