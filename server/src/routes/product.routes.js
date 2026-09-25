import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, updateProductImage, deleteProduct } from "../controllers/product.controller.js";
import {
    productIdValidation,
    createProductValidations,
    updateProductValidations,
    productImageValidations,
    productFiltersValidations
} from "../middlewares/validations/product.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { isProductOwner, canDeleteProduct, canEditProductImage } from "../middlewares/ownership.middleware.js";
import { uploadProductImage } from "../middlewares/upload.middleware.js";

export const productRouter = Router();

// Rutas públicas: catálogo general y detalle de producto
productRouter.get("/products", productFiltersValidations, checkValidationsResult, getProducts);
productRouter.get("/products/:id", productIdValidation, checkValidationsResult, getProductById);

// Rutas privadas: publicación y gestión de productos (el emprendedor dueño; un admin también puede eliminar)
// Publicar y editar reciben multipart/form-data con la imagen opcional en el campo "image".
// Al editar, el dueño se verifica antes de recibir el archivo para no guardar imágenes de peticiones rechazadas.
productRouter.post("/products", authentication, authorizeRoles("entrepreneur"), uploadProductImage, createProductValidations, checkValidationsResult, createProduct);
productRouter.put(
    "/products/:id",
    authentication,
    authorizeRoles("entrepreneur"),
    productIdValidation,
    checkValidationsResult,
    isProductOwner,
    uploadProductImage,
    updateProductValidations,
    checkValidationsResult,
    updateProduct
);
// El administrador puede reemplazar o quitar la imagen de cualquier producto (multipart con el archivo en "image")
productRouter.put(
    "/products/:id/image",
    authentication,
    authorizeRoles("admin"),
    productIdValidation,
    checkValidationsResult,
    canEditProductImage,
    uploadProductImage,
    productImageValidations,
    checkValidationsResult,
    updateProductImage
);
productRouter.delete("/products/:id", authentication, authorizeRoles("entrepreneur", "admin"), productIdValidation, checkValidationsResult, canDeleteProduct, deleteProduct);
