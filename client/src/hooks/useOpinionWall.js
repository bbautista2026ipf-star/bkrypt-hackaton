import { useCallback, useState } from "react";
import useAsyncData from "./useAsyncData.js";
import { getOpinions, reportOpinion, saveOpinion } from "../services/opinion.service.js";

const summarize = (opinions) => {
    const total = opinions.length;
    const average = total === 0 ? null : Math.round((opinions.reduce((sum, opinion) => sum + opinion.stars, 0) / total) * 10) / 10;
    return { average_rating: average, opinions_count: total };
};

// Muro de opiniones de un emprendedor: la opinión propia se agrega (o reemplaza) al instante, sin recargar
function useOpinionWall(entrepreneurId, viewerId) {
    const loadOpinions = useCallback(() => getOpinions(entrepreneurId), [entrepreneurId]);
    const { data, status, error, reload, setData } = useAsyncData(loadOpinions);
    const [reportTarget, setReportTarget] = useState(null);

    const opinions = data?.opinions ?? [];

    const submitOpinion = useCallback(async (opinionValues) => {
        const { opinion } = await saveOpinion(entrepreneurId, opinionValues);
        setData((previous) => {
            const updatedOpinions = [opinion, ...(previous?.opinions ?? []).filter((existing) => existing.id !== opinion.id)];
            return { opinions: updatedOpinions, summary: summarize(updatedOpinions) };
        });
    }, [entrepreneurId, setData]);

    const openReport = useCallback((opinion) => setReportTarget(opinion), []);
    const closeReport = useCallback(() => setReportTarget(null), []);

    const confirmReport = useCallback(async (reason) => {
        await reportOpinion(reportTarget.id, reason);
        setData((previous) => ({
            ...previous,
            opinions: previous.opinions.map((opinion) => (opinion.id === reportTarget.id ? { ...opinion, is_reported: true } : opinion))
        }));
        setReportTarget(null);
    }, [reportTarget, setData]);

    return {
        opinions,
        summary: data?.summary ?? null,
        ownOpinion: viewerId ? opinions.find((opinion) => opinion.author.id === viewerId) ?? null : null,
        hasLoaded: data !== null,
        status,
        error,
        reload,
        submitOpinion,
        reportTarget,
        openReport,
        closeReport,
        confirmReport
    };
}

export default useOpinionWall;
