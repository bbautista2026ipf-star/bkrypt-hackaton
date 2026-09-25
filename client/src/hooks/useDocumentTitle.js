import { useEffect } from "react";
import { APP_NAME } from "../lib/constants.js";

// Cada página anuncia su título: ayuda a lectores de pantalla y a distinguir pestañas
function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    }, [title]);
}

export default useDocumentTitle;
