import { useCallback } from "react";
import useForm from "./useForm.js";
import { toSchedulePayload, validateSchedule } from "../lib/scheduleForm.js";

// Los errores del backend llegan como start_time y end_time: los mismos nombres que usa el formulario
function useScheduleForm(initialValues, onSave) {
    const form = useForm(initialValues, validateSchedule);
    const { submit } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        await submit((values) => onSave(toSchedulePayload(values)));
    }, [submit, onSave]);

    return { ...form, handleSubmit };
}

export default useScheduleForm;
