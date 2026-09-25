import PropTypes from "prop-types";
import StarRating from "./StarRating.jsx";
import { formatDate } from "../lib/formatters.js";

// Reseña de un producto. La puede borrar su autor o el administrador (moderación); el backend lo verifica.
function ReviewItem({ review, canDelete, onDelete }) {
    return (
        <article className="opinion-item card card-body fade-in-up">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div>
                    <h3 className="h6 fw-bold mb-0">{review.author.name}</h3>
                    <p className="text-body-secondary mb-0">
                        <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
                    </p>
                </div>
                <StarRating value={review.stars} />
            </div>
            {review.comment ? <p className="mb-0">{review.comment}</p> : <p className="mb-0 text-body-secondary">Calificó sin dejar comentario.</p>}
            {canDelete ? (
                <div className="mt-2">
                    <button type="button" className="btn btn-link link-danger px-0" onClick={() => onDelete(review)}>
                        Eliminar reseña<span className="visually-hidden"> de {review.author.name}</span>
                    </button>
                </div>
            ) : null}
        </article>
    );
}

ReviewItem.propTypes = {
    review: PropTypes.shape({
        id: PropTypes.string.isRequired,
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    canDelete: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ReviewItem;
