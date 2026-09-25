import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuth from "./useAuth.js";
import useForm from "./useForm.js";
import { collectErrors, validateEmail } from "../lib/validators.js";
import { PATHS } from "../lib/constants.js";

const INITIAL_VALUES = { email: "", password: "" };

const EMAIL_NOT_VERIFIED_STATUS = 403;

const validateLogin = (values) => collectErrors({
    email: validateEmail(values.email),
    password: values.password ? null : "La contraseña es obligatoria"
});

// Solo se aceptan rutas internas como destino después del login
const safeRedirect = (target) => (target?.startsWith("/") && !target.startsWith("//") ? target : PATHS.home);

// El backend no deja iniciar sesión sin el email verificado (403): en ese caso se ofrece reenviar el enlace
function useLoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const form = useForm(INITIAL_VALUES, validateLogin);
    const { submit } = form;
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setUnverifiedEmail(null);
        const email = form.values.email.trim();
        const isLoggedIn = await submit(async (values) => {
            try {
                await login({ email, password: values.password });
            } catch (error) {
                if (error.status === EMAIL_NOT_VERIFIED_STATUS) {
                    setUnverifiedEmail(email);
                }
                throw error;
            }
        });
        if (isLoggedIn) {
            navigate(safeRedirect(searchParams.get("volver")), { replace: true });
        }
    }, [submit, login, navigate, searchParams, form.values.email]);

    return { ...form, handleSubmit, unverifiedEmail };
}

export default useLoginForm;
