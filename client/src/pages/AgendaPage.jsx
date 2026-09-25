import { Link } from "react-router";
import useAuth from "../hooks/useAuth.js";
import useAgenda from "../hooks/useAgenda.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import EventCalendar from "../components/EventCalendar.jsx";
import CalendarLegend from "../components/CalendarLegend.jsx";
import EventDetailModal from "../components/EventDetailModal.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { PATHS, ROLES } from "../lib/constants.js";

const LEADS = {
    [ROLES.entrepreneur]: "Elegí un evento habilitado por la administración y solicitá tu presencia. Cuando la aprueben, vas a aparecer en el mapa.",
    [ROLES.admin]: "Revisá las fechas habilitadas y cuántos emprendedores confirmados tiene cada evento."
};

function AgendaPage() {
    useDocumentTitle("Agenda de ferias");
    const { role } = useAuth();
    const agenda = useAgenda(role);

    const renderCalendar = () => {
        if (agenda.status === "loading" && agenda.events.length === 0) {
            return <LoadingState message="Cargando la agenda..." />;
        }
        if (agenda.status === "error") {
            return <ErrorState message={agenda.error.message} onRetry={agenda.reload} />;
        }
        return (
            <EventCalendar events={agenda.events} role={role} onSelectEvent={agenda.openEvent} onSelectEmptyDate={agenda.showEmptyDate} />
        );
    };

    return (
        <>
            <PageBanner tag="Agenda" title="Ferias y puntos de venta" lead={LEADS[role] ?? "Fechas de ferias con emprendedores confirmados. Tocá un evento para ver quiénes van a estar."}>
                {role === ROLES.admin ? <Link className="btn btn-brand-light" to={PATHS.admin}>Habilitar un evento</Link> : null}
            </PageBanner>
            <div className="container">
                <CalendarLegend role={role} />
                {agenda.emptyDateMessage ? <p className="alert alert-info" role="status">{agenda.emptyDateMessage}</p> : null}
                {renderCalendar()}
            </div>
            <EventDetailModal
                event={agenda.selectedEvent}
                role={role}
                isOpen={agenda.isEventOpen}
                onClose={agenda.closeEvent}
                onRequestPresence={agenda.askForPresence}
            />
        </>
    );
}

export default AgendaPage;
