import PropTypes from "prop-types";
import useReviewForm from "../hooks/useReviewForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import StarRatingInput from "./StarRatingInput.jsx";
import { REVIEW_COMMENT_MAX_LENGTH } from "../lib/constants.js";

function ReviewForm({ existingReview = null, onSubmitReview }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, setFieldValue, handleSubmit, remainingCharacters } =
        useReviewForm(existingReview, onSubmitReview);

    return (
        <form ref={formRef} className="card card-body mb-4" onSubmit={handleSubmit} noValidate aria-labelledby="review-form-title">
            <h3 id="review-form-title" className="h5">{existingReview ? "Actualizá tu reseña" : "Calificá este producto"}</h3>
            <FormAlert message={status === "error" ? formError : null} />
            <FormAlert message={status === "success" ? "Tu reseña ya está publicada." : null} variant="success" />
            <StarRatingInput name="stars" idPrefix="review-stars" value={values.stars} onChange={(stars) => setFieldValue("stars", stars)} error={errors.stars} />
            <FormField
                id="review-comment"
                name="comment"
                label="Contá tu experiencia (opcional)"
                as="textarea"
                rows={3}
                maxLength={REVIEW_COMMENT_MAX_LENGTH}
                value={values.comment}
                onChange={handleChange}
                error={errors.comment}
                help={`Te quedan ${remainingCharacters} caracteres.`}
            />
            <div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Publicando..." : "Publicar reseña"}
                </button>
            </div>
        </form>
    );
}

ReviewForm.propTypes = {
    existingReview: PropTypes.shape({
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string
    }),
    onSubmitReview: PropTypes.func.isRequired
};

export default ReviewForm;
