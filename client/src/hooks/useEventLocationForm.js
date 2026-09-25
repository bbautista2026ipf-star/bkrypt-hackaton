import { useCallback, useMemo } from "react";
import useForm from "./useForm.js";
import {
    EMPTY_LOCATION,
    createSessionRow,
    locationToFormValues,
    mapLocationFieldErrors,
    toLocationPayload,
    validateLocation
} from "../lib/eventLocationForm.js";

const formOptions = { mapFieldErrors: mapLocationFieldErrors };

// Alta y edición de una feria con sus jornadas. Sin "location" es un alta: al guardar se vacía para cargar otra.
function useEventLocationForm(location, onSave) {
    const initialValues = useMemo(() => (location ? locationToFormValues(location) : EMPTY_LOCATION), [location]);
    const form = useForm(initialValues, validateLocation, formOptions);
    const { submit, reset, values, setFieldValue } = form;

    const addSession = useCallback(() => {
        setFieldValue("sessions", [...values.sessions, createSessionRow()]);
    }, [values.sessions, setFieldValue]);

    const changeSession = useCallback((sessionKey, field, value) => {
        setFieldValue("sessions", values.sessions.map((session) => (session.key === sessionKey ? { ...session, [field]: value } : session)));
    }, [values.sessions, setFieldValue]);

    const removeSession = useCallback((sessionKey) => {
        setFieldValue("sessions", values.sessions.filter((session) => session.key !== sessionKey));
    }, [values.sessions, setFieldValue]);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const isSaved = await submit((formValues) => onSave(toLocationPayload(formValues)));
        if (isSaved && !location) {
            reset();
        }
    }, [submit, reset, onSave, location]);

    return { ...form, addSession, changeSession, removeSession, handleSubmit };
}

export default useEventLocationForm;
