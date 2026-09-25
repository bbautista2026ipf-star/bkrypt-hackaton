import { useCallback } from "react";
import useForm from "./useForm.js";
import { collectErrors, validateLength, validateNumberInRange } from "../lib/validators.js";

const INITIAL_VALUES = { name: "", description: "", latitude: "", longitude: "" };

const validateLocation = (values) => collectErrors({
    name: validateLength(values.name, { label: "El nombre de la feria", min: 2, max: 100 }),
    description: validateLength(values.description, { label: "La descripción", max: 1000, required: false }),
    latitude: validateNumberInRange(values.latitude, { label: "La latitud", min: -90, max: 90 }),
    longitude: validateNumberInRange(values.longitude, { label: "La longitud", min: -180, max: 180 })
});

function useEventLocationForm(addLocation) {
    const form = useForm(INITIAL_VALUES, validateLocation);
    const { submit, reset } = form;

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const isSaved = await submit((values) => addLocation({
            name: values.name.trim(),
            description: values.description.trim(),
            latitude: Number(values.latitude),
            longitude: Number(values.longitude)
        }));
        if (isSaved) {
            reset();
        }
    }, [submit, reset, addLocation]);

    return { ...form, handleSubmit };
}

export default useEventLocationForm;
