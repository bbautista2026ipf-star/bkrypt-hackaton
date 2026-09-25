import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import useAuth from "./useAuth.js";
import { resendVerificationEmail, verifyEmail } from "../services/auth.service.js";

// Confirma el correo con el token del enlace recibido por email
export function useEmailVerification(token) {
    const { refreshSession } = useAuth();
    const confirmEmail = useCallback(async () => {
        const result = await verifyEmail(token);
        await refreshSession();
        return result;
    }, [token, refreshSession]);
    const { data, status, error } = useAsyncData(confirmEmail, { enabled: Boolean(token) });

    return {
        status: token ? status : "error",
        message: token ? data?.message ?? error?.message : "El enlace de verificación está incompleto"
    };
}

// Pide un nuevo enlace de verificación para la cuenta con sesión
export function useResendVerification() {
    const [state, setState] = useState({ status: "idle", message: null });

    const resend = useCallback(async () => {
        setState({ status: "sending", message: null });
        try {
            const { message } = await resendVerificationEmail();
            setState({ status: "success", message });
        } catch (error) {
            setState({ status: "error", message: error.message });
        }
    }, []);

    return { ...state, resend };
}
