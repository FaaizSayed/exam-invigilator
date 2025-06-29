import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";
import DownloadedAssessments from "./pages/DownloadedAssessments";
import TrackExamSubmissions from "./pages/TrackExamSubmissions";

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function AppContent() {
  const { t } = useLanguage();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: '#1976d2',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {t('app.title')}
            </Typography>
            <LanguageSelector />
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 3, minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<DownloadedAssessments />} />
            <Route path="/track-exam/:assessmentId" element={<TrackExamSubmissions />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
