import { apiRequest } from "./apiClient.js";

// Ubicaciones de ferias: públicas para consultar; solo el administrador crea, edita y elimina
export const getEventLocations = () => apiRequest("/event-locations");

// Jornadas oficiales de las ferias (día y horario que carga el administrador). Sin "from", solo las que no terminaron.
export const getFairSessions = (filters) => apiRequest("/fair-sessions", { query: filters });

// eventLocation.sessions: [{ start_time, end_time }] reemplaza las jornadas próximas de la feria
export const createEventLocation = (eventLocation) => apiRequest("/event-locations", { method: "POST", body: eventLocation });

export const updateEventLocation = (eventLocationId, changes) => apiRequest(`/event-locations/${eventLocationId}`, { method: "PUT", body: changes });

export const deleteEventLocation = (eventLocationId) => apiRequest(`/event-locations/${eventLocationId}`, { method: "DELETE" });
