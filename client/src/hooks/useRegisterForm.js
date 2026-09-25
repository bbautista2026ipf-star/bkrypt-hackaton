import { useCallback, useState } from "react";
import useForm from "./useForm.js";
import { registerUser } from "../services/auth.service.js";
import { EMPTY_BUSINESS, toBusinessPayload, validateBusiness } from "../lib/businessForm.js";
import { collectErrors, validateEmail, validatePassword, validatePersonName } from "../lib/validators.js";
import { ROLES } from "../lib/constants.js";

const INITIAL_VALUES = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: ROLES.consumer,
    ...EMPTY_BUSINESS
};

// El formulario extendido solo se valida si el visitante eligió registrarse como emprendedor
const validateRegistration = (values) => ({
    ...collectErrors({
        name: validatePersonName(values.name),
        email: validateEmail(values.email),
        password: validatePassword(values.password),
        password_confirmation: values.password === values.password_confirmation ? null : "Las contraseñas no coinciden"
    }),
    ...(values.role === ROLES.entrepreneur ? validateBusiness(values) : {})
});

function useRegisterForm() {
    const form = useForm(INITIAL_VALUES, validateRegistration);
    const { submit } = form;
    const [registration, setRegistration] = useState(null);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit(async (values) => {
            const result = await registerUser({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
                role: values.role,
                ...(values.role === ROLES.entrepreneur ? toBusinessPayload(values) : {})
            });
            setRegistration(result);
        });
    }, [submit]);

    return { ...form, handleSubmit, registration };
}

export default useRegisterForm;
