import { useCallback, useEffect, useRef, useState } from "react";
import useEventLocations from "../hooks/useEventLocations.js";
import useConfirmation from "../hooks/useConfirmation.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import EventLocationForm from "./EventLocationForm.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { formatEventSchedule, pluralize } from "../lib/formatters.js";
import { scrollToSection } from "../lib/motion.js";

const describeSessions = (sessions = []) => {
    if (sessions.length === 0) {
        return "Sin jornadas próximas";
    }
    const [nextSession] = sessions;
    return `${pluralize(sessions.length, "jornada próxima", "jornadas próximas")} · la siguiente: ${formatEventSchedule(nextSession.start_time, nextSession.end_time)}`;
};

// Ferias: el administrador las crea y edita con sus jornadas; los emprendedores después cargan sus horarios en ellas
function AdminEventLocations() {
    const { eventLocations, status, error, reload, addLocation, updateLocation, removeLocation } = useEventLocations();
    const removal = useConfirmation((location) => removeLocation(location.id));
    const [editingLocationId, setEditingLocationId] = useState(null);
    const formSectionRef = useRef(null);
    const editingLocation = eventLocations.find((location) => location.id === editingLocationId) ?? null;

    // En pantallas chicas el formulario queda arriba de la lista: se lleva la vista hasta él al elegir una feria
    useEffect(() => {
        if (editingLocationId) {
            scrollToSection(formSectionRef.current);
        }
    }, [editingLocationId]);

    const stopEditing = useCallback(() => setEditingLocationId(null), []);

    const saveEditingLocation = useCallback(async (locationValues) => {
        await updateLocation(editingLocationId, locationValues);
        stopEditing();
    }, [updateLocation, editingLocationId, stopEditing]);

    return (
        <div className="row g-4">
            <div className="col-12 col-lg-5">
                <div ref={formSectionRef} tabIndex={-1} className="scroll-target">
                    {/* La key vuelve a crear el formulario con los datos de la feria elegida */}
                    <EventLocationForm
                        key={editingLocation?.id ?? "new"}
                        location={editingLocation}
                        onSave={editingLocation ? saveEditingLocation : addLocation}
                        onCancel={editingLocation ? stopEditing : null}
                    />
                </div>
            </div>
            <div className="col-12 col-lg-7">
                {status === "loading" && eventLocations.length === 0 ? <LoadingState message="Cargando ferias..." /> : null}
                {status === "error" ? <ErrorState message={error.message} onRetry={reload} /> : null}
                {status === "success" && eventLocations.length === 0 ? (
                    <EmptyState title="Todavía no hay ferias" message="Agregá la primera para que los emprendedores puedan sumarla a su perfil y cargar horarios." />
                ) : null}
                <ul className="list-group">
                    {eventLocations.map((location) => {
                        const isEditing = location.id === editingLocationId;
                        return (
                            <li key={location.id} className={`list-group-item d-flex flex-column flex-sm-row justify-content-between gap-2${isEditing ? " list-group-item-primary" : ""}`}>
                                <div>
                                    <p className="fw-bold mb-0">{location.name}</p>
                                    {location.description ? <p className="mb-0 text-body-secondary">{location.description}</p> : null}
                                    <p className="mb-0 small">{describeSessions(location.sessions)}</p>
                                </div>
                                <div className="d-flex gap-2 align-self-sm-center">
                                    <button type="button" className="btn btn-outline-primary" aria-pressed={isEditing} onClick={() => setEditingLocationId(location.id)}>
                                        Editar<span className="visually-hidden"> {location.name}</span>
                                    </button>
                                    <button type="button" className="btn btn-outline-danger" onClick={() => removal.open(location)}>
                                        Eliminar<span className="visually-hidden"> {location.name}</span>
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <ConfirmDialog
                id="delete-location"
                title="Eliminar feria"
                message={`Se eliminan también las jornadas y los horarios cargados en "${removal.target?.name ?? ""}". Si algún emprendedor sin local se quedara sin ninguna feria, el servidor no permite eliminarla.`}
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
