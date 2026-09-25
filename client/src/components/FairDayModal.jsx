import PropTypes from "prop-types";
import { Link } from "react-router";
import BootstrapModal from "./BootstrapModal.jsx";
import { PATHS } from "../lib/constants.js";
import { formatDate, formatTimeRange } from "../lib/formatters.js";

// Detalle de una jornada de feria: horario oficial, quiénes van a estar y en qué horario.
// El emprendedor puede editar o borrar sus horarios y, si la feria está en su perfil, sumarse a la jornada.
function FairDayModal({ fairDay = null, ownProfileId = null, isOpen, onClose, onEditSchedule, onDeleteSchedule, onAddSchedule = null }) {
    return (
        <BootstrapModal id="fair-day-detail" title={fairDay?.title ?? "Feria"} isOpen={isOpen} onClose={onClose}>
            {fairDay ? (
                <div className="d-flex flex-column gap-3">
                    <p className="fw-semibold mb-0">{formatDate(fairDay.starts_at)}</p>
                    {fairDay.sessions.length > 0 ? (
                        <div>
                            <h3 className="h6 mb-1">Horario de la feria</h3>
                            <ul className="list-unstyled mb-0">
                                {fairDay.sessions.map((session) => (
                                    <li key={session.id}>{formatTimeRange(session.start_time, session.end_time)}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    <div>
                        <h3 className="h6 mb-2">Emprendedores</h3>
                        {fairDay.schedules.length === 0 ? (
                            <p className="mb-0 text-body-secondary">Todavía no hay emprendedores confirmados en esta jornada.</p>
                        ) : (
                            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                                {fairDay.schedules.map((schedule) => {
                                    const isOwn = schedule.entrepreneur.id === ownProfileId;
                                    return (
                                        <li key={schedule.id} className="d-flex flex-column flex-sm-row justify-content-between gap-2 border-bottom pb-2">
                                            <div>
                                                <Link to={PATHS.entrepreneur(schedule.entrepreneur.id)} onClick={onClose}>{schedule.entrepreneur.brand_name}</Link>
                                                <p className="mb-0 text-body-secondary">{formatTimeRange(schedule.start_time, schedule.end_time)}</p>
                                            </div>
                                            {isOwn ? (
                                                <div className="d-flex gap-2 align-self-sm-center">
                                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onEditSchedule(schedule)}>Editar</button>
                                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDeleteSchedule(schedule)}>Eliminar</button>
                                                </div>
                                            ) : null}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    {onAddSchedule ? (
                        <button type="button" className="btn btn-primary align-self-start" onClick={onAddSchedule}>Cargar mi horario en esta jornada</button>
                    ) : null}
                </div>
            ) : null}
        </BootstrapModal>
    );
}

FairDayModal.propTypes = {
    fairDay: PropTypes.shape({
        title: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired,
        sessions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            start_time: PropTypes.string.isRequired,
            end_time: PropTypes.string.isRequired
        })).isRequired,
        schedules: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            start_time: PropTypes.string.isRequired,
            end_time: PropTypes.string.isRequired,
            entrepreneur: PropTypes.shape({
                id: PropTypes.string.isRequired,
                brand_name: PropTypes.string.isRequired
            }).isRequired
        })).isRequired
    }),
    ownProfileId: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onEditSchedule: PropTypes.func.isRequired,
    onDeleteSchedule: PropTypes.func.isRequired,
    onAddSchedule: PropTypes.func
};

export default FairDayModal;
