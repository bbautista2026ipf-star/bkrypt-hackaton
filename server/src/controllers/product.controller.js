import { matchedData } from "express-validator";
import { Op } from "sequelize";
import { Product } from "../models/product.model.js";
import { EntrepreneurProfile } from "../models/entrepreneur_profile.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { ratingAttributes, formatProductRating } from "../helpers/rating.helper.js";
import { toPublicUploadPath, deleteUploadedFile } from "../helpers/file.helper.js";

const buildProductFilters = ({ category, available, search }) => {
    const where = {};
    if (category) {
        where.category = category;
    }
    if (available !== undefined) {
        where.is_available = available;
    }
    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }
    return where;
};

export const getProducts = async (req, res) => {
    try {
        const filters = matchedData(req, { locations: ["query"] });
        const products = await Product.findAll({
            where: buildProductFilters(filters),
            attributes: { include: ratingAttributes() },
            include: { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name"] },
            order: [["createdAt", "DESC"]]
        });
        return res.status(200).json({ products: products.map(formatProductRating) });
    } catch (error) {
        console.error("Error al obtener el catálogo de productos:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = matchedData(req, { locations: ["params"] });
        const product = await Product.findByPk(id, {
            attributes: { include: ratingAttributes() },
            include: [
                { model: EntrepreneurProfile, as: "entrepreneur", attributes: ["id", "brand_name", "whatsapp_number"] },
                {
                    model: Review,
                    as: "reviews",
                    attributes: ["id", "stars", "comment", "createdAt", "updatedAt"],
                    include: { model: User, as: "author", attributes: ["id", "name"] }
                }
            ],
            order: [[{ model: Review, as: "reviews" }, "createdAt", "DESC"]]
        });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.status(200).json({ product: formatProductRating(product) });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.file lo carga el middleware uploadProductImage cuando el formulario incluye una imagen
export const createProduct = async (req, res) => {
    try {
        const productData = matchedData(req, { locations: ["body"] });
        const profile = await EntrepreneurProfile.findOne({
            where: { user_id: req.userData.user_id },
            attributes: ["id"]
        });
        if (!profile) {
            await deleteUploadedFile(req.file?.path);
            return res.status(403).json({ message: "Tu usuario no tiene un perfil de emprendedor" });
        }
        const newProduct = await Product.create({
            ...productData,
            image_url: req.file ? toPublicUploadPath(req.file.path) : null,
            entrepreneur_profile_id: profile.id
        });
        return res.status(201).json({ message: "Producto publicado con éxito", product: newProduct });
    } catch (error) {
        await deleteUploadedFile(req.file?.path);
        console.error("Error al crear el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

// req.resource lo carga isProductOwner (editar) o canDeleteProduct (eliminar)
export const updateProduct = async (req, res) => {
    try {
        const { remove_image, ...productData } = matchedData(req, { locations: ["body"] });
        const previousImage = req.resource.image_url;
        if (req.file) {
            productData.image_url = toPublicUploadPath(req.file.path);
        } else if (remove_image) {
            productData.image_url = null;
        }
        if (Object.keys(productData).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }
        const updatedProduct = await req.resource.update(productData);
        // La imagen anterior se borra recién cuando el cambio quedó guardado
        if (previousImage && productData.image_url !== undefined && productData.image_url !== previousImage) {
            await deleteUploadedFile(previousImage);
        }
        return res.status(200).json({ message: "Producto actualizado con éxito", product: updatedProduct });
    } catch (error) {
        await deleteUploadedFile(req.file?.path);
        console.error("Error al actualizar el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const imageToDelete = req.resource.image_url;
        await req.resource.destroy();
        await deleteUploadedFile(imageToDelete);
        return res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
    }
};
