import { useCallback, useMemo, useState } from "react";
import useAuth from "./useAuth.js";
import useForm from "./useForm.js";
import { updateOwnEntrepreneurProfile } from "../services/entrepreneur.service.js";
import { EMPTY_BUSINESS, businessFromProfile, toBusinessPayload, validateBusiness } from "../lib/businessForm.js";

// Edición del perfil del emprendimiento. Si el local o las ferias quedan incoherentes, el backend responde con un mensaje general.
function useBusinessForm() {
    const { entrepreneurProfile, refreshSession } = useAuth();
    const initialValues = useMemo(
        () => (entrepreneurProfile ? businessFromProfile(entrepreneurProfile) : EMPTY_BUSINESS),
        [entrepreneurProfile]
    );
    const form = useForm(initialValues, validateBusiness);
    const { submit } = form;
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setSuccessMessage(null);
        await submit(async (values) => {
            const { message } = await updateOwnEntrepreneurProfile(toBusinessPayload(values, { isUpdate: true }));
            await refreshSession();
            setSuccessMessage(message);
        });
    }, [submit, refreshSession]);

    return { ...form, handleSubmit, successMessage };
}

export default useBusinessForm;
