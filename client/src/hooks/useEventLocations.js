import { useCallback } from "react";
import useAsyncData from "./useAsyncData.js";
import { createEventLocation, deleteEventLocation, getEventLocations } from "../services/event.service.js";

// Ubicaciones de ferias: las elige el emprendedor en su formulario y las administra el administrador
function useEventLocations() {
    const { data, status, error, reload, setData } = useAsyncData(getEventLocations);

    const addLocation = useCallback(async (locationValues) => {
        const { eventLocation } = await createEventLocation(locationValues);
        setData((previous) => ({
            eventLocations: [...(previous?.eventLocations ?? []), eventLocation].sort((first, second) => first.name.localeCompare(second.name))
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
        removeLocation
    };
}

export default useEventLocations;
