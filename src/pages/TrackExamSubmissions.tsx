import { useParams, Link } from "react-router-dom";
import ExamineeList from "../components/ExamineeList";
import { Button, Typography } from "@mui/material";

export default function TrackExamSubmissions() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Track Exam Submissions
      </Typography>
      <Button component={Link} to="/" variant="outlined" sx={{ mb: 2 }}>
        Back to Assessments
      </Button>
      {assessmentId && <ExamineeList assessmentId={assessmentId} />}
    </>
  );
}
