import useCalendarEvents from "../hooks/useCalendarEvents.js";
import useEventLocations from "../hooks/useEventLocations.js";
import useConfirmation from "../hooks/useConfirmation.js";
import LoadingState from "./LoadingState.jsx";
import ErrorState from "./ErrorState.jsx";
import EmptyState from "./EmptyState.jsx";
import EventForm from "./EventForm.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { isEventFinished } from "../lib/calendarEvents.js";
import { formatEventSchedule, pluralize } from "../lib/formatters.js";

function AdminEvents() {
    const { events, status, error, reload, removeEvent } = useCalendarEvents();
    const { eventLocations } = useEventLocations();
    const removal = useConfirmation((event) => removeEvent(event.id));
    const upcomingEvents = events.filter((event) => !isEventFinished(event));

    return (
        <div className="row g-4">
            <div className="col-12 col-lg-5">
                <EventForm eventLocations={eventLocations} onEventCreated={reload} />
            </div>
            <div className="col-12 col-lg-7">
                <h3 className="h5">Próximos eventos</h3>
                {status === "loading" && events.length === 0 ? <LoadingState message="Cargando eventos..." /> : null}
                {status === "error" ? <ErrorState message={error.message} onRetry={reload} /> : null}
                {status === "success" && upcomingEvents.length === 0 ? (
                    <EmptyState title="No hay eventos próximos" message="Habilitá una fecha para que los emprendedores puedan solicitar su presencia." />
                ) : null}
                <ul className="list-group">
                    {upcomingEvents.map((event) => (
                        <li key={event.id} className="list-group-item d-flex flex-column flex-sm-row justify-content-between gap-2">
                            <div>
                                <p className="fw-bold mb-0">{event.title}</p>
                                <p className="mb-0">{formatEventSchedule(event.starts_at, event.ends_at)} · {event.location.name}</p>
                                <p className="mb-0 text-body-secondary">
                                    {pluralize(event.participants_count, "confirmado", "confirmados")} · {pluralize(event.requests_summary.pending, "solicitud pendiente", "solicitudes pendientes")}
                                </p>
                            </div>
                            <button type="button" className="btn btn-outline-danger align-self-sm-center" onClick={() => removal.open(event)}>
                                Eliminar<span className="visually-hidden"> {event.title}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <ConfirmDialog
                id="delete-event"
                title="Eliminar evento"
                message={`Se elimina "${removal.target?.title ?? ""}" junto con todas sus solicitudes de presencia.`}
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

export default AdminEvents;
