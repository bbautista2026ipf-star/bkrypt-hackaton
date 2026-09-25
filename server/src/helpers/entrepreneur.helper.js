import { EntrepreneurProfile, businessAttributes } from "../models/entrepreneur_profile.model.js";
import { EntrepreneurRequest } from "../models/entrepreneur_request.model.js";
import { EventLocation } from "../models/event_location.model.js";

const BUSINESS_FIELDS = Object.keys(businessAttributes);

const emptyToNull = (value) => (value === undefined || value === "" ? null : value);

// Normaliza los datos del emprendimiento: sin local no se guardan dirección ni coordenadas
export const pickBusinessData = (data) => {
    const businessData = Object.fromEntries(BUSINESS_FIELDS.map((field) => [field, emptyToNull(data[field])]));
    businessData.has_store = Boolean(data.has_store);
    if (!businessData.has_store) {
        businessData.store_address = null;
        businessData.store_latitude = null;
        businessData.store_longitude = null;
    }
    return businessData;
};

const findExistingFairIds = async (fairIds, transaction) => {
    if (!Array.isArray(fairIds) || fairIds.length === 0) {
        return [];
    }
    const fairs = await EventLocation.findAll({ where: { id: [...new Set(fairIds)] }, attributes: ["id"], transaction });
    return fairs.map((fair) => fair.id);
};

export const createPendingEntrepreneurRequest = (userId, data, transaction) => EntrepreneurRequest.create({
    user_id: userId,
    ...pickBusinessData(data),
    event_location_ids: data.event_location_ids ?? []
}, { transaction });

// Al aprobar la solicitud el perfil se crea con los mismos datos; las ferias eliminadas mientras tanto se descartan
export const createProfileFromRequest = async (entrepreneurRequest, transaction) => {
    const requestData = entrepreneurRequest.get({ plain: true });
    const profile = await EntrepreneurProfile.create({
        user_id: entrepreneurRequest.user_id,
        ...pickBusinessData(requestData)
    }, { transaction });
    await profile.setFairs(await findExistingFairIds(requestData.event_location_ids, transaction), { transaction });
    return profile;
};

export const updateProfileData = async (profile, data, transaction) => {
    await profile.update(pickBusinessData(data), { transaction });
    await profile.setFairs(await findExistingFairIds(data.event_location_ids, transaction), { transaction });
};
