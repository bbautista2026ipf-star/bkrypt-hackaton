import { Link } from "react-router";
import useAgenda from "../hooks/useAgenda.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import EventCalendar from "../components/EventCalendar.jsx";
import CalendarLegend from "../components/CalendarLegend.jsx";
import FairDayModal from "../components/FairDayModal.jsx";
import BootstrapModal from "../components/BootstrapModal.jsx";
import ScheduleForm from "../components/ScheduleForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { PATHS, ROLES } from "../lib/constants.js";
import { EMPTY_SCHEDULE } from "../lib/scheduleForm.js";
import { formatTimeRange } from "../lib/formatters.js";

const ENTREPRENEUR_LEAD = "Cargá los días y horarios en los que vas a estar en tus ferias: aparecen en esta agenda y en el mapa.";
const PUBLIC_LEAD = "Qué emprendedores van a estar en cada feria y en qué horario. Tocá una jornada para ver el detalle.";

function AgendaPage() {
    useDocumentTitle("Agenda de ferias");
    const agenda = useAgenda();
    const isEditingSchedule = Boolean(agenda.scheduleEditor.scheduleId);

    const renderCalendar = () => {
        if (agenda.status === "loading" && agenda.fairDays.length === 0) {
            return <LoadingState message="Cargando la agenda..." />;
        }
        if (agenda.status === "error") {
            return <ErrorState message={agenda.error.message} onRetry={agenda.reload} />;
        }
        return (
            <EventCalendar
                fairDays={agenda.fairDays}
                ownProfileId={agenda.ownProfileId}
                onSelectFairDay={agenda.openFairDay}
                onSelectEmptyDate={agenda.selectEmptyDate}
            />
        );
    };

    return (
        <>
            <PageBanner tag="Agenda" title="Ferias y puntos de venta" lead={agenda.canManageSchedules ? ENTREPRENEUR_LEAD : PUBLIC_LEAD}>
                {agenda.canManageSchedules && agenda.ownFairs.length > 0 ? (
                    <button type="button" className="btn btn-brand-light" onClick={() => agenda.openNewSchedule(EMPTY_SCHEDULE)}>Cargar un horario</button>
                ) : null}
                {agenda.role === ROLES.admin ? <Link className="btn btn-brand-light" to={PATHS.admin}>Gestionar ferias</Link> : null}
            </PageBanner>
            <div className="container">
                {agenda.canManageSchedules && agenda.ownFairs.length === 0 ? (
                    <p className="alert alert-warning">
                        Para cargar horarios, primero <Link to={PATHS.profile}>agregá desde tu perfil</Link> al menos una feria a la que asistís.
                    </p>
                ) : null}
                <CalendarLegend showOwnPresence={agenda.canManageSchedules} />
                {agenda.emptyDateMessage ? <p className="alert alert-info" role="status">{agenda.emptyDateMessage}</p> : null}
                {renderCalendar()}
            </div>

            <FairDayModal
                fairDay={agenda.selectedFairDay}
                ownProfileId={agenda.ownProfileId}
                isOpen={agenda.isFairDayOpen}
                onClose={agenda.closeFairDay}
                onEditSchedule={agenda.openScheduleEdit}
                onDeleteSchedule={agenda.askScheduleRemoval}
            />
            <BootstrapModal
                id="schedule-editor"
                title={isEditingSchedule ? "Editar horario" : "Cargar horario"}
                isOpen={agenda.scheduleEditor.isOpen}
                onClose={agenda.closeScheduleEditor}
            >
                <ScheduleForm
                    key={agenda.scheduleEditor.version}
                    initialValues={agenda.scheduleEditor.initialValues}
                    ownFairs={agenda.ownFairs}
                    isEditing={isEditingSchedule}
                    onSave={agenda.saveSchedule}
                />
            </BootstrapModal>
            <ConfirmDialog
                id="delete-schedule"
                title="Eliminar horario"
                message={agenda.scheduleRemoval.target
                    ? `Vas a dejar de figurar en ${agenda.scheduleRemoval.target.location.name} (${formatTimeRange(agenda.scheduleRemoval.target.start_time, agenda.scheduleRemoval.target.end_time)}).`
                    : ""}
                confirmLabel="Eliminar horario"
                isOpen={agenda.scheduleRemoval.isOpen}
                isProcessing={agenda.scheduleRemoval.isRunning}
                error={agenda.scheduleRemoval.error}
                onConfirm={agenda.scheduleRemoval.confirm}
                onClose={agenda.scheduleRemoval.close}
            />
        </>
    );
}

export default AgendaPage;
