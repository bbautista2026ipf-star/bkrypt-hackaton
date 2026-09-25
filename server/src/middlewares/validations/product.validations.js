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

// Cambio de imagen del administrador: la imagen nueva llega como archivo; sin archivo, remove_image la quita
export const productImageValidations = [
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
        .isLength({ max: 100 }).withMessage("La búsqueda no puede superar los 100 caracteres"),

    // Paginación
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("La página debe ser un número entero mayor o igual a 1")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage("El límite debe ser un número entero entre 1 y 50")
        .toInt(),

    // Cercanía: lat y lng van juntas; radius_km es opcional
    query("lat")
        .optional()
        .isFloat({ min: -90, max: 90 }).withMessage("La latitud debe estar entre -90 y 90")
        .toFloat()
        .custom((lat, { req }) => {
            if (req.query.lng === undefined) {
                throw new Error("Para filtrar por cercanía enviá lat y lng juntas");
            }
            return true;
        }),
    query("lng")
        .optional()
        .isFloat({ min: -180, max: 180 }).withMessage("La longitud debe estar entre -180 y 180")
        .toFloat()
        .custom((lng, { req }) => {
            if (req.query.lat === undefined) {
                throw new Error("Para filtrar por cercanía enviá lat y lng juntas");
            }
            return true;
        }),
    query("radius_km")
        .optional()
        .isFloat({ min: 0.1, max: 100 }).withMessage("El radio debe estar entre 0.1 y 100 km")
        .toFloat()
        .custom((radius, { req }) => {
            if (req.query.lat === undefined || req.query.lng === undefined) {
                throw new Error("El radio necesita lat y lng");
            }
            return true;
        })
];
