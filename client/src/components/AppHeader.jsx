import { useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.js";
import { APP_NAME, PATHS } from "../lib/constants.js";
import { getNavigationLinks, getSharedFilterQuery } from "../lib/navigation.js";

// Barra principal: en escritorio se ve completa; en móvil se abre como offcanvas nativo de Bootstrap
function AppHeader() {
    const { isAuthenticated, role, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const links = getNavigationLinks(role, getSharedFilterQuery(location.pathname, location.search));

    const handleLogout = useCallback(async () => {
        await logout();
        navigate(PATHS.home);
    }, [logout, navigate]);

    return (
        <header>
            <nav className="navbar navbar-expand-lg app-navbar sticky-top" aria-label="Navegación principal">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center gap-2" to={PATHS.home}>
                        <span className="brand-mark" aria-hidden="true"></span>
                        {APP_NAME}
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#main-menu"
                        aria-controls="main-menu"
                        aria-label="Abrir el menú"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex={-1} id="main-menu" aria-labelledby="main-menu-title">
                        <div className="offcanvas-header">
                            <h2 className="offcanvas-title h5" id="main-menu-title">Menú</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar el menú"></button>
                        </div>
                        <div className="offcanvas-body align-items-lg-center">
                            <ul className="navbar-nav flex-grow-1 gap-1">
                                {links.map((link) => (
                                    <li className="nav-item" key={link.label}>
                                        <NavLink className="nav-link" to={link.to} data-bs-dismiss="offcanvas">
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
                                {isAuthenticated ? (
                                    <>
                                        <NavLink className="nav-link" to={PATHS.profile} data-bs-dismiss="offcanvas">
                                            Mi perfil <span className="visually-hidden">({user.name})</span>
                                        </NavLink>
                                        <button type="button" className="btn btn-outline-primary" onClick={handleLogout} data-bs-dismiss="offcanvas">
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link className="btn btn-outline-primary" to={PATHS.login} data-bs-dismiss="offcanvas">Ingresar</Link>
                                        <Link className="btn btn-primary" to={PATHS.register} data-bs-dismiss="offcanvas">Crear cuenta</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default AppHeader;
