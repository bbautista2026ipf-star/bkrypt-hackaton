import PropTypes from "prop-types";
import StarRating from "./StarRating.jsx";
import { formatRating, pluralize } from "../lib/formatters.js";

// Promedio de calificaciones con su cantidad; sin reseñas lo dice en texto en lugar de mostrar estrellas vacías
function RatingSummary({ averageRating = null, reviewsCount }) {
    if (!reviewsCount) {
        return <p className="text-body-secondary mb-0">Todavía sin calificaciones</p>;
    }
    return (
        <p className="d-flex flex-wrap align-items-center gap-2 mb-0">
            <StarRating value={averageRating} />
            <span>{formatRating(averageRating)} · {pluralize(reviewsCount, "reseña", "reseñas")}</span>
        </p>
    );
}

RatingSummary.propTypes = {
    averageRating: PropTypes.number,
    reviewsCount: PropTypes.number.isRequired
};

export default RatingSummary;
