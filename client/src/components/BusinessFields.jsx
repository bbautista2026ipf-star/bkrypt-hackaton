import PropTypes from "prop-types";
import FormField from "./FormField.jsx";
import LocationPicker from "./LazyLocationPicker.jsx";
import useEventLocations from "../hooks/useEventLocations.js";
import { toggleFairSelection } from "../lib/businessForm.js";

// Campos del formulario extendido del emprendimiento (registro, solicitud desde el perfil y edición del perfil)
function BusinessFields({ values, errors, onChange, onFieldValue, idPrefix }) {
    const { eventLocations, status: locationsStatus } = useEventLocations();
    const fairsErrorId = errors.event_location_ids ? `${idPrefix}-fairs-error` : undefined;

    return (
        <>
            <FormField id={`${idPrefix}-brand`} name="brand_name" label="Nombre del emprendimiento" required value={values.brand_name} onChange={onChange} error={errors.brand_name} autoComplete="organization" />
            <FormField id={`${idPrefix}-biography`} name="biography" label="Contanos qué hacés" as="textarea" rows={3} maxLength={1000} value={values.biography} onChange={onChange} error={errors.biography} />

            <FormField
                id={`${idPrefix}-whatsapp`}
                name="whatsapp_number"
                label="WhatsApp del emprendimiento"
                type="tel"
                inputMode="tel"
                placeholder="+5493704123456"
                value={values.whatsapp_number}
                onChange={onChange}
                error={errors.whatsapp_number}
                help="Es el canal por el que te van a consultar. Con código de país y de área, sin espacios."
            />

            <fieldset className="mb-3">
                <legend className="h6 fw-bold">¿Dónde te encuentran?</legend>
                <div className="form-check form-switch mb-3">
                    <input id={`${idPrefix}-has-store`} name="has_store" className="form-check-input" type="checkbox" role="switch" aria-checked={values.has_store} checked={values.has_store} onChange={onChange} />
                    <label className="form-check-label" htmlFor={`${idPrefix}-has-store`}>Tengo un local propio</label>
                </div>
                {values.has_store ? (
                    <div className="row">
                        <div className="col-12">
                            <FormField id={`${idPrefix}-store-address`} name="store_address" label="Dirección del local" required value={values.store_address} onChange={onChange} error={errors.store_address} autoComplete="street-address" />
                        </div>
                        <div className="col-12">
                            <LocationPicker
                                label="Ubicación del local"
                                latitude={values.store_latitude}
                                longitude={values.store_longitude}
                                onPick={(latitude, longitude) => {
                                    onFieldValue("store_latitude", latitude);
                                    onFieldValue("store_longitude", longitude);
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <FormField id={`${idPrefix}-store-latitude`} name="store_latitude" label="Latitud del local" type="number" step="any" inputMode="decimal" required value={values.store_latitude} onChange={onChange} error={errors.store_latitude} help="Ej.: -26.1849" />
                        </div>
                        <div className="col-12 col-md-6">
                            <FormField id={`${idPrefix}-store-longitude`} name="store_longitude" label="Longitud del local" type="number" step="any" inputMode="decimal" required value={values.store_longitude} onChange={onChange} error={errors.store_longitude} help="Ej.: -58.1753" />
                        </div>
                    </div>
                ) : null}
                <fieldset aria-describedby={fairsErrorId}>
                    <legend className="form-label fw-semibold fs-6">
                        Ferias a las que asistís {values.has_store ? <span className="text-body-secondary fw-normal">(opcional)</span> : <span className="text-body-secondary fw-normal">(elegí al menos una)</span>}
                    </legend>
                    {locationsStatus === "loading" ? <p>Cargando ferias...</p> : null}
                    {locationsStatus === "success" && eventLocations.length === 0 ? <p>Todavía no hay ferias cargadas por la administración.</p> : null}
                    <div className="row g-2">
                        {eventLocations.map((location) => (
                            <div className="col-12 col-md-6" key={location.id}>
                                <div className="form-check">
                                    <input
                                        id={`${idPrefix}-fair-${location.id}`}
                                        className={`form-check-input${errors.event_location_ids ? " is-invalid" : ""}`}
                                        type="checkbox"
                                        checked={values.event_location_ids.includes(location.id)}
                                        onChange={() => onFieldValue("event_location_ids", toggleFairSelection(values.event_location_ids, location.id))}
                                        aria-invalid={errors.event_location_ids ? "true" : "false"}
                                    />
                                    <label className="form-check-label" htmlFor={`${idPrefix}-fair-${location.id}`}>{location.name}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errors.event_location_ids ? <div id={fairsErrorId} className="invalid-feedback d-block">{errors.event_location_ids}</div> : null}
                </fieldset>
            </fieldset>
        </>
    );
}

BusinessFields.propTypes = {
    values: PropTypes.shape({
        brand_name: PropTypes.string.isRequired,
        biography: PropTypes.string.isRequired,
        whatsapp_number: PropTypes.string.isRequired,
        has_store: PropTypes.bool.isRequired,
        store_address: PropTypes.string.isRequired,
        store_latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        store_longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        event_location_ids: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    onFieldValue: PropTypes.func.isRequired,
    idPrefix: PropTypes.string.isRequired
};

export default BusinessFields;
