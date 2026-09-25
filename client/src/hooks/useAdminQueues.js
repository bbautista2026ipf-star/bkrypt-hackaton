import { useCallback, useState } from "react";
import useReviewQueue from "./useReviewQueue.js";
import useConfirmation from "./useConfirmation.js";
import {
    deleteOpinion,
    dismissOpinionReport,
    getEntrepreneurRequests,
    getPresenceRequests,
    getReportedOpinions,
    reviewEntrepreneurRequest,
    reviewPresenceRequest
} from "../services/admin.service.js";

const loadPendingEntrepreneurRequests = () => getEntrepreneurRequests("pending").then((data) => data.entrepreneurRequests);
const loadPendingPresenceRequests = () => getPresenceRequests("pending").then((data) => data.presenceRequests);
const loadReportedOpinions = () => getReportedOpinions().then((data) => data.opinions);

export function useEntrepreneurRequestQueue() {
    const queue = useReviewQueue(loadPendingEntrepreneurRequests);
    const { resolveItem } = queue;
    const [rejectTarget, setRejectTarget] = useState(null);

    const approve = useCallback((requestId) => resolveItem(requestId, () => reviewEntrepreneurRequest(requestId, { status: "approved" })), [resolveItem]);

    const openReject = useCallback((request) => setRejectTarget(request), []);
    const closeReject = useCallback(() => setRejectTarget(null), []);

    // El motivo es opcional; si se indica, viaja en el correo que recibe el solicitante
    const confirmReject = useCallback(async (reason) => {
        await resolveItem(
            rejectTarget.id,
            () => reviewEntrepreneurRequest(rejectTarget.id, { status: "rejected", rejection_reason: reason }),
            { rethrow: true }
        );
        setRejectTarget(null);
    }, [resolveItem, rejectTarget]);

    return { ...queue, approve, rejectTarget, openReject, closeReject, confirmReject };
}

export function usePresenceRequestQueue() {
    const queue = useReviewQueue(loadPendingPresenceRequests);
    const { resolveItem } = queue;

    const approve = useCallback((requestId) => resolveItem(requestId, () => reviewPresenceRequest(requestId, "approved")), [resolveItem]);
    const reject = useCallback((requestId) => resolveItem(requestId, () => reviewPresenceRequest(requestId, "rejected")), [resolveItem]);

    return { ...queue, approve, reject };
}

export function useReportedOpinionQueue() {
    const queue = useReviewQueue(loadReportedOpinions);
    const { resolveItem } = queue;

    const keepOpinion = useCallback((opinionId) => resolveItem(opinionId, () => dismissOpinionReport(opinionId)), [resolveItem]);
    const removeOpinion = useCallback(
        (opinion) => resolveItem(opinion.id, () => deleteOpinion(opinion.id), { rethrow: true }),
        [resolveItem]
    );
    const removal = useConfirmation(removeOpinion);

    return { ...queue, keepOpinion, removal };
}
