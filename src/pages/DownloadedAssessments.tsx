import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AssessmentTable from "../components/AssessmentList";
import GroupTreeView from "../components/GroupTreeView";
import { getAssessments } from "../Mockapis/assessments";
import { useLanguage } from "../contexts/LanguageContext";
import type { Exam } from "../types/exam";

export default function DownloadedAssessments() {
  const { t } = useLanguage();
  const [assessments, setAssessments] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAssessments();
        if (mounted) {
          setAssessments(result);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load assessments:', err);
          setError(err instanceof Error ? err.message : "Failed to load assessments");
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 48,
              '&.Mui-selected': {
                color: '#6366f1',
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label={t('tabs.assessment.list')} />
          <Tab label={t('tabs.group.tree')} />
        </Tabs>
      </Box>

      {activeTab === 0 && <AssessmentTable />}
      {activeTab === 1 && <GroupTreeView assessments={assessments} />}
    </Box>
  );
}
