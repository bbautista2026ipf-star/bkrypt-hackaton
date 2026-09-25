import PropTypes from "prop-types";
import { formatEventSchedule } from "../lib/formatters.js";

const findNextSchedule = (fair, entrepreneurId) => fair.schedules.find((schedule) => schedule.entrepreneur.id === entrepreneurId);

// Sección inferior del mapa: emprendedores con horarios en la feria elegida. Recibe el scroll al tocar un marcador.
function FairEntrepreneurs({ fair, sectionRef, onSelectEntrepreneur }) {
    return (
        <section ref={sectionRef} tabIndex={-1} className="scroll-target mt-5" aria-labelledby="fair-entrepreneurs-title">
            <h2 id="fair-entrepreneurs-title" className="h3 section-title mb-4">Emprendedores en {fair.title}</h2>
            {fair.participants.length === 0 ? (
                <p className="text-body-secondary">Todavía no hay emprendedores confirmados en esta feria.</p>
            ) : null}
            <ul className="row g-3 list-unstyled mb-0">
                {fair.participants.map((participant) => {
                    const nextSchedule = findNextSchedule(fair, participant.id);
                    return (
                        <li className="col-12 col-md-6 col-lg-4" key={participant.id}>
                            <div className="card h-100 card-lift fade-in-up">
                                <div className="card-body d-flex flex-column gap-2">
                                    <h3 className="h5 mb-0">{participant.brand_name}</h3>
                                    {nextSchedule ? <p className="mb-0">{formatEventSchedule(nextSchedule.start_time, nextSchedule.end_time)}</p> : null}
                                    <button type="button" className="btn btn-primary mt-auto" onClick={() => onSelectEntrepreneur(participant.id)}>
                                        Ver su catálogo<span className="visually-hidden"> de {participant.brand_name}</span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

FairEntrepreneurs.propTypes = {
    fair: PropTypes.shape({
        title: PropTypes.string.isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            brand_name: PropTypes.string.isRequired
        })).isRequired,
        schedules: PropTypes.arrayOf(PropTypes.shape({
            start_time: PropTypes.string.isRequired,
            end_time: PropTypes.string.isRequired,
            entrepreneur: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired
        })).isRequired
    }).isRequired,
    sectionRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    onSelectEntrepreneur: PropTypes.func.isRequired
};

export default FairEntrepreneurs;
