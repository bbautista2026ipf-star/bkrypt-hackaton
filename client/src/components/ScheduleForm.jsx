import PropTypes from "prop-types";
import useScheduleForm from "../hooks/useScheduleForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";

// Horario del emprendedor en una feria. Solo se ofrecen las ferias de su perfil: el backend rechaza cualquier otra.
function ScheduleForm({ initialValues, ownFairs, isEditing, onSave }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, handleSubmit } = useScheduleForm(initialValues, onSave);

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={isEditing ? "Editar horario" : "Cargar horario"}>
            <FormAlert message={status === "error" ? formError : null} />
            <FormField id="schedule-fair" name="event_location_id" label="Feria" as="select" required value={values.event_location_id} onChange={handleChange} error={errors.event_location_id}>
                <option value="">Elegí una de tus ferias</option>
                {ownFairs.map((fair) => (
                    <option key={fair.id} value={fair.id}>{fair.name}</option>
                ))}
            </FormField>
            <FormField id="schedule-date" name="date" label="Fecha" type="date" required value={values.date} onChange={handleChange} error={errors.date} />
            <div className="row">
                <div className="col-12 col-sm-6">
                    <FormField id="schedule-start" name="start_time" label="Hora de inicio" type="time" required value={values.start_time} onChange={handleChange} error={errors.start_time} />
                </div>
                <div className="col-12 col-sm-6">
                    <FormField id="schedule-end" name="end_time" label="Hora de fin" type="time" required value={values.end_time} onChange={handleChange} error={errors.end_time} />
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : isEditing ? "Guardar horario" : "Cargar horario"}
                </button>
            </div>
        </form>
    );
}

ScheduleForm.propTypes = {
    initialValues: PropTypes.shape({
        event_location_id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        start_time: PropTypes.string.isRequired,
        end_time: PropTypes.string.isRequired
    }).isRequired,
    ownFairs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    isEditing: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired
};

export default ScheduleForm;
