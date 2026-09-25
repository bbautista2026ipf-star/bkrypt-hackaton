import { useEntrepreneurRequestQueue } from "../hooks/useAdminQueues.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import FormAlert from "./FormAlert.jsx";
import ReasonDialog from "./ReasonDialog.jsx";
import { formatDate } from "../lib/formatters.js";

// Solicitudes para pasar a rol emprendedor. Aprobar crea el perfil y cambia el rol; exige correo verificado.
function AdminEntrepreneurRequests() {
    const queue = useEntrepreneurRequestQueue();

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
                <EmptyState title="No hay solicitudes pendientes" message="Cuando alguien pida ser emprendedor, la solicitud aparece acá." />
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    {queue.items.map((request) => {
                        const isVerified = request.applicant.is_email_verified;
                        const isProcessing = queue.processingId === request.id;
                        return (
                            <li key={request.id} className="card card-body">
                                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                                    <div>
                                        <h3 className="h5 mb-1">{request.brand_name}</h3>
                                        <p className="mb-1">{request.applicant.name} · {request.applicant.email}</p>
                                        <p className="mb-1">
                                            {isVerified
                                                ? <span className="badge badge-brand-teal">Correo verificado</span>
                                                : <span className="badge badge-brand-yellow">Correo sin verificar: todavía no se puede aprobar</span>}
                                        </p>
                                        {request.biography ? <p className="mb-1">{request.biography}</p> : null}
                                        <p className="mb-1 text-body-secondary">
                                            Contacto: {[request.whatsapp_number, request.contact_email].filter(Boolean).join(" · ")}
                                        </p>
                                        <p className="mb-1 text-body-secondary">
                                            {request.has_store ? `Local: ${request.store_address}` : "Sin local"}
                                            {request.fairs.length > 0 ? ` · Ferias: ${request.fairs.map((fair) => fair.name).join(", ")}` : ""}
                                        </p>
                                        <p className="mb-0 text-body-secondary">Enviada el {formatDate(request.createdAt)}</p>
                                    </div>
                                    <div className="d-flex flex-row flex-lg-column gap-2 flex-shrink-0">
                                        <button type="button" className="btn btn-primary" onClick={() => queue.approve(request.id)} disabled={!isVerified || isProcessing}>
                                            Aprobar<span className="visually-hidden"> a {request.brand_name}</span>
                                        </button>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => queue.openReject(request)} disabled={isProcessing}>
                                            Rechazar<span className="visually-hidden"> a {request.brand_name}</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            <ReasonDialog
                id="reject-entrepreneur-request"
                title="Rechazar solicitud"
                description="La cuenta sigue como consumidor. Si indicás un motivo, se lo enviamos por correo."
                label="Motivo del rechazo"
                confirmLabel="Rechazar solicitud"
                isRequired={false}
                maxLength={500}
                isOpen={Boolean(queue.rejectTarget)}
                onConfirm={queue.confirmReject}
                onClose={queue.closeReject}
            />
        </>
    );
}

export default AdminEntrepreneurRequests;
