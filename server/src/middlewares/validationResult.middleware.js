import { validationResult } from "express-validator";

// Frena la petición si alguna validación previa acumuló errores; devuelve un error por campo para mostrarlo junto a cada input
export const checkValidationsResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fieldErrors = errors
            .array({ onlyFirstError: true })
            .map((error) => ({ field: error.path, message: error.msg }));
        return res.status(400).json({ message: "Revisá los datos enviados", errors: fieldErrors });
    }
    next();
};
