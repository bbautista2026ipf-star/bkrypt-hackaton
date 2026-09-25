import { matchedData } from "express-validator";
import { Product } from "../models/product.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { Review } from "../models/review.model.js";

// Crea la calificación del usuario o, si ya había calificado el producto, la reemplaza
export const rateProduct = async (req, res) => {
    try {
        const { id: productId } = matchedData(req, { locations: ["params"] });
        const { stars, comment } = matchedData(req, { locations: ["body"] });
        const userId = req.userData.user_id;

        const product = await Product.findByPk(productId, { attributes: ["id", "entrepreneur_profile_id"] });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const profile = await EntrepreneurProfile.findOne({ where: { user_id: userId }, attributes: ["id"] });
        if (profile && profile.id === product.entrepreneur_profile_id) {
            return res.status(403).json({ message: "No podés calificar tus propios productos" });
        }

        const reviewData = { stars, comment: comment || null };
        const existingReview = await Review.findOne({ where: { user_id: userId, product_id: productId } });
        if (existingReview) {
            const updatedReview = await existingReview.update(reviewData);
            return res.status(200).json({ message: "Calificación actualizada con éxito", review: updatedReview });
        }

        const newReview = await Review.create({ ...reviewData, user_id: userId, product_id: productId });
        return res.status(201).json({ message: "Calificación registrada con éxito", review: newReview });
    } catch (error) {
        console.error("Error al calificar el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
