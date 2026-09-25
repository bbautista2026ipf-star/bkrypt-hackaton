import { useEffect } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../lib/constants.js";

// Si el backend rechaza la carga de una vista protegida (403), se lleva al usuario a la página de permisos.
// Es la respuesta del servidor la que decide: el frontend no confía solo en lo que cree saber del rol.
function useForbiddenRedirect(error) {
    const navigate = useNavigate();

    useEffect(() => {
        if (error?.status === 403) {
            navigate(PATHS.forbidden, { replace: true });
        }
    }, [error, navigate]);
}

export default useForbiddenRedirect;
