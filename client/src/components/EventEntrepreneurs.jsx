import PropTypes from "prop-types";
import { formatEventSchedule } from "../lib/formatters.js";

// Sección inferior del mapa: emprendedores confirmados del evento elegido. Recibe el scroll al tocar un marcador.
function EventEntrepreneurs({ event, sectionRef, onSelectEntrepreneur }) {
    return (
        <section ref={sectionRef} tabIndex={-1} className="scroll-target mt-5" aria-labelledby="event-entrepreneurs-title">
            <h2 id="event-entrepreneurs-title" className="h3 section-title mb-2">Emprendedores en {event.title}</h2>
            <p className="mb-4">
                {formatEventSchedule(event.starts_at, event.ends_at)} · {event.location.name}
            </p>
            <ul className="row g-3 list-unstyled mb-0">
                {event.participants.map((participant) => (
                    <li className="col-12 col-md-6 col-lg-4" key={participant.id}>
                        <div className="card h-100 card-lift fade-in-up">
                            <div className="card-body d-flex flex-column gap-3">
                                <h3 className="h5 mb-0">{participant.brand_name}</h3>
                                <button type="button" className="btn btn-primary mt-auto" onClick={() => onSelectEntrepreneur(participant.id)}>
                                    Ver su catálogo<span className="visually-hidden"> de {participant.brand_name}</span>
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

EventEntrepreneurs.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired,
        ends_at: PropTypes.string.isRequired,
        location: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            brand_name: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    sectionRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    onSelectEntrepreneur: PropTypes.func.isRequired
};

export default EventEntrepreneurs;
