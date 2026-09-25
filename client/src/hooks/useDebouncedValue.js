import { useEffect, useState } from "react";

// Devuelve el valor recién cuando deja de cambiar: evita una petición por cada tecla en el buscador
function useDebouncedValue(value, delayInMs) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayInMs);
        return () => window.clearTimeout(timeoutId);
    }, [value, delayInMs]);

    return debouncedValue;
}

export default useDebouncedValue;
