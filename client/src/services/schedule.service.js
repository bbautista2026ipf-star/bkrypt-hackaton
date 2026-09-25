import { apiRequest } from "./apiClient.js";

// filters: { event_location_id, entrepreneur_id, from, to }. Sin "from", el backend devuelve los horarios que no terminaron.
export const getSchedules = (filters) => apiRequest("/schedules", { query: filters });

export const createSchedule = (schedule) => apiRequest("/schedules", { method: "POST", body: schedule });

export const updateSchedule = (scheduleId, schedule) => apiRequest(`/schedules/${scheduleId}`, { method: "PUT", body: schedule });

export const deleteSchedule = (scheduleId) => apiRequest(`/schedules/${scheduleId}`, { method: "DELETE" });
