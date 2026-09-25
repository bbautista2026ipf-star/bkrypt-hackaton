import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getCurrentUser, loginUser, logoutUser } from "../services/auth.service.js";

export const AuthContext = createContext(null);

const ANONYMOUS_SESSION = { user: null, entrepreneurProfile: null };

// Sin sesión el backend responde 401: es el estado normal de un visitante. Ante otros errores (red) devuelve null
// para conservar la sesión que ya se conocía.
const fetchSession = async () => {
    try {
        const { user, entrepreneurProfile } = await getCurrentUser();
        return { user, entrepreneurProfile };
    } catch (error) {
        return error.status === 401 || error.status === 404 ? ANONYMOUS_SESSION : null;
    }
};

export function AuthProvider({ children }) {
    const [session, setSession] = useState(ANONYMOUS_SESSION);
    const [status, setStatus] = useState("loading");

    const applySession = useCallback((nextSession) => {
        if (nextSession) {
            setSession(nextSession);
        }
        setStatus("ready");
    }, []);

    const refreshSession = useCallback(async () => {
        applySession(await fetchSession());
    }, [applySession]);

    useEffect(() => {
        let isCurrent = true;
        fetchSession().then((nextSession) => {
            if (isCurrent) {
                applySession(nextSession);
            }
        });
        return () => {
            isCurrent = false;
        };
    }, [applySession]);

    // Al volver a la pestaña se relee la sesión: si el administrador aprobó una solicitud, el nuevo rol aparece sin recargar
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refreshSession();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [refreshSession]);

    const login = useCallback(async (credentials) => {
        await loginUser(credentials);
        await refreshSession();
    }, [refreshSession]);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setSession(ANONYMOUS_SESSION);
        }
    }, []);

    const value = useMemo(() => ({
        ...session,
        status,
        role: session.user?.role ?? null,
        isAuthenticated: Boolean(session.user),
        login,
        logout,
        refreshSession
    }), [session, status, login, logout, refreshSession]);

    return <AuthContext value={value}>{children}</AuthContext>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
