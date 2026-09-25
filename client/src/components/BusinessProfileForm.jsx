import useBusinessForm from "../hooks/useBusinessForm.js";
import BusinessFields from "./BusinessFields.jsx";
import FormAlert from "./FormAlert.jsx";

// Edición de los datos del emprendimiento desde el perfil del emprendedor
function BusinessProfileForm() {
    const { values, errors, formError, status, successMessage, isSubmitting, formRef, handleChange, setFieldValue, handleSubmit } = useBusinessForm();

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Datos del emprendimiento">
            <FormAlert message={status === "error" ? formError : null} />
            <FormAlert message={successMessage} variant="success" />
            <BusinessFields values={values} errors={errors} onChange={handleChange} onFieldValue={setFieldValue} idPrefix="profile-business" />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar datos del emprendimiento"}
            </button>
        </form>
    );
}

export default BusinessProfileForm;
