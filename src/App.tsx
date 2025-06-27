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

const theme = createTheme({
  direction: "ltr",
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" style={{ padding: "2rem 0" }}>
          <Routes>
            <Route path="/" element={<DownloadedAssessments />} />
            <Route
              path="/track-exam/:assessmentId"
              element={<TrackExamSubmissions />}
            />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
