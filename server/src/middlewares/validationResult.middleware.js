import { validationResult } from "express-validator";
import { deleteUploadedFile } from "../helpers/file.helper.js";

// Frena la petición si alguna validación previa acumuló errores
export const checkValidationsResult = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si la petición traía un archivo, se borra para no dejar imágenes huérfanas
        if (req.file) {
            await deleteUploadedFile(req.file.path);
        }
        const formattedErrors = errors.formatWith((err) => `${err.path}: ${err.msg}`);
        return res.status(400).json({ errors: formattedErrors.array() });
    }
    next();
};
