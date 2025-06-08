import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  getParticipants,
  addParticipant,
  deleteParticipant,
} from "../services/participantService";
import { getEventById } from "../services/eventService";
import { useMessage } from "../contexts/MessageContext";

import background from "../assets/prize-1080x1920.jpg";
import imgDivider from "../assets/icons and assets/divider.png";
import ConfirmationDialog from "../components/ConfirmationDialog";

const ParticipantsAdminPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { showMessage } = useMessage();

  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", company: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);

  // 🔹 Fetch Event and Participants Data
  const fetchData = useCallback(async () => {
    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      showMessage("Failed to fetch event details", "error");
    }
  }, [eventId, showMessage]);

  const fetchParticipants = useCallback(async () => {
    try {
      const participantsData = await getParticipants(eventId);
      setParticipants(participantsData);
    } catch (error) {
      showMessage("Failed to fetch participants", "error");
    }
  }, [eventId, showMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Add Participant
  const handleAddParticipant = async () => {
    try {
      await addParticipant(eventId, form);
      setForm({ name: "", phone: "", company: "" }); // Reset form
      showMessage("Participant added successfully!", "success");
      fetchParticipants(); // Refresh list
    } catch (error) {
      showMessage("Failed to add participant", "error");
    }
  };

  // 🔹 Delete Participant
  const handleDeleteParticipant = async () => {
    try {
      await deleteParticipant(selectedParticipant);
      setParticipants((prev) =>
        prev.filter((p) => p._id !== selectedParticipant)
      );
      showMessage("Participant deleted successfully!", "success");
    } catch (error) {
      showMessage("Failed to delete participant", "error");
    }
    setConfirmDelete(false);
    setSelectedParticipant(null);
  };

  if (!event) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        p: 4,
      }}
    >
      {/* Home Icon */}
      <Box
        sx={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => navigate("/admin")}
      >
        <IconButton>
          <HomeIcon fontSize="large" sx={{ color: "primary.main" }} />
        </IconButton>
      </Box>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Welcome to {event.name}
      </Typography>

      <Box
        component="img"
        src={imgDivider}
        sx={{ height: "30px", width: "auto", maxWidth: "300px", my: 2 }}
      />

      <Typography variant="body1" sx={{ mb: 2 }}>
        Ready to try your <strong>luck</strong>?
      </Typography>

      {/* 🔹 Participant Entry Fields */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <TextField
          fullWidth
          name="name"
          label="Name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          fullWidth
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
        <TextField
          fullWidth
          name="company"
          label="Company"
          value={form.company}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, company: e.target.value }))
          }
        />

        {/* 🔹 Optimized "Add Participant" Button */}
        <Button
          onClick={handleAddParticipant}
          startIcon={<AddIcon />} // ✅ Material UI Icon
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: 2,
          }}
          variant="contained"
        >
          Add Participant
        </Button>
      </Box>

      {/* 🔹 Show Participants Button */}
      <Button
        onClick={() => {
          setShowParticipants(!showParticipants);
          if (!showParticipants) fetchParticipants(); // Only fetch when showing participants
        }}
        startIcon={<PeopleIcon />}
        sx={{
          mt: 3,
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "14px",
        }}
        variant="contained"
      >
        {showParticipants ? "Hide Participants" : "Show Participants"}
      </Button>

      {/* 🔹 Participants List (Only visible if "Show Participants" is clicked) */}
      {showParticipants && (
        <List sx={{ width: "100%", maxWidth: 400, mt: 3 }}>
          {participants.length === 0 ? (
            <Typography color="textSecondary" textAlign="center">
              No participants added yet.
            </Typography>
          ) : (
            participants.map((participant) => (
              <ListItem key={participant._id}>
                <ListItemText
                  primary={participant.name}
                  secondary={participant.phone}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Delete Participant">
                    <IconButton
                      onClick={() => {
                        setSelectedParticipant(participant._id);
                        setConfirmDelete(true);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      )}

      {/* 🔹 Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteParticipant}
        title="Delete Participant?"
        message="Are you sure you want to delete this participant? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Box>
  );
};

export default ParticipantsAdminPage;
