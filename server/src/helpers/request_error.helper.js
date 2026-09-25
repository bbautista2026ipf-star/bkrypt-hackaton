// Error de negocio esperado (404, 409, etc.): el mensaje es seguro para mostrarlo al usuario final
export class RequestError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// Respuesta única para los catch de los controladores: errores esperados con su código, el resto como 500 genérico
export const sendControllerError = (res, error, logMessage) => {
    if (error instanceof RequestError) {
        return res.status(error.status).json({ message: error.message });
    }
    console.error(logMessage, error);
    return res.status(500).json({ message: "Ocurrió un error interno en el servidor" });
};
