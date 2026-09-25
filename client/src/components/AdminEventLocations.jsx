import useEventLocations from "../hooks/useEventLocations.js";
import useConfirmation from "../hooks/useConfirmation.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import EventLocationForm from "./EventLocationForm.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Ubicaciones de ferias: son los lugares donde después se habilitan fechas de eventos
function AdminEventLocations() {
    const { eventLocations, status, error, reload, addLocation, removeLocation } = useEventLocations();
    const removal = useConfirmation((location) => removeLocation(location.id));

    return (
        <div className="row g-4">
            <div className="col-12 col-lg-5">
                <EventLocationForm onAddLocation={addLocation} />
            </div>
            <div className="col-12 col-lg-7">
                {status === "loading" && eventLocations.length === 0 ? <LoadingState message="Cargando ubicaciones..." /> : null}
                {status === "error" ? <ErrorState message={error.message} onRetry={reload} /> : null}
                {status === "success" && eventLocations.length === 0 ? (
                    <EmptyState title="Todavía no hay ubicaciones" message="Agregá la primera para que los emprendedores puedan sumarla a su perfil y cargar horarios." />
                ) : null}
                <ul className="list-group">
                    {eventLocations.map((location) => (
                        <li key={location.id} className="list-group-item d-flex flex-column flex-sm-row justify-content-between gap-2">
                            <div>
                                <p className="fw-bold mb-0">{location.name}</p>
                                {location.description ? <p className="mb-0 text-body-secondary">{location.description}</p> : null}
                            </div>
                            <button type="button" className="btn btn-outline-danger align-self-sm-center" onClick={() => removal.open(location)}>
                                Eliminar<span className="visually-hidden"> {location.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <ConfirmDialog
                id="delete-location"
                title="Eliminar ubicación"
                message={`Se eliminan también los horarios cargados en "${removal.target?.name ?? ""}". Si algún emprendedor sin local se quedara sin ninguna feria, el servidor no permite eliminarla.`}
                confirmLabel="Eliminar"
                isOpen={removal.isOpen}
                isProcessing={removal.isRunning}
                error={removal.error}
                onConfirm={removal.confirm}
                onClose={removal.close}
            />
        </div>
    );
}

export default AdminEventLocations;
