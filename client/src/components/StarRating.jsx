import PropTypes from "prop-types";
import StarIcon from "./StarIcon.jsx";

// Muestra un puntaje de 1 a 5; el texto accesible no depende de ver el color de las estrellas
function StarRating({ value }) {
    const roundedValue = Math.round(value);
    return (
        <span className="star-rating" role="img" aria-label={`${value.toLocaleString("es-AR")} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((position) => (
                <StarIcon key={position} isFilled={position <= roundedValue} />
            ))}
        </span>
    );
}

StarRating.propTypes = {
    value: PropTypes.number.isRequired
};

export default StarRating;
