import useBusinessForm from "../hooks/useBusinessForm.js";
import BusinessFields from "./BusinessFields.jsx";
import FormAlert from "./FormAlert.jsx";

// Formulario extendido desde el perfil: el consumidor lo envía como solicitud; el emprendedor, para editar su perfil
function BusinessProfileForm() {
    const { values, errors, formError, status, successMessage, isSubmitting, isEditingProfile, formRef, handleChange, setFieldValue, handleSubmit } = useBusinessForm();

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={isEditingProfile ? "Datos del emprendimiento" : "Solicitud para ser emprendedor"}>
            <FormAlert message={status === "error" ? formError : null} />
            <FormAlert message={successMessage} variant="success" />
            <BusinessFields values={values} errors={errors} onChange={handleChange} onFieldValue={setFieldValue} idPrefix="profile-business" />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : isEditingProfile ? "Guardar datos del emprendimiento" : "Enviar solicitud"}
            </button>
        </form>
    );
}

export default BusinessProfileForm;
