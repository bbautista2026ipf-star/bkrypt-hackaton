import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import useRegisterForm from "../hooks/useRegisterForm.js";
import FormField from "../components/FormField.jsx";
import FormAlert from "../components/FormAlert.jsx";
import BusinessFields from "../components/BusinessFields.jsx";
import { PATHS, ROLES } from "../lib/constants.js";

const ROLE_OPTIONS = [
    { value: ROLES.consumer, title: "Soy consumidor", text: "Quiero descubrir productos y ferias, y calificar lo que compro." },
    { value: ROLES.entrepreneur, title: "Tengo un emprendimiento", text: "Quiero publicar mi catálogo y cargar los horarios en los que voy a estar en las ferias." }
];

function RegisterPage() {
    useDocumentTitle("Crear cuenta");
    const { values, errors, formError, status, isSubmitting, formRef, handleChange, setFieldValue, handleSubmit, registration } = useRegisterForm();
    const isEntrepreneur = values.role === ROLES.entrepreneur;

    if (registration) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 text-center fade-in-up">
                        <h1 className="h2">¡Listo, {registration.user.name}!</h1>
                        <p className="lead">{registration.message}.</p>
                        <p>Ya podés iniciar sesión con <strong>{registration.user.email}</strong> y tu contraseña.</p>
                        <Link className="btn btn-primary" to={PATHS.login}>Ir a iniciar sesión</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <h1 className="h2 mb-4">Crear cuenta</h1>
                    <form ref={formRef} className="card card-body" onSubmit={handleSubmit} noValidate aria-label="Registro">
                        <FormAlert message={status === "error" ? formError : null} />
                        <fieldset className="mb-4">
                            <legend className="h5 fw-bold">¿Cómo vas a usar la plataforma?</legend>
                            <div className="row g-3">
                                {ROLE_OPTIONS.map((option) => (
                                    <div className="col-12 col-md-6" key={option.value}>
                                        <div className={`card h-100 ${values.role === option.value ? "border-primary border-2" : ""}`}>
                                            <div className="card-body">
                                                <div className="form-check">
                                                    <input id={`role-${option.value}`} className="form-check-input" type="radio" name="role" value={option.value} checked={values.role === option.value} onChange={handleChange} />
                                                    <label className="form-check-label fw-bold" htmlFor={`role-${option.value}`}>{option.title}</label>
                                                </div>
                                                <p className="mb-0 mt-2">{option.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="mb-2">
                            <legend className="h5 fw-bold">Tus datos</legend>
                            <FormField id="register-name" name="name" label="Nombre y apellido" autoComplete="name" required value={values.name} onChange={handleChange} error={errors.name} />
                            <FormField id="register-email" name="email" type="email" label="Correo electrónico" autoComplete="email" required value={values.email} onChange={handleChange} error={errors.email} />
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <FormField id="register-password" name="password" type="password" label="Contraseña" autoComplete="new-password" required value={values.password} onChange={handleChange} error={errors.password} help="Mínimo 8 caracteres, con una mayúscula, una minúscula y un número." />
                                </div>
                                <div className="col-12 col-md-6">
                                    <FormField id="register-password-confirmation" name="password_confirmation" type="password" label="Repetí la contraseña" autoComplete="new-password" required value={values.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
                                </div>
                            </div>
                        </fieldset>

                        {isEntrepreneur ? (
                            <section className="mb-2 fade-in-up" aria-labelledby="business-title">
                                <h2 id="business-title" className="h5 fw-bold">Tu emprendimiento</h2>
                                <BusinessFields values={values} errors={errors} onChange={handleChange} onFieldValue={setFieldValue} idPrefix="register-business" />
                            </section>
                        ) : null}

                        <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        ¿Ya tenés cuenta? <Link to={PATHS.login}>Ingresá</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
