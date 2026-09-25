import { useCallback, useEffect, useRef, useState } from "react";

const keepFieldErrors = (fieldErrors) => fieldErrors;

// Estado de un formulario: valida en el cliente antes de enviar y, si el backend rechaza,
// muestra sus errores en el campo correspondiente. Tras un intento fallido enfoca el primer campo con error.
// mapFieldErrors adapta nombres de campos del backend a los del formulario cuando no coinciden.
function useForm(initialValues, validate, { mapFieldErrors = keepFieldErrors } = {}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [formError, setFormError] = useState(null);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const formRef = useRef(null);

    useEffect(() => {
        if (failedAttempts > 0) {
            formRef.current?.querySelector("[aria-invalid='true']")?.focus();
        }
    }, [failedAttempts]);

    const setFieldValue = useCallback((name, value) => {
        setValues((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }
            const remainingErrors = { ...previous };
            delete remainingErrors[name];
            return remainingErrors;
        });
    }, []);

    const handleChange = useCallback((event) => {
        const { name, type, value, checked } = event.target;
        setFieldValue(name, type === "checkbox" ? checked : value);
    }, [setFieldValue]);

    const submit = useCallback(async (onSubmit) => {
        const clientErrors = validate ? validate(values) : {};
        setErrors(clientErrors);
        setFormError(null);
        if (Object.keys(clientErrors).length > 0) {
            setStatus("idle");
            setFailedAttempts((count) => count + 1);
            return false;
        }
        setStatus("submitting");
        try {
            await onSubmit(values);
            setStatus("success");
            return true;
        } catch (error) {
            setErrors(mapFieldErrors(error.fieldErrors ?? {}));
            setFormError(error.message);
            setStatus("error");
            setFailedAttempts((count) => count + 1);
            return false;
        }
    }, [validate, values, mapFieldErrors]);

    const reset = useCallback((nextValues = initialValues) => {
        setValues(nextValues);
        setErrors({});
        setFormError(null);
        setStatus("idle");
    }, [initialValues]);

    return {
        values,
        errors,
        status,
        formError,
        isSubmitting: status === "submitting",
        formRef,
        handleChange,
        setFieldValue,
        submit,
        reset
    };
}

export default useForm;
