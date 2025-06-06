import api from "./api";

// ✅ Add Participant
export const addParticipant = async (eventId, participantData) => {
  const { data } = await api.post("/participants", { ...participantData, eventId });
  return data.data;
};

// ✅ Get Participants for an Event by ShortName
export const getBulkParticipantsByShortName = async (shortName) => {
  const { data } = await api.get(`/participants/bulk/${shortName}`);
  return data.data;
};

// ✅ Add Participant in Bulk
export const addParticipantInBulk = async (shortName, participants) => {
  const payload = {
    shortName, // ✅ Directly pass shortName as a string
    participants, // ✅ Directly pass participants as an array
  };

  const { data } = await api.post("/participants/bulk", payload);
  return data.data;
};

// ✅ Get Participants for an Event
export const getParticipants = async (eventId) => {
  const { data } = await api.get(`/participants/${eventId}`);
  return data.data;
};

// ✅ Get Participants for an Event by ShortName
export const getParticipantsByShortName = async (shortName) => {
  const { data } = await api.get(`/participants/short/${shortName}`);
  return data.data;
};

// ✅ Get Single Participant
export const getParticipantById = async (participantId) => {
  const { data } = await api.get(`/participants/single/${participantId}`);
  return data.data;
};

// ✅ Update Participant
export const updateParticipant = async (participantId, participantData) => {
  const { data } = await api.put(`/participants/${participantId}`, participantData);
  return data.data;
};

// ✅ Delete Participant
export const deleteParticipant = async (participantId) => {
  await api.delete(`/participants/${participantId}`);
};
