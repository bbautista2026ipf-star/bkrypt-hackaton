import { useCallback, useEffect, useState } from "react";

// Maneja los tres estados de una petición: "loading", "error" y "success".
// "loader" debe estar memoizado con useCallback: cuando cambia, se vuelve a pedir.
// Mientras recarga conserva los datos anteriores para que la vista no parpadee.
function useAsyncData(loader, { enabled = true } = {}) {
    const [reloadCount, setReloadCount] = useState(0);
    const [result, setResult] = useState({ data: null, error: null, loader: null, reloadCount: -1 });

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }
        let isCurrent = true;
        loader()
            .then((data) => {
                if (isCurrent) {
                    setResult({ data, error: null, loader, reloadCount });
                }
            })
            .catch((error) => {
                if (isCurrent) {
                    setResult((previous) => ({ ...previous, error, loader, reloadCount }));
                }
            });
        return () => {
            isCurrent = false;
        };
    }, [loader, enabled, reloadCount]);

    // El estado se deriva: la respuesta guardada solo vale si corresponde a la petición vigente
    const isSettled = enabled && result.loader === loader && result.reloadCount === reloadCount;
    const status = isSettled ? (result.error ? "error" : "success") : "loading";

    const reload = useCallback(() => setReloadCount((count) => count + 1), []);

    const setData = useCallback((updater) => {
        setResult((previous) => ({ ...previous, data: typeof updater === "function" ? updater(previous.data) : updater }));
    }, []);

    return { data: result.data, status, error: isSettled ? result.error : null, reload, setData };
}

export default useAsyncData;
