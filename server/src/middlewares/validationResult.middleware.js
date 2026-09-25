import { validationResult } from "express-validator";

// Frena la petición si alguna validación previa acumuló errores
export const checkValidationsResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.formatWith((err) => `${err.path}: ${err.msg}`);
        return res.status(400).json({ errors: formattedErrors.array() });
    }
    next();
};
