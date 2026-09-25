import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuth from "./useAuth.js";
import useForm from "./useForm.js";
import { collectErrors, validateEmail } from "../lib/validators.js";
import { PATHS } from "../lib/constants.js";

const INITIAL_VALUES = { email: "", password: "" };

const validateLogin = (values) => collectErrors({
    email: validateEmail(values.email),
    password: values.password ? null : "La contraseña es obligatoria"
});

// Solo se aceptan rutas internas como destino después del login
const safeRedirect = (target) => (target?.startsWith("/") && !target.startsWith("//") ? target : PATHS.home);

function useLoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const form = useForm(INITIAL_VALUES, validateLogin);
    const { submit } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const isLoggedIn = await submit((values) => login({ email: values.email.trim(), password: values.password }));
        if (isLoggedIn) {
            navigate(safeRedirect(searchParams.get("volver")), { replace: true });
        }
    }, [submit, login, navigate, searchParams]);

    return { ...form, handleSubmit };
}

export default useLoginForm;
