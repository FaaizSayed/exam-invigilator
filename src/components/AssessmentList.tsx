import { useState, useEffect } from "react";
import type { Exam } from "../types/assessment";
import { getAssessments } from "../api/assessments";
import Filters from "./AssessmentFilters";
import Pagination from "./Pagination";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Button,
  Snackbar,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "../utils/date";
import { Visibility, Sync, CheckCircle, Schedule, PlayArrow } from "@mui/icons-material";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const getIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle fontSize="small" color="success" />;
    case 'In Progress':
      return <PlayArrow fontSize="small" color="primary" />;
    case 'Pending':
      return <Schedule fontSize="small" color="warning" />;
    case 'Synced':
      return <CheckCircle fontSize="small" color="success" />;
    default:
      return null;
  }
};

const getColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'primary';
    case 'Pending':
      return 'warning';
    case 'Synced':
      return 'success';
    default:
      return 'default';
  }
};

export default function AssessmentTable() {
  const { t } = useLanguage();
  const [data, setData] = useState<Exam[]>([]);
  const [filtered, setFiltered] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    area: "",
    program: "",
    course: "",
    status: "",
  });

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAssessments();
        if (mounted) {
          setData(result);
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

  useEffect(() => {
    let result = data;
    
    if (filters.area) {
      result = result.filter((a) => a.area === filters.area);
    }
    if (filters.program) {
      result = result.filter((a) => a.program === filters.program);
    }
    if (filters.course) {
      result = result.filter((a) => a.course === filters.course);
    }
    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    
    setFiltered(result);
    setPage(1);
  }, [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSync = async (assessmentId: string) => {
    if (syncingIds.has(assessmentId)) return;
    
    setSyncingIds(prev => new Set(prev).add(assessmentId));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setData(prev => prev.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, status: "Synced" as const }
          : assessment
      ));
      
      setSnackbar(t('assessment.sync.success'));
    } catch (err) {
      console.error('Sync failed:', err);
      setSnackbar(t('assessment.sync.failed'));
    } finally {
      setSyncingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(assessmentId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          backgroundColor: '#f8fafc',
          borderRadius: 3,
          color: '#374151',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {t('assessment.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
          {error}
        </Typography>
        <Button 
          variant="contained"
          size="small" 
          onClick={() => window.location.reload()}
          sx={{ 
            mt: 1,
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            }
          }}
        >
          {t('assessment.retry')}
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: 3,
          border: '2px dashed #cbd5e1',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: '#475569', fontWeight: 600 }}>
          {t('assessment.no.found')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {t('assessment.no.found.desc')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          backgroundColor: '#6366f1',
          borderRadius: '12px 12px 0 0',
          zIndex: 0,
        }}
      />
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ mb: 3, position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1,
              color: '#6366f1',
              fontWeight: 700,
            }}
          >
            {t('assessment.dashboard')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('assessment.manage')}
          </Typography>
        </Box>

        <Filters data={data} filters={filters} setFilters={setFilters} />
        
        {filtered.length === 0 && data.length > 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              backgroundColor: '#3b82f6',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
            }}
          >
            {t('assessment.no.match')}
          </Alert>
        )}
        
        <Table size="medium" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('area')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('start.date')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('end.date')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('status')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => (
              <TableRow 
                key={row.id} 
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.area}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.program} • {row.course}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {format(row.startDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {format(row.endDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getIcon(row.status)}
                    <Chip 
                      label={t(`status.${row.status.toLowerCase().replace(' ', '.')}`)} 
                      color={getColor(row.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        '&.MuiChip-colorSuccess': {
                          backgroundColor: '#10b981',
                          color: 'white',
                        },
                        '&.MuiChip-colorPrimary': {
                          backgroundColor: '#6366f1',
                          color: 'white',
                        },
                        '&.MuiChip-colorWarning': {
                          backgroundColor: '#f59e0b',
                          color: 'white',
                        },
                      }}
                    />
                    {syncingIds.has(row.id) && (
                      <CircularProgress size={16} sx={{ color: '#6366f1' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title={t('assessment.view.submissions')}>
                      <IconButton
                        component={Link}
                        to={`/track-exam/${row.id}`}
                        size="small"
                        sx={{
                          color: '#6366f1',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('assessment.sync')}>
                      <IconButton
                        onClick={() => handleSync(row.id)}
                        disabled={syncingIds.has(row.id)}
                        size="small"
                        sx={{
                          color: '#10b981',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          },
                          '&:disabled': {
                            color: '#d1d5db',
                          },
                        }}
                      >
                        <Sync />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Pagination
          count={filtered.length}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      </Paper>
      
      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(null)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
