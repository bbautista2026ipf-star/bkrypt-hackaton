import { apiRequest } from "./apiClient.js";

export const getEvents = () => apiRequest("/events");

export const createEvent = (event) => apiRequest("/events", { method: "POST", body: event });

export const deleteEvent = (eventId) => apiRequest(`/events/${eventId}`, { method: "DELETE" });

export const requestPresence = (eventId) => apiRequest(`/events/${eventId}/presence-requests`, { method: "POST" });

export const getEventLocations = () => apiRequest("/event-locations");

export const createEventLocation = (eventLocation) => apiRequest("/event-locations", { method: "POST", body: eventLocation });

export const deleteEventLocation = (eventLocationId) => apiRequest(`/event-locations/${eventLocationId}`, { method: "DELETE" });
