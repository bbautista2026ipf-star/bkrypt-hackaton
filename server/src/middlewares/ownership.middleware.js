import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Schedule } from "../models/schedule.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";

// El dueño se identifica por el usuario (user_id) o por su perfil de emprendedor (entrepreneur_profile_id)
const getRequesterOwnerId = async (ownerField, userId) => {
    if (ownerField === "user_id") {
        return userId;
    }
    const profile = await EntrepreneurProfile.findOne({ where: { user_id: userId }, attributes: ["id"] });
    return profile ? profile.id : null;
};

// Se usa después de "authentication": deja el recurso en req.resource para no volver a buscarlo en el controlador
const checkOwnership = (Model, { ownerField, notFoundMessage, forbiddenMessage, allowAdmin = false }) => {
    return async (req, res, next) => {
        try {
            const resource = await Model.findByPk(req.params.id);
            if (!resource) {
                return res.status(404).json({ message: notFoundMessage });
            }
            const isAdminAllowed = allowAdmin && req.userData.user_role === "admin";
            if (!isAdminAllowed) {
                const requesterOwnerId = await getRequesterOwnerId(ownerField, req.userData.user_id);
                if (!requesterOwnerId || requesterOwnerId !== resource[ownerField]) {
                    return res.status(403).json({ message: forbiddenMessage });
                }
            }
            req.resource = resource;
            next();
        } catch (error) {
            console.error("Error al verificar el dueño del recurso:", error);
            return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
        }
    };
};

const productOwnership = {
    ownerField: "entrepreneur_profile_id",
    notFoundMessage: "Producto no encontrado",
    forbiddenMessage: "Solo el emprendedor que publicó el producto puede modificarlo"
};

export const isProductOwner = checkOwnership(Product, productOwnership);

// Un admin puede eliminar productos inapropiados
export const canDeleteProduct = checkOwnership(Product, { ...productOwnership, allowAdmin: true });

export const isScheduleOwner = checkOwnership(Schedule, {
    ownerField: "entrepreneur_profile_id",
    notFoundMessage: "Horario no encontrado",
    forbiddenMessage: "Solo el emprendedor que cargó el horario puede modificarlo"
});

// El autor puede borrar su calificación y un admin puede moderarla
export const canDeleteReview = checkOwnership(Review, {
    ownerField: "user_id",
    notFoundMessage: "Calificación no encontrada",
    forbiddenMessage: "Solo el autor de la calificación puede eliminarla",
    allowAdmin: true
});
