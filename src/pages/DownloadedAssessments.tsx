import AssessmentList from "../components/AssessmentList";
import { Typography } from "@mui/material";

export default function DownloadedAssessments() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Downloaded Assessments
      </Typography>
      <AssessmentList />
    </>
  );
}
