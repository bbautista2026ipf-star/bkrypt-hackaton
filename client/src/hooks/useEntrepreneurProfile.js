import { useCallback } from "react";
import useAsyncData from "./useAsyncData.js";
import { getEntrepreneur } from "../services/entrepreneur.service.js";

// Perfil público con su catálogo; si no hay id (nada seleccionado) no hace la petición
function useEntrepreneurProfile(entrepreneurId) {
    const loadProfile = useCallback(() => getEntrepreneur(entrepreneurId), [entrepreneurId]);
    const { data, status, error, reload } = useAsyncData(loadProfile, { enabled: Boolean(entrepreneurId) });

    return {
        entrepreneur: data?.entrepreneur ?? null,
        status,
        error,
        reload
    };
}

export default useEntrepreneurProfile;
