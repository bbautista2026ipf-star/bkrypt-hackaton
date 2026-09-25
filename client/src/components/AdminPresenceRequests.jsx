import { usePresenceRequestQueue } from "../hooks/useAdminQueues.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import FormAlert from "./FormAlert.jsx";
import { formatEventSchedule } from "../lib/formatters.js";

// Solicitudes de presencia en eventos: al aprobarlas, el emprendedor aparece confirmado en el mapa y la agenda
function AdminPresenceRequests() {
    const queue = usePresenceRequestQueue();

    if (queue.status === "loading" && queue.items.length === 0) {
        return <LoadingState message="Cargando solicitudes..." />;
    }
    if (queue.status === "error") {
        return <ErrorState message={queue.error.message} onRetry={queue.reload} />;
    }

    return (
        <>
            <FormAlert message={queue.actionError} />
            {queue.items.length === 0 ? (
                <EmptyState title="No hay solicitudes de presencia pendientes" message="Cuando un emprendedor pida estar en un evento, aparece acá." />
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    {queue.items.map((request) => {
                        const isProcessing = queue.processingId === request.id;
                        return (
                            <li key={request.id} className="card card-body">
                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                    <div>
                                        <h3 className="h5 mb-1">{request.entrepreneur.brand_name}</h3>
                                        <p className="mb-1">{request.event.title} · {request.event.location.name}</p>
                                        <p className="mb-0 text-body-secondary">{formatEventSchedule(request.event.starts_at, request.event.ends_at)}</p>
                                    </div>
                                    <div className="d-flex gap-2 flex-shrink-0 align-items-start">
                                        <button type="button" className="btn btn-primary" onClick={() => queue.approve(request.id)} disabled={isProcessing}>
                                            Confirmar<span className="visually-hidden"> a {request.entrepreneur.brand_name}</span>
                                        </button>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => queue.reject(request.id)} disabled={isProcessing}>
                                            Rechazar<span className="visually-hidden"> a {request.entrepreneur.brand_name}</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}

export default AdminPresenceRequests;
