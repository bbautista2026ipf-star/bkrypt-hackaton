import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth.js";
import LoadingState from "./LoadingState.jsx";
import { PATHS } from "../lib/constants.js";

// Solo exige sesión iniciada. El permiso por rol lo decide el backend: cada vista protegida pide sus datos
// y, si el servidor responde 403, redirige a la página de permisos (useForbiddenRedirect).
function RequireSession({ children }) {
    const { status, isAuthenticated } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        return <LoadingState message="Verificando tu sesión..." />;
    }
    if (!isAuthenticated) {
        const returnTo = encodeURIComponent(`${location.pathname}${location.search}`);
        return <Navigate to={`${PATHS.login}?volver=${returnTo}`} replace />;
    }
    return children;
}

RequireSession.propTypes = {
    children: PropTypes.node.isRequired
};

export default RequireSession;
