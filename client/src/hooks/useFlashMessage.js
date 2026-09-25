import { useState } from "react";
import { useLocation } from "react-router";

// Mensaje de confirmación que una página deja a la siguiente al navegar (por ejemplo, "Producto guardado")
function useFlashMessage() {
    const location = useLocation();
    const [message] = useState(() => location.state?.flash ?? null);
    return message;
}

export default useFlashMessage;
