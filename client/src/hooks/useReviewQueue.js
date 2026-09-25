import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import useForbiddenRedirect from "./useForbiddenRedirect.js";

// Cola de revisión del administrador: carga elementos pendientes y, al resolver uno, lo quita de la lista.
// loader: () => Promise<Array>; se usa para solicitudes de emprendedor, de presencia y opiniones reportadas.
function useReviewQueue(loader) {
    const { data: items, status, error, reload, setData } = useAsyncData(loader);
    useForbiddenRedirect(error);
    const [processingId, setProcessingId] = useState(null);
    const [actionError, setActionError] = useState(null);

    // rethrow: cuando la acción viene de un diálogo, el error se muestra dentro del diálogo y no detrás
    const resolveItem = useCallback(async (itemId, action, { rethrow = false } = {}) => {
        setProcessingId(itemId);
        setActionError(null);
        try {
            await action();
            setData((previous) => previous.filter((item) => item.id !== itemId));
            return true;
        } catch (resolveError) {
            if (rethrow) {
                throw resolveError;
            }
            setActionError(resolveError.message);
            return false;
        } finally {
            setProcessingId(null);
        }
    }, [setData]);

    return {
        items: items ?? [],
        status,
        error,
        reload,
        processingId,
        actionError,
        resolveItem
    };
}

export default useReviewQueue;
