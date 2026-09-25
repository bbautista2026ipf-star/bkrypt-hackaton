import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useLoginForm from "../hooks/useLoginForm.js";
import useFlashMessage from "../hooks/useFlashMessage.js";
import FormField from "../components/FormField.jsx";
import FormAlert from "../components/FormAlert.jsx";
import { PATHS } from "../lib/constants.js";

function LoginPage() {
    useDocumentTitle("Ingresar");
    const flashMessage = useFlashMessage();
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, handleSubmit } = useLoginForm();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <h1 className="h2 mb-4">Ingresar</h1>
                    <FormAlert message={flashMessage} variant="success" />
                    <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-label="Iniciar sesión">
                        <FormAlert message={status === "error" ? formError : null} />
                        <FormField id="login-email" name="email" type="email" label="Correo electrónico" autoComplete="email" required value={values.email} onChange={handleChange} error={errors.email} />
                        <FormField id="login-password" name="password" type="password" label="Contraseña" autoComplete="current-password" required value={values.password} onChange={handleChange} error={errors.password} />
                        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        ¿Todavía no tenés cuenta? <Link to={PATHS.register}>Registrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
