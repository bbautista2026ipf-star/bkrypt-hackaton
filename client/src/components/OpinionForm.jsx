import PropTypes from "prop-types";
import useOpinionForm from "../hooks/useOpinionForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import StarRatingInput from "./StarRatingInput.jsx";
import { OPINION_COMMENT_MAX_LENGTH } from "../lib/constants.js";

function OpinionForm({ existingOpinion = null, onSubmitOpinion }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, setFieldValue, handleSubmit, remainingCharacters } =
        useOpinionForm(existingOpinion, onSubmitOpinion);

    return (
        <form ref={formRef} className="card card-body mb-4" onSubmit={handleSubmit} noValidate aria-labelledby="opinion-form-title">
            <h3 id="opinion-form-title" className="h5">{existingOpinion ? "Actualizá tu opinión" : "Dejá tu opinión"}</h3>
            <FormAlert message={status === "error" ? formError : null} />
            <FormAlert message={status === "success" ? "Tu opinión ya está publicada en el muro." : null} variant="success" />
            <StarRatingInput name="stars" idPrefix="opinion-stars" value={values.stars} onChange={(stars) => setFieldValue("stars", stars)} error={errors.stars} />
            <FormField
                id="opinion-comment"
                name="comment"
                label="Tu experiencia"
                as="textarea"
                rows={4}
                maxLength={OPINION_COMMENT_MAX_LENGTH}
                required
                value={values.comment}
                onChange={handleChange}
                error={errors.comment}
                help={`Te quedan ${remainingCharacters} caracteres.`}
            />
            <div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Publicando..." : "Publicar opinión"}
                </button>
            </div>
        </form>
    );
}

OpinionForm.propTypes = {
    existingOpinion: PropTypes.shape({
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired
    }),
    onSubmitOpinion: PropTypes.func.isRequired
};

export default OpinionForm;
