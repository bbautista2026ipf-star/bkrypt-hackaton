import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Carpeta server/uploads, resuelta desde este archivo para no depender del directorio desde el que se lanza node
export const UPLOADS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
export const PRODUCT_IMAGES_DIR = path.join(UPLOADS_ROOT, "products");

fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true });

// Ruta pública con la que el frontend pide la imagen (se sirve de forma estática en /uploads)
export const toPublicUploadPath = (absolutePath) =>
    "/uploads/" + path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join("/");

const PUBLIC_UPLOADS_PREFIX = "/uploads/";

// La ruta pública se revisa primero: en Windows path.isAbsolute("/uploads/...") también da true
const toAbsoluteUploadPath = (fileReference) => {
    if (fileReference.startsWith(PUBLIC_UPLOADS_PREFIX)) {
        return path.resolve(UPLOADS_ROOT, fileReference.slice(PUBLIC_UPLOADS_PREFIX.length));
    }
    return path.resolve(fileReference);
};

// Acepta la ruta absoluta de multer o la ruta pública guardada en la base
export const deleteUploadedFile = async (fileReference) => {
    if (!fileReference) {
        return;
    }
    const absolutePath = toAbsoluteUploadPath(fileReference);
    // Evita borrar archivos fuera de la carpeta de uploads si la ruta guardada fuera manipulada
    if (!absolutePath.startsWith(UPLOADS_ROOT + path.sep)) {
        return;
    }
    try {
        await fs.promises.unlink(absolutePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("No se pudo eliminar el archivo subido:", error);
        }
    }
};
