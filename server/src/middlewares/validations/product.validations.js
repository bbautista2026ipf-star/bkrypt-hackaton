import { body, param, query } from "express-validator";
import { Product } from "../../models/product.model.js";

const PRODUCT_CATEGORIES = Product.getAttributes().category.values;

const MAX_SEARCH_RADIUS_KM = 100;

// En la actualización todos los campos son opcionales; en la creación, los obligatorios se exigen
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

const productBodyValidations = (isUpdate) => [
    field("name", isUpdate)
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre del producto es obligatorio y debe tener entre 2 y 100 caracteres"),
    body("description")
        .optional({ values: "null" })
        .trim()
        .isLength({ max: 2000 }).withMessage("La descripción no puede superar los 2000 caracteres"),
    field("price", isUpdate)
        .isFloat({ gt: 0, max: 99999999.99 }).withMessage("El precio es obligatorio y debe ser un número mayor a 0")
        .toFloat(),
    field("stock", isUpdate)
        .isInt({ min: 0, max: 100000 }).withMessage("El stock es obligatorio y debe ser un número entero mayor o igual a 0")
        .toInt(),
    field("category", isUpdate)
        .isIn(PRODUCT_CATEGORIES).withMessage(`La categoría debe ser una de: ${PRODUCT_CATEGORIES.join(", ")}`),
    body("image_url")
        .optional({ values: "falsy" })
        .trim()
        .isURL({ protocols: ["http", "https"], require_protocol: true }).withMessage("La imagen debe ser una URL válida que empiece con http:// o https://")
        .isLength({ max: 255 }).withMessage("La URL de la imagen no puede superar los 255 caracteres")
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
        .optional({ values: "falsy" })
        .isIn(PRODUCT_CATEGORIES).withMessage(`La categoría debe ser una de: ${PRODUCT_CATEGORIES.join(", ")}`),
    query("available")
        .optional({ values: "falsy" })
        .isBoolean().withMessage("El filtro de disponibilidad debe ser true o false")
        .toBoolean(),
    query("search")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 100 }).withMessage("La búsqueda no puede superar los 100 caracteres")
];

// El filtro de cercanía necesita las dos coordenadas; el radio sin ubicación no tiene sentido
const requiresCoordinates = (value, { req }) => {
    if (req.query.lat === undefined || req.query.lng === undefined) {
        throw new Error("El filtro de cercanía necesita latitud y longitud");
    }
    return true;
};

export const productSearchValidations = [
    ...productFiltersValidations,
    query("lat")
        .optional()
        .custom(requiresCoordinates).bail()
        .isFloat({ min: -90, max: 90 }).withMessage("La latitud debe ser un número entre -90 y 90")
        .toFloat(),
    query("lng")
        .optional()
        .custom(requiresCoordinates).bail()
        .isFloat({ min: -180, max: 180 }).withMessage("La longitud debe ser un número entre -180 y 180")
        .toFloat(),
    query("radius")
        .optional()
        .custom(requiresCoordinates).bail()
        .isFloat({ gt: 0, max: MAX_SEARCH_RADIUS_KM }).withMessage(`El radio debe ser un número de kilómetros mayor a 0 y hasta ${MAX_SEARCH_RADIUS_KM}`)
        .toFloat()
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
