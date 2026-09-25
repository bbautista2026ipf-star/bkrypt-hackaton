import PropTypes from "prop-types";

function CalendarLegend({ showOwnPresence = false }) {
    return (
        <ul className="list-unstyled d-flex flex-column flex-md-row flex-wrap gap-2 gap-md-4 mb-3">
            <li className="d-flex align-items-center gap-2">
                <span className="calendar-legend-swatch is-confirmed" aria-hidden="true"></span>
                Jornada de feria con emprendedores
            </li>
            {showOwnPresence ? (
                <li className="d-flex align-items-center gap-2">
                    <span className="calendar-legend-swatch is-pending" aria-hidden="true"></span>
                    Jornadas en las que vas a estar
                </li>
            ) : null}
        </ul>
    );
}

CalendarLegend.propTypes = {
    showOwnPresence: PropTypes.bool
};

export default CalendarLegend;
