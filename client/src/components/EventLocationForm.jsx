import PropTypes from "prop-types";
import useEventLocationForm from "../hooks/useEventLocationForm.js";
import FormField from "./FormField.jsx";
import FormAlert from "./FormAlert.jsx";
import LocationPicker from "./LazyLocationPicker.jsx";

function EventLocationForm({ onAddLocation }) {
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, setFieldValue, handleSubmit } = useEventLocationForm(onAddLocation);

    return (
        <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-labelledby="new-location-title">
            <h3 id="new-location-title" className="h5">Nueva ubicación</h3>
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Agregar ubicación"}
            </button>
        </form>
    );
}

EventLocationForm.propTypes = {
    onAddLocation: PropTypes.func.isRequired
};

export default EventLocationForm;
