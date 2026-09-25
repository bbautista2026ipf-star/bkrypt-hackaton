import useAsyncData from "./useAsyncData.js";
import { getSchedules } from "../services/schedule.service.js";
import { buildFairDays } from "../lib/fairs.js";

const HOME_FAIRS_LIMIT = 3;

// Para la portada: próximas jornadas de feria (el backend ya devuelve solo horarios que no terminaron)
const loadUpcomingFairs = async () => {
    const { schedules } = await getSchedules();
    return buildFairDays(schedules).slice(0, HOME_FAIRS_LIMIT);
};

function useUpcomingFairs() {
    const { data, status, error, reload } = useAsyncData(loadUpcomingFairs);
    return { fairDays: data ?? [], status, error, reload };
}

export default useUpcomingFairs;
