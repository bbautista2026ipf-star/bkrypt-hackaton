import PropTypes from "prop-types";
import useEventLocationForm from "../hooks/useEventLocationForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import FairSessionsField from "./FairSessionsField.jsx";
import LocationPicker from "./LazyLocationPicker.jsx";

// Alta de una feria o, si recibe "location", edición de una existente (datos, ubicación y jornadas)
function EventLocationForm({ location = null, onSave, onCancel = null }) {
    const {
        values, errors, formError, status, isSubmitting, formRef,
        handleChange, setFieldValue, handleSubmit, addSession, changeSession, removeSession
    } = useEventLocationForm(location, onSave);
    const isEditing = Boolean(location);

    return (
        <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-labelledby="location-form-title">
            <h3 id="location-form-title" className="h5">{isEditing ? `Editar ${location.name}` : "Nueva feria"}</h3>
            <FormAlert message={status === "error" ? formError : null} />
            <FormField id="location-name" name="name" label="Nombre" required value={values.name} onChange={handleChange} error={errors.name} />
            <FormField id="location-description" name="description" label="Descripción" as="textarea" rows={2} value={values.description} onChange={handleChange} error={errors.description} />
            <LocationPicker
                label="Ubicación de la feria"
                latitude={values.latitude}
                longitude={values.longitude}
                onPick={(latitude, longitude) => {
                    setFieldValue("latitude", latitude);
                    setFieldValue("longitude", longitude);
                }}
            />
            <div className="row">
                <div className="col-12 col-sm-6">
                    <FormField id="location-latitude" name="latitude" label="Latitud" type="number" step="any" inputMode="decimal" required value={values.latitude} onChange={handleChange} error={errors.latitude} />
                </div>
                <div className="col-12 col-sm-6">
                    <FormField id="location-longitude" name="longitude" label="Longitud" type="number" step="any" inputMode="decimal" required value={values.longitude} onChange={handleChange} error={errors.longitude} />
                </div>
            </div>
            <FairSessionsField sessions={values.sessions} error={errors.sessions} onAdd={addSession} onChange={changeSession} onRemove={removeSession} />
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                {onCancel ? (
                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
                ) : null}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar feria"}
                </button>
            </div>
        </form>
    );
}

EventLocationForm.propTypes = {
    location: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func
};

export default EventLocationForm;
