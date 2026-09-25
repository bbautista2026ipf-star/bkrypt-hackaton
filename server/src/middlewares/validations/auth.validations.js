import { body } from "express-validator";
import { User } from "../../models/user.model.js";

const isEntrepreneur = body("role").equals("entrepreneur");

export const registerValidations = [
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
    body("verification_document_url")
        .if(isEntrepreneur)
        .trim()
        .isURL().withMessage("La constancia del emprendimiento es obligatoria y debe ser una URL válida")
        .isLength({ max: 255 }).withMessage("La URL de la constancia no puede superar los 255 caracteres")
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
