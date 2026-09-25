import PropTypes from "prop-types";
import FormAlert from "./FormAlert.jsx";
import useAsyncAction from "../hooks/useAsyncAction.js";
import { isEventFinished } from "../lib/calendarEvents.js";

const STATUS_MESSAGES = {
    pending: { variant: "warning", text: "Tu solicitud está pendiente: la administración todavía no la revisó." },
    approved: { variant: "success", text: "Tu presencia está confirmada: el evento ya te muestra en el mapa y en la agenda." },
    rejected: { variant: "secondary", text: "La administración no aprobó tu presencia en este evento." }
};

// Estado de la solicitud propia del emprendedor y, si todavía no pidió, el botón para solicitar presencia
function PresenceRequestStatus({ event, onRequestPresence }) {
    const request = useAsyncAction(onRequestPresence);
    const ownStatus = event.my_request?.status;

    if (ownStatus) {
        const message = STATUS_MESSAGES[ownStatus];
        return <p className={`alert alert-${message.variant} mb-0`} role="status">{message.text}</p>;
    }
    if (isEventFinished(event)) {
        return <p className="alert alert-secondary mb-0">Este evento ya terminó: solo podés solicitar presencia en eventos próximos.</p>;
    }
    return (
        <div>
            <FormAlert message={request.error} />
            <button type="button" className="btn btn-primary w-100" onClick={() => request.run(event.id)} disabled={request.isRunning}>
                {request.isRunning ? "Enviando solicitud..." : "Solicitar mi presencia"}
            </button>
        </div>
    );
}

PresenceRequestStatus.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.string.isRequired,
        ends_at: PropTypes.string.isRequired,
        my_request: PropTypes.shape({ status: PropTypes.string.isRequired })
    }).isRequired,
    onRequestPresence: PropTypes.func.isRequired
};

export default PresenceRequestStatus;
