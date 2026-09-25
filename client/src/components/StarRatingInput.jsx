import PropTypes from "prop-types";
import StarIcon from "./StarIcon.jsx";

// Grupo de radios nativos (navegables con flechas) presentados como botones de Bootstrap
function StarRatingInput({ name, value, onChange, error = null, idPrefix }) {
    const errorId = error ? `${idPrefix}-error` : undefined;
    return (
        <fieldset className="mb-3" aria-describedby={errorId}>
            <legend className="form-label fw-semibold fs-6">
                Tu valoración <span className="text-body-secondary fw-normal">(obligatorio)</span>
            </legend>
            <div className="star-input d-flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                    <div key={stars}>
                        <input
                            type="radio"
                            className="btn-check"
                            name={name}
                            id={`${idPrefix}-${stars}`}
                            value={stars}
                            checked={Number(value) === stars}
                            onChange={() => onChange(stars)}
                        />
                        <label className={`btn ${Number(value) === stars ? "btn-primary" : "btn-outline-primary"} d-flex align-items-center gap-1`} htmlFor={`${idPrefix}-${stars}`}>
                            <StarIcon isFilled={Number(value) >= stars} />
                            <span>{stars}<span className="visually-hidden"> {stars === 1 ? "estrella" : "estrellas"}</span></span>
                        </label>
                    </div>
                ))}
            </div>
            {error ? <div id={errorId} className="invalid-feedback d-block">{error}</div> : null}
        </fieldset>
    );
}

StarRatingInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    idPrefix: PropTypes.string.isRequired
};

export default StarRatingInput;
