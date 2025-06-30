import { useParams, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import StudentList from "../components/StudentList";
import { useLanguage } from "../contexts/LanguageContext";

export default function TrackExamSubmissions() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { t } = useLanguage();

  if (!assessmentId) {
    return <div>Assessment ID is required</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{
            borderColor: '#6366f1',
            marginBottom: '1rem',
            color: '#6366f1',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#6366f1',
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
            color: '#333333',
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
      <StudentList assessmentId={assessmentId} />
    </Box>
  );
}
