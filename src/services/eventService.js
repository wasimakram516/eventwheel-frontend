import api from "./api";

// ✅ Fetch all events
export const getEvents = async () => {
  try {
    const { data } = await api.get("/events");
    return data.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch events");
  }
};

// ✅ Fetch event by eventId
export const getEventById = async (eventId) => {
  try {
    const { data } = await api.get(`/events/${eventId}`);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch event details");
  }
};

// ✅ Fetch event by Short Name (instead of eventId)
export const getEventByShortName = async (shortName) => {
  try {
    const { data } = await api.get(`/events/short/${shortName}`);
    return data.data;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch event details");
  }
};

// ✅ Create a new event (FormData to support image uploads)
export const createEvent = async (eventData) => {
  try {
    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("shortName", eventData.shortName);
    formData.append("type", eventData.type);
    if (eventData.logo) formData.append("logo", eventData.logo);
    if (eventData.background) formData.append("background", eventData.background);

    const { data } = await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

// ✅ Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("shortName", eventData.shortName);
    formData.append("type", eventData.type);
    if (eventData.logo) formData.append("logo", eventData.logo);
    if (eventData.background) formData.append("background", eventData.background);

    const { data } = await api.put(`/events/${eventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw new Error(error.response?.data?.message || "Failed to update event");
  }
};

// ✅ Delete an event
export const deleteEvent = async (eventId) => {
  try {
    await api.delete(`/events/${eventId}`);
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw new Error(error.response?.data?.message || "Failed to delete event");
  }
};
