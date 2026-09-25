import { Link, useSearchParams } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useEmailVerification } from "../hooks/useEmailVerification.js";
import LoadingState from "../components/LoadingState.jsx";
import { PATHS } from "../lib/constants.js";

function VerifyEmailPage() {
    useDocumentTitle("Verificar correo");
    const [searchParams] = useSearchParams();
    const { status, message } = useEmailVerification(searchParams.get("token"));

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 text-center">
                    <h1 className="h2 mb-4">Verificación de correo</h1>
                    {status === "loading" ? <LoadingState message="Verificando tu correo..." /> : null}
                    {status === "success" ? (
                        <div className="fade-in-up">
                            <p className="alert alert-success" role="status">{message}.</p>
                            <Link className="btn btn-primary" to={PATHS.login}>Iniciar sesión</Link>
                        </div>
                    ) : null}
                    {status === "error" ? (
                        <div>
                            <p className="alert alert-danger" role="alert">{message}</p>
                            <p>Intentá iniciar sesión: si tu correo todavía no está verificado, vas a poder pedir un enlace nuevo.</p>
                            <Link className="btn btn-outline-primary" to={PATHS.login}>Ir a iniciar sesión</Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
