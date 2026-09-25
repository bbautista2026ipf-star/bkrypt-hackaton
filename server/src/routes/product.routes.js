import { Router } from "express";
import { getProducts, searchProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { rateProduct } from "../controllers/review.controller.js";
import {
    productIdValidation,
    createProductValidations,
    updateProductValidations,
    productFiltersValidations,
    productSearchValidations,
    rateProductValidations
} from "../middlewares/validations/product.validations.js";
import { checkValidationsResult } from "../middlewares/validationResult.middleware.js";
import { isProductOwner } from "../middlewares/ownership.middleware.js";
import { requireEntrepreneur, requireMember } from "../middlewares/access.middleware.js";

export const productRouter = Router();

// Rutas públicas: catálogo general, buscador avanzado y detalle de producto
// "/search" va antes que "/:id" para que Express no lo interprete como un id
productRouter.get("/products", productFiltersValidations, checkValidationsResult, getProducts);
productRouter.get("/products/search", productSearchValidations, checkValidationsResult, searchProducts);
productRouter.get("/products/:id", productIdValidation, checkValidationsResult, getProductById);

// Rutas privadas: publicación y gestión de productos (solo el emprendedor dueño)
productRouter.post("/products", requireEntrepreneur, createProductValidations, checkValidationsResult, createProduct);
productRouter.put("/products/:id", requireEntrepreneur, updateProductValidations, checkValidationsResult, isProductOwner, updateProduct);
productRouter.delete("/products/:id", requireEntrepreneur, productIdValidation, checkValidationsResult, isProductOwner, deleteProduct);

// Rutas privadas: calificación de productos
productRouter.post("/products/:id/reviews", requireMember, rateProductValidations, checkValidationsResult, rateProduct);
