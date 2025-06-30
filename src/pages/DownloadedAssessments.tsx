import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AssessmentTable from "../components/AssessmentList"

export default function DownloadedAssessments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
      } catch (err) {
        if (mounted) {
          console.error('Failed to load:', err);
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <AssessmentTable />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <AssessmentTable />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AssessmentTable />
    </Box>
  );
}
