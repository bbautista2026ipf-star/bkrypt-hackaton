import PropTypes from "prop-types";
import useEventForm from "../hooks/useEventForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";

// Alta de una fecha de evento: solo el administrador habilita eventos; los emprendedores solicitan presencia en ellos
function EventForm({ eventLocations, onEventCreated }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, handleSubmit, createdTitle } = useEventForm(onEventCreated);

    return (
        <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-labelledby="new-event-title">
            <h3 id="new-event-title" className="h5">Habilitar un evento</h3>
            <FormAlert message={status === "error" ? formError : null} />
            <FormAlert message={createdTitle ? `"${createdTitle}" quedó habilitado: los emprendedores ya pueden solicitar su presencia.` : null} variant="success" />
            <FormField id="event-title" name="title" label="Nombre del evento" required value={values.title} onChange={handleChange} error={errors.title} />
            <FormField id="event-location" name="event_location_id" label="Ubicación" as="select" required value={values.event_location_id} onChange={handleChange} error={errors.event_location_id}>
                <option value="">Elegí una ubicación</option>
                {eventLocations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                ))}
            </FormField>
            <FormField id="event-date" name="date" label="Fecha" type="date" required value={values.date} onChange={handleChange} error={errors.date} />
            <div className="row">
                <div className="col-12 col-sm-6">
                    <FormField id="event-start" name="start_time" label="Hora de inicio" type="time" required value={values.start_time} onChange={handleChange} error={errors.start_time} />
                </div>
                <div className="col-12 col-sm-6">
                    <FormField id="event-end" name="end_time" label="Hora de fin" type="time" required value={values.end_time} onChange={handleChange} error={errors.end_time} />
                </div>
            </div>
            <FormField id="event-description" name="description" label="Descripción" as="textarea" rows={2} value={values.description} onChange={handleChange} error={errors.description} />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Habilitando..." : "Habilitar evento"}
            </button>
        </form>
    );
}

EventForm.propTypes = {
    eventLocations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    onEventCreated: PropTypes.func.isRequired
};

export default EventForm;
