import { body } from "express-validator";
import { User } from "../../models/user.model.js";
import { assertEventLocationsExist } from "./entrepreneur.validations.js";

const isTrueValue = (value) => value === true || value === "true";

const isEntrepreneur = body("role").equals("entrepreneur");

const hasStore = (value, { req }) => req.body.role === "entrepreneur" && isTrueValue(req.body.has_store);

export const registerValidations = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre es obligatorio y debe tener entre 2 y 100 caracteres")
        .matches(/^[\p{L}\s'.-]+$/u).withMessage("El nombre solo puede contener letras, espacios, puntos, apóstrofes y guiones"),
    body("email")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email debe tener un formato válido").bail()
        .isLength({ max: 255 }).withMessage("El email no puede superar los 255 caracteres")
        .custom(async (email) => {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("Ese email ya está registrado");
            }
            return true;
        }),
    body("password")
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número"),
    body("role")
        .notEmpty().withMessage("El rol es obligatorio")
        .isIn(["consumer", "entrepreneur"]).withMessage("Los únicos roles permitidos son consumer o entrepreneur"),

    // Datos del emprendimiento: solo se validan si el rol elegido es entrepreneur
    body("brand_name")
        .if(isEntrepreneur)
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("El nombre del emprendimiento es obligatorio y debe tener entre 2 y 100 caracteres"),
    body("biography")
        .if(isEntrepreneur)
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("La biografía no puede superar los 1000 caracteres"),
    body("whatsapp_number")
        .if(isEntrepreneur)
        .optional()
        .trim()
        .matches(/^\+?\d{8,15}$/).withMessage("El número de WhatsApp debe contener entre 8 y 15 dígitos, con + opcional al inicio"),
    body("has_store")
        .if(isEntrepreneur)
        .isBoolean().withMessage("Indicá si el emprendimiento tiene local (true o false)")
        .toBoolean(),

    // Ubicación del local: obligatoria solo si el emprendedor indicó que tiene local
    body("store_address")
        .if(hasStore)
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage("La dirección del local es obligatoria y debe tener entre 3 y 255 caracteres"),
    body("store_latitude")
        .if(hasStore)
        .isFloat({ min: -90, max: 90 }).withMessage("La latitud del local es obligatoria y debe estar entre -90 y 90")
        .toFloat(),
    body("store_longitude")
        .if(hasStore)
        .isFloat({ min: -180, max: 180 }).withMessage("La longitud del local es obligatoria y debe estar entre -180 y 180")
        .toFloat(),

    // Ferias: obligatorias (al menos una) si no tiene local, opcionales si lo tiene
    body("event_location_ids.*")
        .if(isEntrepreneur)
        .isUUID().withMessage("Cada feria debe indicarse con un id válido"),
    body("event_location_ids")
        .if(isEntrepreneur)
        .custom(async (eventLocationIds, { req }) => {
            const storeDeclared = isTrueValue(req.body.has_store);
            if (eventLocationIds === undefined || eventLocationIds === null) {
                if (!storeDeclared) {
                    throw new Error("Si no tenés local, indicá al menos una feria a la que asistís");
                }
                return true;
            }
            if (!storeDeclared && Array.isArray(eventLocationIds) && eventLocationIds.length === 0) {
                throw new Error("Si no tenés local, indicá al menos una feria a la que asistís");
            }
            return assertEventLocationsExist(eventLocationIds);
        })
];

export const loginValidations = [
    body("email")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email debe tener un formato válido"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
];
