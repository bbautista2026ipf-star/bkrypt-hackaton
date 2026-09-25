import { useCallback } from "react";
import { Offcanvas } from "bootstrap";

// Cierra el menú lateral desde React. Los enlaces del menú no llevan data-bs-dismiss porque Bootstrap
// cancela el clic (preventDefault) en los elementos <a>, y la navegación del enrutador nunca se ejecutaría.
function useOffcanvasMenu(menuId) {
    return useCallback(() => {
        const menuElement = document.getElementById(menuId);
        if (menuElement) {
            Offcanvas.getInstance(menuElement)?.hide();
        }
    }, [menuId]);
}

export default useOffcanvasMenu;
