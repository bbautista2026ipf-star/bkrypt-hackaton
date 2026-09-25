import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { rateProduct } from "../controllers/review.controller.js";
import {
    productIdValidation,
    createProductValidations,
    updateProductValidations,
    productFiltersValidations,
    rateProductValidations
} from "../middlewares/validations/product.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { isProductOwner } from "../middlewares/ownership.middleware.js";

export const productRouter = Router();

// Rutas públicas: catálogo general y detalle de producto
productRouter.get("/products", productFiltersValidations, checkValidationsResult, getProducts);
productRouter.get("/products/:id", productIdValidation, checkValidationsResult, getProductById);

// Rutas privadas: publicación y gestión de productos (solo el emprendedor dueño)
productRouter.post("/products", authentication, authorizeRoles("entrepreneur"), createProductValidations, checkValidationsResult, createProduct);
productRouter.put("/products/:id", authentication, authorizeRoles("entrepreneur"), updateProductValidations, checkValidationsResult, isProductOwner, updateProduct);
productRouter.delete("/products/:id", authentication, authorizeRoles("entrepreneur"), productIdValidation, checkValidationsResult, isProductOwner, deleteProduct);

// Rutas privadas: calificación de productos
productRouter.post("/products/:id/reviews", authentication, authorizeRoles("consumer", "entrepreneur"), rateProductValidations, checkValidationsResult, rateProduct);
