import React, { useRef } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  DialogTitle,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useMessage } from "../contexts/MessageContext";

const ShareEventModal = ({ open, onClose, eventShortName, eventType }) => {
  const qrCodeRef = useRef(null);
  const { showMessage } = useMessage();

  const shareableLink =
    eventType === "collect_info"
      ? `${window.location.origin}/spin/${eventShortName}`
      : `${window.location.origin}/e/${eventShortName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      showMessage("Event link copied to clipboard!", "success");
    } catch (error) {
      showMessage("Failed to copy link.", "error");
    }
  };

  const handleDownloadQRCode = () => {
    const qrCodeCanvas = qrCodeRef.current?.querySelector("canvas");
    if (!qrCodeCanvas) {
      showMessage("QR Code generation failed.", "error");
      return;
    }
    const qrCodeDataURL = qrCodeCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = qrCodeDataURL;
    link.download = `Event-${eventShortName}-QR.png`;
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          padding: "1.5rem 2rem",
          fontSize: "1.5rem",
          color: "primary.main",
        }}
      >
        Share Event
      </DialogTitle>

      <DialogContent sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          Share this event with participants using the link or QR code below.
        </Typography>

        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #ddd",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            value={shareableLink}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box ref={qrCodeRef} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <QRCodeCanvas value={shareableLink} size={180} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadQRCode}
            startIcon={<FileDownloadIcon />}
          >
            Download QR Code
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "1rem" }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareEventModal;
