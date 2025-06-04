import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";
import ShareEventModal from "../components/ShareEventModal";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { useMessage } from "../contexts/MessageContext";
import background from "../assets/prize-1080x1920.jpg";

const eventTypes = [
  { label: "Collect Info (Admin adds names)", value: "collect_info" },
  {
    label: "Enter Names (Participants enter their names)",
    value: "enter_names",
  },
];

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventShortName, setSelectedEventShortName] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    type: "collect_info",
  });

  const { showMessage } = useMessage(); // ✅ Use Message Context for notifications
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventList = await getEvents();
      setEvents(eventList);
    } catch (error) {
      showMessage(error.message, "error"); // ✅ Show error if fetching fails
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // ✅ Ensure `fetchEvents` only runs once on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenModal = (event = null) => {
    setSelectedEvent(event);
    setForm(
      event
        ? { name: event.name, shortName: event.shortName, type: event.type }
        : { name: "", shortName: "", type: "collect_info" }
    );
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShortName = (shortName) => {
    return shortName.toLowerCase().trim().replace(/\s+/g, "-");
  };

  // ✅ Save Event (Create or Update)
  const handleSaveEvent = async () => {
    try {
      const formattedShortName = validateShortName(form.shortName);
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, {
          ...form,
          shortName: formattedShortName,
        });
        showMessage("Event updated successfully!", "success"); // ✅ Success Message
      } else {
        await createEvent({ ...form, shortName: formattedShortName });
        showMessage("Event created successfully!", "success"); // ✅ Success Message
      }
      fetchEvents();
      setOpenModal(false);
    } catch (error) {
      showMessage(error.message, "error"); // ✅ Show error if event creation/update fails
    }
  };

  // ✅ Open Delete Confirmation Modal
  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setConfirmDelete(true);
  };

  // ✅ Confirm Delete Event
  const confirmDeleteEvent = async () => {
    try {
      if (selectedEvent && selectedEvent._id) {
        await deleteEvent(selectedEvent._id);
        showMessage("Event deleted successfully!", "success"); // ✅ Success Message
        fetchEvents();
      }
    } catch (error) {
      showMessage(error.message, "error"); // ✅ Show error if deletion fails
    }
    setConfirmDelete(false);
    setSelectedEvent(null);
  };

  const handleNavigateToParticipants = (eventId) => {
    navigate(`/participants/${eventId}`);
  };

  // ✅ Open Share Event Modal
  const handleOpenShareModal = (shortName, type) => {
    setSelectedEventShortName(shortName);
    setSelectedEventType(type);

    // Open modal after setting state
    setTimeout(() => {
      setOpenShareModal(true);
    }, 0);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        mx: "auto",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Event Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ textTransform: "none", fontSize: "14px" }}
        >
          Create Event
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your events by creating, editing, sharing, and viewing
        participants.
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mt:1}}>
                <strong>Short Name:</strong> {event.shortName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mt:1}}>
                 <strong>Type:</strong>{" "}
                  {event.type === "collect_info"
                    ? "Collect Info"
                    : "Enter Names"}
                </Typography>

                <Box mt={2} display="flex" justifyContent="space-between">
                  {event.type === "collect_info" && (
                    <Tooltip title="Manage Participants">
                      <IconButton
                        onClick={() => handleNavigateToParticipants(event._id)}
                        color="secondary"
                      >
                        <PeopleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit Event">
                    <IconButton
                      onClick={() => handleOpenModal(event)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Event">
                    <IconButton
                      onClick={() => handleDeleteEvent(event)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share Event">
                    <IconButton
                      onClick={() =>
                        handleOpenShareModal(event.shortName, event.type)
                      }
                      color="success"
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ Fixed Share Modal */}
      <ShareEventModal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        eventShortName={selectedEventShortName}
        eventType={selectedEventType}
      />

      {/* Event Creation/Edit Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          {selectedEvent ? "Edit Event" : "Create Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Event Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleInputChange}
          />
          <TextField
            name="shortName"
            label="Short Name"
            fullWidth
            margin="normal"
            value={form.shortName}
            onChange={handleInputChange}
          />
          <TextField
            name="type"
            label="Event Type"
            select
            fullWidth
            margin="normal"
            value={form.type}
            onChange={handleInputChange}
          >
            {eventTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEvent}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={confirmDeleteEvent}
        title="Delete Event?"
        message="Are you sure you want to delete this event? This action can not be undone."
        confirmButtonText="Delete"
      />
    </Box>
  );
};

export default Dashboard;
