import { useCallback, useEffect, useRef, useState } from "react";
import { scrollToSection } from "../lib/motion.js";

// Recorrido del mapa: marcador -> emprendedores de la feria -> catálogo del emprendedor.
// Cada selección desplaza la vista a la sección siguiente de la misma página, sin recargar.
function useMapSelection(fairs) {
    const [selectedFairId, setSelectedFairId] = useState(null);
    const [selectedEntrepreneurId, setSelectedEntrepreneurId] = useState(null);
    const [scrollRequest, setScrollRequest] = useState(null);
    const fairSectionRef = useRef(null);
    const catalogSectionRef = useRef(null);

    // Si los filtros dejan afuera a la feria elegida, la selección deja de mostrarse (se deriva, no se copia)
    const selectedFair = fairs.find((fair) => fair.id === selectedFairId) ?? null;
    const isEntrepreneurInFair = Boolean(selectedFair?.participants.some((participant) => participant.id === selectedEntrepreneurId));

    // El scroll ocurre después de renderizar la sección de destino
    useEffect(() => {
        if (!scrollRequest) {
            return;
        }
        scrollToSection(scrollRequest.target === "catalog" ? catalogSectionRef.current : fairSectionRef.current);
    }, [scrollRequest]);

    const selectFair = useCallback((fairId) => {
        setSelectedFairId(fairId);
        setSelectedEntrepreneurId(null);
        setScrollRequest({ target: "fair", requestedAt: Date.now() });
    }, []);

    const selectEntrepreneur = useCallback((entrepreneurId) => {
        setSelectedEntrepreneurId(entrepreneurId);
        setScrollRequest({ target: "catalog", requestedAt: Date.now() });
    }, []);

    return {
        selectedFair,
        selectedEntrepreneurId: isEntrepreneurInFair ? selectedEntrepreneurId : null,
        selectFair,
        selectEntrepreneur,
        fairSectionRef,
        catalogSectionRef
    };
}

export default useMapSelection;
