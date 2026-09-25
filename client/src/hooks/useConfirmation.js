import { useCallback, useState } from "react";
import useAsyncAction from "./useAsyncAction.js";

// Acción destructiva con confirmación previa (eliminar producto, reseña, horario o feria).
// Al cerrar se conserva el elemento elegido para que el diálogo no quede vacío durante su animación de salida.
function useConfirmation(action) {
    const [dialog, setDialog] = useState({ target: null, isOpen: false });
    const { isRunning, error, run, reset } = useAsyncAction(action);

    const open = useCallback((item) => {
        reset();
        setDialog({ target: item, isOpen: true });
    }, [reset]);

    const close = useCallback(() => setDialog((previous) => ({ ...previous, isOpen: false })), []);

    const confirm = useCallback(async () => {
        const isDone = await run(dialog.target);
        if (isDone) {
            close();
        }
    }, [run, dialog.target, close]);

    return { target: dialog.target, isOpen: dialog.isOpen, isRunning, error, open, close, confirm };
}

export default useConfirmation;
