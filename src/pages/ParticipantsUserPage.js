import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { addParticipantInBulk, getBulkParticipantsByShortName } from "../services/participantService";
import btnReady from "../assets/icons and assets/ready1.png";
import btnReadyClicked from "../assets/icons and assets/ready2.png";
import background from "../assets/prize-1080x1920.jpg";
import imgDivider from "../assets/icons and assets/divider.png";
import imgShuffle from "../assets/icons and assets/shuffle.png";
import { getEventByShortName } from "../services/eventService";

const ParticipantsUserPage = () => {
  const { shortName } = useParams();
  const [event, setEvent] = useState(null);
  const [bulkNames, setBulkNames] = useState("");
  const [loading, setLoading] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch Event & Participants Together
  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        // Fetch Event Details
        const eventData = await getEventByShortName(shortName);
        setEvent(eventData);

        // Fetch Participants
        const existingParticipants = await getBulkParticipantsByShortName(shortName);
        if (existingParticipants.length > 0) {
          setBulkNames(existingParticipants.map((p) => p.name).join("\n"));
        }
      } catch (error) {
        console.error("Error fetching event/participants:", error);
      }
    };

    fetchEventAndParticipants();
  }, [shortName]);

  // ✅ Shuffle Names Randomly
  const handleShuffleNames = () => {
    const namesArray = bulkNames.split("\n").filter((name) => name.trim() !== "");
    setBulkNames(namesArray.sort(() => Math.random() - 0.5).join("\n"));
  };

  // ✅ Submit Names to Backend (Update if Changed)
  const handleReady = async () => {
    if (!bulkNames.trim()) {
      alert("Please enter at least one participant name!");
      return;
    }

    setBtnClicked(true); // 🔥 Show Clicked Button

    const formattedNames = bulkNames.split("\n").map((name) => name.trim());

    try {
      setLoading(true);
      await addParticipantInBulk(shortName, formattedNames );
      navigate(`/spin/${shortName}`);
      navigate(`/spin/${shortName}`);
    } catch (error) {
      console.error("Failed to add participants:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setBtnClicked(false), 2000); // 🔥 Reset Button After 2 Secs
    }
  };

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
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        {event ? `Welcome to ${event.name}` : "Loading Event..."}
      </Typography>

      <Box component="img" src={imgDivider} sx={{ height: "30px", width: "auto", maxWidth: "300px", my: 2 }} />

      <Typography variant="body1" sx={{ mb: 2 }}>
        Enter the names and <strong>good luck to everyone</strong>
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        value={bulkNames}
        onChange={(e) => setBulkNames(e.target.value)}
        variant="outlined"
        placeholder="Enter names, one per line"
        sx={{
          maxWidth: 400,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* ✅ Buttons Section */}
      <Box mt={3} sx={{display:"flex", flexDirection:"column", gap:2, alignItems:"center"}}>
        {/* Shuffle Button */}
        <Button
          onClick={handleShuffleNames}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px", // Adjust padding for better spacing
            borderRadius: 2,
            backgroundColor: "transparent",
            color:"#333",
            "&:hover": { opacity: 0.8, backgroundColor: "transparent" },
          }}
        >
          <Box
            component="img"
            src={imgShuffle}
            alt="Shuffle Icon"
            sx={{
              width: 24, // Adjust icon size
              height: 24,
              marginRight: 1, // Adds spacing between icon and text
            }}
          />
          Shuffle
        </Button>

        {/* Ready Button with Dynamic Background */}
        <Button
          onClick={handleReady}
          disabled={loading}
          sx={{
            width: 150,
            height: 50,
            backgroundImage: `url(${btnClicked ? btnReadyClicked : btnReady})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            "&:hover": { opacity: 0.8 },
          }}
        />
      </Box>
    </Box>
  );
};

export default ParticipantsUserPage;
