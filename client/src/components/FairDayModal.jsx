import PropTypes from "prop-types";
import { Link } from "react-router";
import BootstrapModal from "./BootstrapModal.jsx";
import { PATHS } from "../lib/constants.js";
import { formatDate, formatTimeRange } from "../lib/formatters.js";

// Detalle de una jornada de feria: quiénes van a estar y en qué horario. El emprendedor puede editar o borrar sus horarios.
function FairDayModal({ fairDay = null, ownProfileId = null, isOpen, onClose, onEditSchedule, onDeleteSchedule }) {
    return (
        <BootstrapModal id="fair-day-detail" title={fairDay?.title ?? "Feria"} isOpen={isOpen} onClose={onClose}>
            {fairDay ? (
                <div className="d-flex flex-column gap-3">
                    <p className="fw-semibold mb-0">{formatDate(fairDay.starts_at)}</p>
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
                </div>
            ) : null}
        </BootstrapModal>
    );
}

FairDayModal.propTypes = {
    fairDay: PropTypes.shape({
        title: PropTypes.string.isRequired,
        starts_at: PropTypes.string.isRequired,
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
    onDeleteSchedule: PropTypes.func.isRequired
};

export default FairDayModal;
