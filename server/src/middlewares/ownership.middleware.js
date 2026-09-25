import { Product } from "../models/product.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";

// Se usa después de "authentication": deja el producto en req.product para no volver a buscarlo en el controlador
export const isProductOwner = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const profile = await EntrepreneurProfile.findOne({
            where: { user_id: req.userData.user_id },
            attributes: ["id"]
        });
        if (!profile || profile.id !== product.entrepreneur_profile_id) {
            return res.status(403).json({ message: "Solo el emprendedor que publicó el producto puede modificarlo" });
        }
        req.product = product;
        next();
    } catch (error) {
        console.error("Error al verificar el dueño del producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
