import { Link } from "react-router";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { PATHS, ROLE_LABELS } from "../lib/constants.js";

function ForbiddenPage() {
    useDocumentTitle("Sin permisos");
    const { role } = useAuth();

    return (
        <div className="container py-5 text-center">
            <p className="banner-tag mb-3">Error 403</p>
            <h1 className="h2">No tenés permisos para ver esta sección</h1>
            <p className="lead mx-auto col-lg-8">
                {role ? `Tu cuenta es de tipo ${ROLE_LABELS[role].toLowerCase()} y esta acción está reservada para otro tipo de cuenta.` : "Esta sección requiere otro tipo de cuenta."}
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link className="btn btn-primary" to={PATHS.catalog}>Ir al catálogo</Link>
                <Link className="btn btn-outline-primary" to={PATHS.profile}>Ir a mi perfil</Link>
            </div>
        </div>
    );
}

export default ForbiddenPage;
