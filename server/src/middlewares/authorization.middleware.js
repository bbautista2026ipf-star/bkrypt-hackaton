// Se usa siempre después de "authentication", que es quien carga req.userData desde el token
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
