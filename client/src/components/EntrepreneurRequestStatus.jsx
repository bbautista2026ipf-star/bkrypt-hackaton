import PropTypes from "prop-types";
import { formatDate } from "../lib/formatters.js";

// Estado de la última solicitud para ser emprendedor, visible para el consumidor en su perfil
function EntrepreneurRequestStatus({ request }) {
    if (request.status === "pending") {
        return (
            <div className="alert alert-info" role="status">
                Tu solicitud para "{request.brand_name}" está en revisión desde el {formatDate(request.createdAt)}. Mientras tanto usás la plataforma como consumidor.
            </div>
        );
    }
    if (request.status === "rejected") {
        return (
            <div className="alert alert-warning" role="status">
                <p className="mb-1">La administración no aprobó tu solicitud para "{request.brand_name}".</p>
                <p className="mb-0">{request.rejection_reason ? `Motivo: ${request.rejection_reason}` : "No se indicó un motivo."} Podés corregir los datos y enviarla de nuevo.</p>
            </div>
        );
    }
    return null;
}

EntrepreneurRequestStatus.propTypes = {
    request: PropTypes.shape({
        status: PropTypes.string.isRequired,
        brand_name: PropTypes.string.isRequired,
        rejection_reason: PropTypes.string,
        createdAt: PropTypes.string.isRequired
    }).isRequired
};

export default EntrepreneurRequestStatus;
