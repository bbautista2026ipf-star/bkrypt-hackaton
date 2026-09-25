import { useReportedOpinionQueue } from "../hooks/useAdminQueues.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import FormAlert from "./FormAlert.jsx";
import StarRating from "./StarRating.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Opiniones que los emprendedores reportaron desde su muro: el administrador decide si quedan publicadas o se eliminan
function AdminReportedOpinions() {
    const queue = useReportedOpinionQueue();

    if (queue.status === "loading" && queue.items.length === 0) {
        return <LoadingState message="Cargando opiniones reportadas..." />;
    }
    if (queue.status === "error") {
        return <ErrorState message={queue.error.message} onRetry={queue.reload} />;
    }

    return (
        <>
            <FormAlert message={queue.actionError} />
            {queue.items.length === 0 ? (
                <EmptyState title="No hay opiniones reportadas" message="Cuando un emprendedor reporte una opinión de su muro, la vas a ver acá." />
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                    {queue.items.map((opinion) => {
                        const isProcessing = queue.processingId === opinion.id;
                        return (
                            <li key={opinion.id} className="card card-body">
                                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                                    <div>
                                        <h3 className="h5 mb-1">Opinión sobre {opinion.entrepreneur.brand_name}</h3>
                                        <p className="mb-1">De {opinion.author.name} ({opinion.author.email})</p>
                                        <StarRating value={opinion.stars} />
                                        <p className="my-2">{opinion.comment}</p>
                                        <p className="mb-0"><span className="fw-semibold">Motivo del reporte:</span> {opinion.report_reason}</p>
                                    </div>
                                    <div className="d-flex flex-row flex-lg-column gap-2 flex-shrink-0">
                                        <button type="button" className="btn btn-outline-primary" onClick={() => queue.keepOpinion(opinion.id)} disabled={isProcessing}>
                                            Mantener publicada
                                        </button>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => queue.removal.open(opinion)} disabled={isProcessing}>
                                            Eliminar opinión
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            <ConfirmDialog
                id="delete-opinion"
                title="Eliminar opinión"
                message="La opinión se borra del muro del emprendedor y no se puede recuperar."
                confirmLabel="Eliminar"
                isOpen={queue.removal.isOpen}
                isProcessing={queue.removal.isRunning}
                error={queue.removal.error}
                onConfirm={queue.removal.confirm}
                onClose={queue.removal.close}
            />
        </>
    );
}

export default AdminReportedOpinions;
