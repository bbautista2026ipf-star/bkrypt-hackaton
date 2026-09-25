import { body, param, query } from "express-validator";
import { Product } from "../../models/product.model.js";

const PRODUCT_CATEGORIES = Product.getAttributes().category.values;

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
    body("image_url")
        .optional()
        .trim()
        .isURL().withMessage("La imagen debe ser una URL válida")
        .isLength({ max: 255 }).withMessage("La URL de la imagen no puede superar los 255 caracteres"),
    body("is_available")
        .optional()
        .isBoolean().withMessage("La disponibilidad debe ser true o false")
        .toBoolean()
];

export const productIdValidation = [
    param("id").isUUID().withMessage("El id del producto no es válido")
];

export const createProductValidations = productBodyValidations(false);

export const updateProductValidations = [
    ...productIdValidation,
    ...productBodyValidations(true)
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

export const rateProductValidations = [
    ...productIdValidation,
    body("stars")
        .isInt({ min: 1, max: 5 }).withMessage("La calificación es obligatoria y debe ser un número entero del 1 al 5")
        .toInt(),
    body("comment")
        .optional({ values: "null" })
        .trim()
        .isLength({ max: 1000 }).withMessage("El comentario no puede superar los 1000 caracteres")
];
