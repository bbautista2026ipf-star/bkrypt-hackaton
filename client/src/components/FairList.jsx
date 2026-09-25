import PropTypes from "prop-types";
import { formatDateTime, pluralize } from "../lib/formatters.js";

// Alternativa accesible al mapa: las mismas ferias como botones navegables con teclado
function FairList({ fairs, selectedFairId = null, onSelectFair }) {
    return (
        <div className="list-group">
            {fairs.map((fair) => {
                const isSelected = fair.id === selectedFairId;
                return (
                    <button
                        key={fair.id}
                        type="button"
                        className={`list-group-item list-group-item-action event-list-item${isSelected ? " is-selected" : ""}`}
                        aria-current={isSelected ? "true" : undefined}
                        onClick={() => onSelectFair(fair.id)}
                    >
                        <span className="d-flex flex-wrap align-items-center gap-2">
                            <span className="fw-bold">{fair.title}</span>
                            {fair.is_active_now ? <span className="badge badge-brand-yellow">En curso</span> : null}
                        </span>
                        <span className="d-block">Próxima jornada: {formatDateTime(fair.starts_at)} h</span>
                        <span className="d-block text-body-secondary">{pluralize(fair.participants_count, "emprendedor", "emprendedores")}</span>
                    </button>
                );
            })}
        </div>
    );
}

FairList.propTypes = {
    fairs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired,
        is_active_now: PropTypes.bool.isRequired,
        participants_count: PropTypes.number.isRequired
    })).isRequired,
    selectedFairId: PropTypes.string,
    onSelectFair: PropTypes.func.isRequired
};

export default FairList;
