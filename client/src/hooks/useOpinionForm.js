import { useCallback, useMemo } from "react";
import useForm from "./useForm.js";
import { OPINION_COMMENT_MAX_LENGTH } from "../lib/constants.js";
import { collectErrors, validateLength } from "../lib/validators.js";

const validateOpinion = (values) => collectErrors({
    stars: values.stars >= 1 && values.stars <= 5 ? null : "Elegí una valoración del 1 al 5",
    comment: validateLength(values.comment, { label: "El comentario", min: 3, max: OPINION_COMMENT_MAX_LENGTH })
});

// Si el usuario ya opinó, el formulario arranca con su opinión para que pueda actualizarla
function useOpinionForm(existingOpinion, onSubmitOpinion) {
    const initialValues = useMemo(
        () => ({ stars: existingOpinion?.stars ?? 0, comment: existingOpinion?.comment ?? "" }),
        [existingOpinion]
    );
    const form = useForm(initialValues, validateOpinion);
    const { submit } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit((values) => onSubmitOpinion({ stars: Number(values.stars), comment: values.comment.trim() }));
    }, [submit, onSubmitOpinion]);

    return {
        ...form,
        handleSubmit,
        remainingCharacters: OPINION_COMMENT_MAX_LENGTH - form.values.comment.length
    };
}

export default useOpinionForm;
