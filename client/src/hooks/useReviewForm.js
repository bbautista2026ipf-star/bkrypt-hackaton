import { useCallback, useMemo } from "react";
import useForm from "./useForm.js";
import { REVIEW_COMMENT_MAX_LENGTH } from "../lib/constants.js";
import { collectErrors, validateLength } from "../lib/validators.js";

const validateReview = (values) => collectErrors({
    stars: values.stars >= 1 && values.stars <= 5 ? null : "Elegí una calificación del 1 al 5",
    comment: validateLength(values.comment, { label: "El comentario", max: REVIEW_COMMENT_MAX_LENGTH, required: false })
});

// Si el usuario ya calificó el producto, el formulario arranca con su reseña para que pueda actualizarla
function useReviewForm(existingReview, onSubmitReview) {
    const initialValues = useMemo(
        () => ({ stars: existingReview?.stars ?? 0, comment: existingReview?.comment ?? "" }),
        [existingReview]
    );
    const form = useForm(initialValues, validateReview);
    const { submit } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit((values) => onSubmitReview({ stars: Number(values.stars), comment: values.comment.trim() || null }));
    }, [submit, onSubmitReview]);

    return {
        ...form,
        handleSubmit,
        remainingCharacters: REVIEW_COMMENT_MAX_LENGTH - form.values.comment.length
    };
}

export default useReviewForm;
