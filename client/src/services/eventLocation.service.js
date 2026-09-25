import { apiRequest } from "./apiClient.js";

// Ubicaciones de ferias: públicas para consultar; solo el administrador crea, edita y elimina
export const getEventLocations = () => apiRequest("/event-locations");

export const createEventLocation = (eventLocation) => apiRequest("/event-locations", { method: "POST", body: eventLocation });

export const updateEventLocation = (eventLocationId, changes) => apiRequest(`/event-locations/${eventLocationId}`, { method: "PUT", body: changes });

export const deleteEventLocation = (eventLocationId) => apiRequest(`/event-locations/${eventLocationId}`, { method: "DELETE" });
