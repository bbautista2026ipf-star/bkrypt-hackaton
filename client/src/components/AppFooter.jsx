import { Link } from "react-router";
import { APP_NAME, PATHS } from "../lib/constants.js";

function AppFooter() {
    return (
        <footer className="app-footer py-4 mt-5">
            <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
                <div>
                    <p className="fw-bold mb-1">{APP_NAME}</p>
                    <p className="mb-0">Descubrí la oferta local y sumate a ella, todo en un lugar.</p>
                </div>
                <nav aria-label="Enlaces del pie de página">
                    <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
                        <li><Link to={PATHS.catalog}>Catálogo</Link></li>
                        <li><Link to={PATHS.map}>Mapa</Link></li>
                        <li><Link to={PATHS.agenda}>Agenda de ferias</Link></li>
                        <li><Link to={PATHS.register}>Sumá tu emprendimiento</Link></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export default AppFooter;
