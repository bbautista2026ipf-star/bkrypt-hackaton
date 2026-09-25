import multer from "multer";
import { randomUUID } from "node:crypto";
import { PRODUCT_IMAGES_DIR } from "../helpers/file.helper.js";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

// La extensión se toma del tipo de archivo validado, no del nombre original que manda el usuario
const ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const productImageStorage = multer.diskStorage({
    destination: PRODUCT_IMAGES_DIR,
    filename: (req, file, callback) => {
        callback(null, `${randomUUID()}${ALLOWED_IMAGE_TYPES[file.mimetype]}`);
    }
});

const imageFileFilter = (req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
        const error = new Error("La imagen debe ser JPG, PNG o WEBP");
        error.isInvalidFileType = true;
        return callback(error);
    }
    callback(null, true);
};

// Espera un formulario multipart/form-data con el archivo en el campo "image" (opcional)
export const uploadProductImage = multer({
    storage: productImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 }
}).single("image");
