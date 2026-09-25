import multer from "multer";
import { deleteUploadedFile } from "../helpers/file.helper.js";

const MULTER_ERROR_MESSAGES = {
    LIMIT_FILE_SIZE: "La imagen supera el tamaño máximo permitido de 5 MB",
    LIMIT_UNEXPECTED_FILE: "Solo se permite subir una imagen en el campo \"image\""
};

// Va después de todas las rutas: responde a cualquier ruta que no exista
export const notFoundHandler = (req, res) => {
    return res.status(404).json({ message: "La ruta solicitada no existe" });
};

// Express lo reconoce como manejador de errores por recibir 4 parámetros
export const errorHandler = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (req.file) {
        await deleteUploadedFile(req.file.path);
    }
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
    }
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: MULTER_ERROR_MESSAGES[err.code] || "No se pudo procesar el archivo enviado" });
    }
    if (err.isInvalidFileType) {
        return res.status(400).json({ message: err.message });
    }
    console.error("Error no controlado:", err);
    return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
};
