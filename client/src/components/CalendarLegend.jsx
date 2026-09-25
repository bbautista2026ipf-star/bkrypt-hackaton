import PropTypes from "prop-types";
import { ROLES } from "../lib/constants.js";

const LEGENDS = {
    [ROLES.entrepreneur]: [
        { swatch: "is-available", label: "Evento habilitado: podés solicitar tu presencia" },
        { swatch: "is-pending", label: "Tu solicitud está pendiente de revisión" },
        { swatch: "is-confirmed", label: "Tu presencia está confirmada" }
    ],
    [ROLES.admin]: [
        { swatch: "is-available", label: "Evento sin emprendedores confirmados (no visible al público)" },
        { swatch: "is-confirmed", label: "Evento con emprendedores confirmados" }
    ]
};

function CalendarLegend({ role = null }) {
    const items = LEGENDS[role] ?? [{ swatch: "is-confirmed", label: "Feria con emprendedores confirmados" }];
    return (
        <ul className="list-unstyled d-flex flex-column flex-md-row flex-wrap gap-2 gap-md-4 mb-3">
            {items.map((item) => (
                <li key={item.swatch} className="d-flex align-items-center gap-2">
                    <span className={`calendar-legend-swatch ${item.swatch}`} aria-hidden="true"></span>
                    {item.label}
                </li>
            ))}
        </ul>
    );
}

CalendarLegend.propTypes = {
    role: PropTypes.string
};

export default CalendarLegend;
