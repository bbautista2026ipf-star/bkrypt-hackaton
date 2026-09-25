import { useCallback, useState } from "react";
import useAsyncAction from "./useAsyncAction.js";

// Acción destructiva con confirmación previa (eliminar producto, evento, ubicación u opinión)
function useConfirmation(action) {
    const [target, setTarget] = useState(null);
    const { isRunning, error, run, reset } = useAsyncAction(action);

    const open = useCallback((item) => {
        reset();
        setTarget(item);
    }, [reset]);

    const close = useCallback(() => setTarget(null), []);

    const confirm = useCallback(async () => {
        const isDone = await run(target);
        if (isDone) {
            setTarget(null);
        }
    }, [run, target]);

    return { target, isOpen: Boolean(target), isRunning, error, open, close, confirm };
}

export default useConfirmation;
