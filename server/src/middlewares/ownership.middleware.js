import { Product } from "../models/product.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";

// Se usa después de authorizeRoles("entrepreneur"): deja el perfil propio en req.entrepreneurProfile
export const attachEntrepreneurProfile = async (req, res, next) => {
    try {
        const profile = await EntrepreneurProfile.findOne({ where: { user_id: req.userData.user_id } });
        if (!profile) {
            return res.status(403).json({ message: "Tu usuario no tiene un perfil de emprendedor" });
        }
        req.entrepreneurProfile = profile;
        next();
    } catch (error) {
        console.error("Error al obtener el perfil del emprendedor:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// Se usa después de "attachEntrepreneurProfile": deja el producto en req.product para no volver a buscarlo en el controlador
export const isProductOwner = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        if (req.entrepreneurProfile.id !== product.entrepreneur_profile_id) {
            return res.status(403).json({ message: "Solo el emprendedor que publicó el producto puede modificarlo" });
        }
        req.product = product;
        next();
    } catch (error) {
        console.error("Error al verificar el dueño del producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
