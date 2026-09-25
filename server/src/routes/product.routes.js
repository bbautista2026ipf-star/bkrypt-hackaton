import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import {
    productIdValidation,
    createProductValidations,
    updateProductValidations,
    productFiltersValidations
} from "../middlewares/validations/product.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { isProductOwner, canDeleteProduct } from "../middlewares/ownership.middleware.js";

export const productRouter = Router();

// Rutas públicas: catálogo general y detalle de producto
productRouter.get("/products", productFiltersValidations, checkValidationsResult, getProducts);
productRouter.get("/products/:id", productIdValidation, checkValidationsResult, getProductById);

// Rutas privadas: publicación y gestión de productos (el emprendedor dueño; un admin también puede eliminar)
productRouter.post("/products", authentication, authorizeRoles("entrepreneur"), createProductValidations, checkValidationsResult, createProduct);
productRouter.put("/products/:id", authentication, authorizeRoles("entrepreneur"), updateProductValidations, checkValidationsResult, isProductOwner, updateProduct);
productRouter.delete("/products/:id", authentication, authorizeRoles("entrepreneur", "admin"), productIdValidation, checkValidationsResult, canDeleteProduct, deleteProduct);
