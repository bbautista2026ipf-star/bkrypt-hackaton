import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import { resendVerificationEmail, verifyEmail } from "../services/auth.service.js";

// Confirma el correo con el token del enlace recibido por email
export function useEmailVerification(token) {
    const confirmEmail = useCallback(() => verifyEmail(token), [token]);
    const { data, status, error } = useAsyncData(confirmEmail, { enabled: Boolean(token) });

    return {
        status: token ? status : "error",
        message: token ? data?.message ?? error?.message : "El enlace de verificación está incompleto"
    };
}

// Pide un nuevo enlace de verificación. Es público porque sin el email verificado no se puede iniciar sesión.
export function useResendVerification() {
    const [state, setState] = useState({ status: "idle", message: null });

    const resend = useCallback(async (email) => {
        setState({ status: "sending", message: null });
        try {
            const { message } = await resendVerificationEmail(email);
            setState({ status: "success", message });
        } catch (error) {
            setState({ status: "error", message: error.message });
        }
    }, []);

    return { ...state, resend };
}
