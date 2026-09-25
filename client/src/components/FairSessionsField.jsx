import PropTypes from "prop-types";
import FormField from "./FormField.jsx";
import { findSessionError } from "../lib/eventLocationForm.js";

// Jornadas oficiales de la feria (día y horario de apertura): aparecen en la agenda y en el mapa
function FairSessionsField({ sessions, error = null, onAdd, onChange, onRemove }) {
    const invalidIndex = error ? findSessionError(sessions)?.index : undefined;
    const errorId = error ? "location-sessions-error" : undefined;

    return (
        <fieldset className="mb-3" aria-describedby={["location-sessions-help", errorId].filter(Boolean).join(" ")}>
            <legend className="form-label fw-semibold fs-6 mb-1">Jornadas de la feria</legend>
            <p id="location-sessions-help" className="form-text mt-0">
                Días y horarios en los que abre la feria. Se muestran en la agenda y en el mapa aunque todavía no haya emprendedores confirmados.
            </p>
            {sessions.length === 0 ? <p className="text-body-secondary small">Todavía no cargaste jornadas.</p> : null}
            <ul className="list-unstyled d-flex flex-column gap-2 mb-2">
                {sessions.map((session, index) => {
                    const isInvalid = index === invalidIndex;
                    // La jornada con error se marca en sus tres campos; el mensaje va debajo de la lista
                    const invalidProps = { "aria-invalid": isInvalid ? "true" : "false", "aria-describedby": isInvalid ? errorId : undefined };
                    return (
                        <li key={session.key} className={`border rounded p-2${isInvalid ? " border-danger" : ""}`}>
                            <div className="row g-2 align-items-end">
                                <div className="col-12 col-sm-4">
                                    <FormField id={`${session.key}-date`} name="date" label={`Fecha (jornada ${index + 1})`} type="date" className="" required value={session.date} {...invalidProps} onChange={(event) => onChange(session.key, "date", event.target.value)} />
                                </div>
                                <div className="col-6 col-sm-3">
                                    <FormField id={`${session.key}-start`} name="start_time" label="Inicio" type="time" className="" required value={session.start_time} {...invalidProps} onChange={(event) => onChange(session.key, "start_time", event.target.value)} />
                                </div>
                                <div className="col-6 col-sm-3">
                                    <FormField id={`${session.key}-end`} name="end_time" label="Fin" type="time" className="" required value={session.end_time} {...invalidProps} onChange={(event) => onChange(session.key, "end_time", event.target.value)} />
                                </div>
                                <div className="col-12 col-sm-2">
                                    <button type="button" className="btn btn-outline-danger w-100" onClick={() => onRemove(session.key)}>
                                        Quitar<span className="visually-hidden"> jornada {index + 1}</span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {error ? <div id={errorId} className="text-danger small mb-2" role="alert">{error}</div> : null}
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onAdd}>Agregar jornada</button>
        </fieldset>
    );
}

FairSessionsField.propTypes = {
    sessions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        start_time: PropTypes.string.isRequired,
        end_time: PropTypes.string.isRequired
    })).isRequired,
    error: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default FairSessionsField;
