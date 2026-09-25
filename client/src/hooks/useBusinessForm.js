import { useCallback, useMemo, useState } from "react";
import useAuth from "./useAuth.js";
import useForm from "./useForm.js";
import { submitEntrepreneurRequest } from "../services/auth.service.js";
import { updateOwnEntrepreneurProfile } from "../services/entrepreneur.service.js";
import { EMPTY_BUSINESS, businessFromProfile, toBusinessPayload, validateBusiness } from "../lib/businessForm.js";

// Mismo formulario extendido para dos casos: el consumidor que pide ser emprendedor y el emprendedor que edita su perfil
function useBusinessForm() {
    const { entrepreneurProfile, refreshSession } = useAuth();
    const isEditingProfile = Boolean(entrepreneurProfile);
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
            const payload = toBusinessPayload(values);
            const { message } = isEditingProfile
                ? await updateOwnEntrepreneurProfile(payload)
                : await submitEntrepreneurRequest(payload);
            await refreshSession();
            setSuccessMessage(message);
        });
    }, [submit, isEditingProfile, refreshSession]);

    return { ...form, handleSubmit, isEditingProfile, successMessage };
}

export default useBusinessForm;
