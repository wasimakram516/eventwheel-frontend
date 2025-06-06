import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Confetti from "react-confetti";
import { getParticipantsByShortName } from "../services/participantService";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// ✅ Import Backgrounds & Button Images
import bgLarge from "../assets/stageBig-1920x1080.jpg";
import bgSmall from "../assets/stage-1080x1920.jpg";
import btnSpin from "../assets/icons and assets/freespin1.png";
import btnSpinClicked from "../assets/icons and assets/freespin2.png";
import { useMessage } from "../contexts/MessageContext";

const SpinningPage = () => {
  const { shortName } = useParams();
  const [participants, setParticipants] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [wheelKey, setWheelKey] = useState(0); // 🔄 Force Re-render of the Wheel
  const wheelRef = useRef(null);
  const { showMessage } = useMessage();

  // ✅ Fetch Participants
  const fetchParticipants = useCallback(async () => {
    try {
      const data = await getParticipantsByShortName(shortName);
      if (!data || data.length === 0) {
        showMessage("No participants found! Redirecting...", "info");
        window.location.href = "/";
        return;
      }
      setParticipants(data.map((p) => p.name));
    } catch (error) {
      console.error("Failed to fetch participants", error);
    }
  }, [shortName, showMessage]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // ✅ Reset the Wheel to Default State
  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none"; // 🔄 Remove animation
      wheelRef.current.style.transform = "rotate(0deg)"; // 🔄 Reset rotation
    }
    setWheelKey((prevKey) => prevKey + 1); // 🔄 Force re-render
  };

  // ✅ Handle Spin (Reset Wheel Before Spinning)
  const handleSpinWheel = async () => {
    if (spinning || participants.length === 0) return;

    setSpinning(true);
    setSelectedWinner(null);

    // 🔄 Reset Wheel Before Spinning Again
    resetWheel();

    // 🔄 Fetch Updated Participants
    await fetchParticipants();

    if (participants.length === 0) {
      setSpinning(false);
      return;
    }

    const totalSpins = 6; // Fixed number of spins
    const sectorSize = 360 / participants.length;
    const winnerIndex = Math.floor(Math.random() * participants.length); // Random winner

    // 🎯 Calculate Final Rotation to Align Winner under Pointer
    const finalAngle = 360 - winnerIndex * sectorSize - sectorSize / 2;
    const totalRotation = totalSpins * 360 + finalAngle; // Always clockwise

    setTimeout(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = "transform 4s ease-out";
        wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
      }
    }, 100); // ⏳ Small delay to ensure reset is applied

    setTimeout(() => {
      setSelectedWinner(participants[winnerIndex]);
      setSpinning(false);
    }, 4100);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundImage: { xs: `url(${bgSmall})`, sm: `url(${bgLarge})` },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {selectedWinner && <Confetti numberOfPieces={500} recycle={false} />}

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "white" }}>
        {selectedWinner
          ? `Winner: ${selectedWinner}`
          : spinning
          ? "Spinning... Good Luck!"
          : "Spin the Wheel!"}
      </Typography>

      {/* 🎯 Enhanced Pointer Indicator (Now at the top, pointing downward) */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%) rotate(180deg)",
          width: "50px",
          height: "50px",
          backgroundColor: "primary.main",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          zIndex: 10,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.9)",
        }}
      />

      {/* 🎡 Spinning Wheel with Borders */}
      <Box
        sx={{
          position: "relative",
          width: 350,
          height: 350,
        }}
      >
        {/* 🎡 The Wheel */}
        <Box
          key={wheelKey} // 🔄 Force Re-render when Wheel Resets
          ref={wheelRef}
          sx={{
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: "6px solid #fff",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
            background: `conic-gradient(${participants
              .map(
                (_, i) =>
                  `hsl(${(i * 360) / participants.length}, 70%, 50%) ${
                    i * (360 / participants.length)
                  }deg ${(i + 1) * (360 / participants.length)}deg`
              )
              .join(", ")})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: spinning ? "transform 4s ease-out" : "none",
          }}
        >
          {/* 🏷️ Display Names inside the Wheel */}
          {participants.map((name, index) => {
            const angle = (index * 360) / participants.length;
            const fontSize = participants.length > 10 ? "8px" : "10px";
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  position: "absolute",
                  transform: `rotate(${angle}deg) translate(110px) rotate(-${angle}deg)`,
                  transformOrigin: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: fontSize,
                  textAlign: "center",
                  width: "80px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "4px",
                  padding: "2px 4px",
                }}
              >
                {name}
              </Typography>
            );
          })}
        </Box>

        {/* 🏆 Enhanced Center Icon */}
        <EmojiEventsIcon
          sx={{
            fontSize: 60,
            color: "gold",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 11,
            textShadow: "0px 6px 12px rgba(0, 0, 0, 0.6)",
          }}
        />
      </Box>

      {/* ✅ Spin Button with Dynamic Background */}
      <Button
        onClick={handleSpinWheel}
        disabled={spinning}
        sx={{
          width: 150,
          height: 50,
          mt: 4,
          backgroundImage: `url(${spinning ? btnSpinClicked : btnSpin})`, // 🔥 Switch on Click
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          "&:hover": { opacity: 0.8 },
        }}
      />
    </Box>
  );
};

export default SpinningPage;
