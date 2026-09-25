import { useCallback, useEffect, useRef, useState } from "react";
import { scrollToSection } from "../lib/motion.js";

// Recorrido del mapa: marcador -> listado de emprendedores del evento -> catálogo del emprendedor.
// Cada selección desplaza la vista a la sección siguiente de la misma página, sin recargar.
function useMapSelection(events) {
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedEntrepreneurId, setSelectedEntrepreneurId] = useState(null);
    const [scrollRequest, setScrollRequest] = useState(null);
    const eventSectionRef = useRef(null);
    const catalogSectionRef = useRef(null);

    // Si los filtros dejan afuera al evento elegido, la selección deja de mostrarse (se deriva, no se copia)
    const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
    const isEntrepreneurInEvent = Boolean(selectedEvent?.participants.some((participant) => participant.id === selectedEntrepreneurId));

    // El scroll ocurre después de renderizar la sección de destino
    useEffect(() => {
        if (!scrollRequest) {
            return;
        }
        scrollToSection(scrollRequest.target === "catalog" ? catalogSectionRef.current : eventSectionRef.current);
    }, [scrollRequest]);

    const selectEvent = useCallback((eventId) => {
        setSelectedEventId(eventId);
        setSelectedEntrepreneurId(null);
        setScrollRequest({ target: "event", requestedAt: Date.now() });
    }, []);

    const selectEntrepreneur = useCallback((entrepreneurId) => {
        setSelectedEntrepreneurId(entrepreneurId);
        setScrollRequest({ target: "catalog", requestedAt: Date.now() });
    }, []);

    return {
        selectedEvent,
        selectedEntrepreneurId: isEntrepreneurInEvent ? selectedEntrepreneurId : null,
        selectEvent,
        selectEntrepreneur,
        eventSectionRef,
        catalogSectionRef
    };
}

export default useMapSelection;
