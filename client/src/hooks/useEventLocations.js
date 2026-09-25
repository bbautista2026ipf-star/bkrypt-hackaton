import { useCallback } from "react";
import useAsyncData from "./useAsyncData.js";
import { createEventLocation, deleteEventLocation, getEventLocations, updateEventLocation } from "../services/eventLocation.service.js";

// Ubicaciones de ferias: las elige el emprendedor en su formulario y las administra el administrador.
// El backend no deja eliminar una feria si algún emprendedor sin local se quedaría sin ninguna (409).
const byName = (first, second) => first.name.localeCompare(second.name);

function useEventLocations() {
    const { data, status, error, reload, setData } = useAsyncData(getEventLocations);

    const addLocation = useCallback(async (locationValues) => {
        const { eventLocation } = await createEventLocation(locationValues);
        setData((previous) => ({
            eventLocations: [...(previous?.eventLocations ?? []), eventLocation].sort(byName)
        }));
    }, [setData]);

    // El backend devuelve la feria actualizada con sus jornadas próximas
    const updateLocation = useCallback(async (locationId, locationValues) => {
        const { eventLocation } = await updateEventLocation(locationId, locationValues);
        setData((previous) => ({
            eventLocations: previous.eventLocations.map((location) => (location.id === locationId ? eventLocation : location)).sort(byName)
        }));
    }, [setData]);

    const removeLocation = useCallback(async (locationId) => {
        await deleteEventLocation(locationId);
        setData((previous) => ({ eventLocations: previous.eventLocations.filter((location) => location.id !== locationId) }));
    }, [setData]);

    return {
        eventLocations: data?.eventLocations ?? [],
        status,
        error,
        reload,
        addLocation,
        updateLocation,
        removeLocation
    };
}

export default useEventLocations;
