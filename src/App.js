import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MessageProvider } from "./contexts/MessageContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ParticipantsAdminPage from "./pages/ParticipantsAdminPage";
import ParticipantsUserPage from "./pages/ParticipantsUserPage";
import SpinningPage from "./pages/SpinningPage";
import ProtectedRoute from "./components/ProtectedRoute";
import theme from "./styles/theme";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/participants/:eventId" element={<ParticipantsAdminPage />} />
              </Route>

              {/* Public Routes */}
              <Route path="/e/:shortName" element={<ParticipantsUserPage />} />
              <Route path="/spin/:shortName" element={<SpinningPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
