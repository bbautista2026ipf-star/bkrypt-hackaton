import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth.js";
import LoadingState from "./LoadingState.jsx";
import { PATHS } from "../lib/constants.js";

// Exige sesión iniciada y, si se indican "roles", uno de esos roles. Es una ayuda de navegación:
// toda acción que modifica datos la vuelve a validar el backend, que responde 403 si el rol no corresponde.
function RequireSession({ roles = null, children }) {
    const { status, isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        return <LoadingState message="Verificando tu sesión..." />;
    }
    if (!isAuthenticated) {
        const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
        return <Navigate to={`${PATHS.login}?volver=${returnTo}`} replace />;
    }
    if (roles && !roles.includes(role)) {
        return <Navigate to={PATHS.forbidden} replace />;
    }
    return children;
}

RequireSession.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node.isRequired
};

export default RequireSession;
