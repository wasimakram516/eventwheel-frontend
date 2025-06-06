import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // Change to "dark" for dark mode
    primary: {
      main: "#1976d2", // ✅ Ensure this is defined
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dc004e", // ✅ Ensure this is defined
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#333",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif", // Default text font
    h1: {
      fontFamily: "'Comfortaa', cursive", // Headings
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Comfortaa', cursive",
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Comfortaa', cursive",
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontFamily: "'Montserrat', sans-serif",
    },
    body2: {
      fontSize: "0.875rem",
      fontFamily: "'Montserrat', sans-serif",
    },
    button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
    },
  },
});

export default theme;
