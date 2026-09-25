import PropTypes from "prop-types";
import { Link } from "react-router";
import BootstrapModal from "./BootstrapModal.jsx";
import PresenceRequestStatus from "./PresenceRequestStatus.jsx";
import { PATHS, ROLES } from "../lib/constants.js";
import { formatEventSchedule } from "../lib/formatters.js";

function EventDetailModal({ event = null, role = null, isOpen, onClose, onRequestPresence }) {
    return (
        <BootstrapModal id="event-detail" title={event?.title ?? "Evento"} isOpen={isOpen} onClose={onClose}>
            {event ? (
                <div className="d-flex flex-column gap-3">
                    <div>
                        <p className="fw-semibold mb-1">{formatEventSchedule(event.starts_at, event.ends_at)}</p>
                        <p className="mb-0">{event.location.name}</p>
                        {event.description ? <p className="mb-0 mt-2">{event.description}</p> : null}
                    </div>
                    <div>
                        <h3 className="h6 fw-bold">Emprendedores confirmados</h3>
                        {event.participants.length > 0 ? (
                            <ul className="mb-0">
                                {event.participants.map((participant) => (
                                    <li key={participant.id}>
                                        <Link to={PATHS.entrepreneur(participant.id)} data-bs-dismiss="modal">{participant.brand_name}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mb-0">Todavía no hay emprendedores confirmados.</p>
                        )}
                    </div>
                    {role === ROLES.entrepreneur ? (
                        <PresenceRequestStatus key={event.id} event={event} onRequestPresence={onRequestPresence} />
                    ) : null}
                    {role === ROLES.admin && event.requests_summary ? (
                        <p className="mb-0">
                            Solicitudes: {event.requests_summary.pending} pendientes, {event.requests_summary.approved} aprobadas y {event.requests_summary.rejected} rechazadas.{" "}
                            <Link to={PATHS.admin} data-bs-dismiss="modal">Revisarlas en Administración</Link>
                        </p>
                    ) : null}
                </div>
            ) : null}
        </BootstrapModal>
    );
}

EventDetailModal.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        starts_at: PropTypes.string.isRequired,
        ends_at: PropTypes.string.isRequired,
        location: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
        participants: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            brand_name: PropTypes.string.isRequired
        })).isRequired,
        requests_summary: PropTypes.shape({
            pending: PropTypes.number,
            approved: PropTypes.number,
            rejected: PropTypes.number
        })
    }),
    role: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRequestPresence: PropTypes.func.isRequired
};

export default EventDetailModal;
