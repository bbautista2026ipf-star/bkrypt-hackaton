import { body } from "express-validator";
import { User } from "../../models/user.model.js";
import { businessValidations } from "./entrepreneur.validations.js";

const isEntrepreneurRole = (value, { req }) => req.body.role === "entrepreneur";

export const registerValidations = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 60 }).withMessage("El nombre es obligatorio y debe tener entre 2 y 60 caracteres"),
    body("email")
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email debe tener un formato válido").bail()
        .isLength({ max: 255 }).withMessage("El email no puede superar los 255 caracteres")
        // El mensaje no revela con qué rol está registrada la cuenta existente
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
    ...businessValidations(isEntrepreneurRole)
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

export const verifyEmailValidations = [
    body("token")
        .isString().withMessage("Falta el código de verificación")
        .trim()
        .notEmpty().withMessage("Falta el código de verificación")
];

export const entrepreneurRequestValidations = businessValidations();
