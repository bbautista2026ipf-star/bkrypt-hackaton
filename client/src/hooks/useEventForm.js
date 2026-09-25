import { useCallback, useState } from "react";
import useForm from "./useForm.js";
import { createEvent } from "../services/event.service.js";
import { EMPTY_EVENT, mapEventFieldErrors, toEventPayload, validateEvent } from "../lib/eventForm.js";

// El administrador habilita una fecha de evento en una ubicación existente
function useEventForm(onEventCreated) {
    const form = useForm(EMPTY_EVENT, validateEvent, { mapFieldErrors: mapEventFieldErrors });
    const { submit, reset } = form;
    const [createdTitle, setCreatedTitle] = useState(null);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setCreatedTitle(null);
        await submit(async (values) => {
            const { event: createdEvent } = await createEvent(toEventPayload(values));
            reset();
            setCreatedTitle(createdEvent.title);
            onEventCreated();
        });
    }, [submit, reset, onEventCreated]);

    return { ...form, handleSubmit, createdTitle };
}

export default useEventForm;
