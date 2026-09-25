import { body, param, query } from "express-validator";
import { Product } from "../../models/product.model.js";

const PRODUCT_CATEGORIES = Product.getAttributes().category.values;

// Los productos se envían como multipart/form-data (por la imagen): todos los valores llegan como texto
// y los sanitizadores (toFloat, toBoolean) los convierten al tipo correcto.
// En la actualización todos los campos son opcionales; en la creación, los obligatorios se exigen
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

const productBodyValidations = (isUpdate) => [
    field("name", isUpdate)
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre del producto es obligatorio y debe tener entre 2 y 100 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("La descripción no puede superar los 2000 caracteres"),
    field("price", isUpdate)
        .isFloat({ min: 0, max: 99999999.99 }).withMessage("El precio es obligatorio y debe ser un número mayor o igual a 0")
        .toFloat(),
    field("category", isUpdate)
        .isIn(PRODUCT_CATEGORIES).withMessage(`La categoría debe ser una de: ${PRODUCT_CATEGORIES.join(", ")}`),
    body("is_available")
        .optional()
        .isBoolean().withMessage("La disponibilidad debe ser true o false")
        .toBoolean()
];

export const productIdValidation = [
    param("id").isUUID().withMessage("El id del producto no es válido")
];

export const createProductValidations = productBodyValidations(false);

// El id se valida antes (en la ruta) porque el dueño se verifica antes de recibir la imagen
export const updateProductValidations = [
    ...productBodyValidations(true),
    body("remove_image")
        .optional()
        .isBoolean().withMessage("remove_image debe ser true o false")
        .toBoolean()
];

export const productFiltersValidations = [
    query("category")
        .optional()
        .isIn(PRODUCT_CATEGORIES).withMessage(`La categoría debe ser una de: ${PRODUCT_CATEGORIES.join(", ")}`),
    query("available")
        .optional()
        .isBoolean().withMessage("El filtro de disponibilidad debe ser true o false")
        .toBoolean(),
    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La búsqueda no puede superar los 100 caracteres")
];
