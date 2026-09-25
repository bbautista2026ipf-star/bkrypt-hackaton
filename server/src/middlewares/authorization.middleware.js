// Se usa siempre después de "authentication", que es quien carga req.userData con el rol leído de la base
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.userData) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }
            if (!allowedRoles.includes(req.userData.user_role)) {
                return res.status(403).json({ message: "No tenés permisos para realizar esta acción" });
            }
            next();
        } catch (error) {
            console.error("Error al verificar los permisos del usuario:", error);
            return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
        }
    };
};

// Acciones que publican contenido a nombre del usuario exigen un correo verificado
export const requireVerifiedEmail = (req, res, next) => {
    try {
        if (!req.userData?.is_email_verified) {
            return res.status(403).json({
                message: "Verificá tu correo electrónico para realizar esta acción",
                code: "EMAIL_NOT_VERIFIED"
            });
        }
        next();
    } catch (error) {
        console.error("Error al verificar el correo del usuario:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
