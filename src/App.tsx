import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DownloadedAssessments from "./pages/DownloadedAssessments";
import TrackExamSubmissions from "./pages/TrackExamSubmissions";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// TODO: Move theme configuration to separate file
// FIXME: Add dark mode support
const theme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* TODO: Add error boundary */}
        <Container maxWidth="lg" style={{ padding: "2rem 0" }}>
          <Routes>
            <Route path="/" element={<DownloadedAssessments />} />
            <Route
              path="/track-exam/:assessmentId"
              element={<TrackExamSubmissions />}
            />
            {/* TODO: Add 404 route */}
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
