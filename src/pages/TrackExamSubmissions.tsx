import { useParams, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import StudentTable from "../components/ExamineeList";
import { useLanguage } from "../contexts/LanguageContext";

export default function TrackExamSubmissions() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { t } = useLanguage();

  if (!assessmentId) {
    return <div>Assessment ID is required</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{
            borderColor: '#6366f1',
            color: '#6366f1',
            '&:hover': {
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          {t('back.to.assessments')}
        </Button>
        <Box>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('track.exam.submissions')}
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#6b7280',
            fontSize: '1rem',
          }}>
            Assessment ID: {assessmentId}
          </p>
        </Box>
      </Box>
      <StudentTable assessmentId={assessmentId} />
    </Box>
  );
}
