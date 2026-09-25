import { useCallback, useState } from "react";

// Estado de una acción puntual (enviar, aprobar, eliminar): "idle", "running", "success" o "error"
function useAsyncAction(action) {
    const [state, setState] = useState({ status: "idle", error: null });

    const run = useCallback(async (...args) => {
        setState({ status: "running", error: null });
        try {
            await action(...args);
            setState({ status: "success", error: null });
            return true;
        } catch (error) {
            setState({ status: "error", error: error.message });
            return false;
        }
    }, [action]);

    const reset = useCallback(() => setState({ status: "idle", error: null }), []);

    return { ...state, isRunning: state.status === "running", run, reset };
}

export default useAsyncAction;
