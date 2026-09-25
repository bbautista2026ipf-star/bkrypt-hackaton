import PropTypes from "prop-types";
import StarRating from "./StarRating.jsx";
import { formatDate } from "../lib/formatters.js";

// Opinión del muro. El dueño del perfil no puede borrarla: solo reportarla ante la administración.
function OpinionItem({ opinion, canReport, onReport }) {
    return (
        <article className="opinion-item card card-body fade-in-up">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div>
                    <h3 className="h6 fw-bold mb-0">{opinion.author.name}</h3>
                    <p className="text-body-secondary mb-0">
                        <time dateTime={opinion.createdAt}>{formatDate(opinion.createdAt)}</time>
                    </p>
                </div>
                <StarRating value={opinion.stars} />
            </div>
            <p className="mb-0">{opinion.comment}</p>
            {canReport ? (
                <div className="mt-3">
                    {opinion.is_reported ? (
                        <span className="badge badge-brand-yellow">Reportada: en revisión</span>
                    ) : (
                        <button type="button" className="btn btn-link px-0" onClick={() => onReport(opinion)}>
                            Reportar a la administración<span className="visually-hidden"> la opinión de {opinion.author.name}</span>
                        </button>
                    )}
                </div>
            ) : null}
        </article>
    );
}

OpinionItem.propTypes = {
    opinion: PropTypes.shape({
        id: PropTypes.string.isRequired,
        stars: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        is_reported: PropTypes.bool,
        author: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired
    }).isRequired,
    canReport: PropTypes.bool.isRequired,
    onReport: PropTypes.func.isRequired
};

export default OpinionItem;
