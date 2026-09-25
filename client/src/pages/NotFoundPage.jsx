import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { PATHS } from "../lib/constants.js";

function NotFoundPage() {
    useDocumentTitle("Página no encontrada");

    return (
        <div className="container py-5 text-center">
            <p className="banner-tag mb-3">Error 404</p>
            <h1 className="h2">No encontramos esta página</h1>
            <p className="lead">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
            <Link className="btn btn-primary" to={PATHS.home}>Volver al inicio</Link>
        </div>
    );
}

export default NotFoundPage;
