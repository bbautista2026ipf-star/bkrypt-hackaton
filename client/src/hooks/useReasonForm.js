import { useCallback, useEffect, useMemo } from "react";
import useForm from "./useForm.js";
import { collectErrors, validateLength } from "../lib/validators.js";

// Formulario de un solo campo "motivo" (reportar una opinión, rechazar una solicitud). Se limpia cada vez que se abre.
function useReasonForm({ isOpen, isRequired, maxLength, onConfirm }) {
    const initialValues = useMemo(() => ({ reason: "" }), []);
    const validateReason = useCallback((values) => collectErrors({
        reason: validateLength(values.reason, { label: "El motivo", min: isRequired ? 5 : 0, max: maxLength, required: isRequired })
    }), [isRequired, maxLength]);
    const form = useForm(initialValues, validateReason);
    const { submit, reset } = form;

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit((values) => onConfirm(values.reason.trim()));
    }, [submit, onConfirm]);

    return { ...form, handleSubmit };
}

export default useReasonForm;
