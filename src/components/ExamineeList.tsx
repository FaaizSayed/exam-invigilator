import { useState, useEffect } from "react";
import type { Submission } from "../types/exam";
import ExamineeFilters from "./ExamineeFilters";
import Pagination from "./Pagination";
import StudentDetailsModal from "./StudentDetailsModal";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Button,
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
  Avatar,
} from "@mui/material";
import { Person, Refresh, RestartAlt, Description } from "@mui/icons-material";
import { getExamSubmissions } from "../Mockapis/examSubmissions";

const DEFAULT_PAGE_SIZE = 10;

const getIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Person fontSize="small" color="success" />;
    case 'In Progress':
      return <Person fontSize="small" color="primary" />;
    case 'Student Submission':
      return <Person fontSize="small" color="warning" />;
    case 'Absent':
      return <Person fontSize="small" color="error" />;
    default:
      return <Person fontSize="small" />;
  }
};

const getColor = (status: string): 'success' | 'primary' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'primary';
    case 'Student Submission':
      return 'warning';
    case 'Absent':
      return 'error';
    default:
      return 'default';
  }
};

export default function StudentTable({ assessmentId }: { assessmentId: string }) {
  const { t } = useLanguage();
  const [data, setData] = useState<Submission[]>([]);
  const [filtered, setFiltered] = useState<Submission[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    area: "",
    group: "",
    examinee: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getExamSubmissions();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load submissions:', err);
          setError(err instanceof Error ? err.message : "Failed to load submissions");
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
  }, [assessmentId]);

  useEffect(() => {
    let result = data;
    
    if (filters.area) {
      result = result.filter((a) => a.area === filters.area);
    }
    if (filters.group) {
      result = result.filter((a) => a.group === filters.group);
    }
    if (filters.examinee) {
      result = result.filter((a) => 
        a.username.toLowerCase().includes(filters.examinee.toLowerCase()) ||
        a.fullName.toLowerCase().includes(filters.examinee.toLowerCase())
      );
    }
    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    
    setFiltered(result);
    setPage(1);
  }, [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleAction = async (action: string, submissionId: string) => {
    if (actionLoading.has(submissionId)) return;
    
    setActionLoading(prev => new Set(prev).add(submissionId));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() < 0.15) {
        throw new Error(`${action} failed - please try again`);
      }
      
      setData(prev => prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, status: 'In Progress' as const }
          : submission
      ));
    } catch (err) {
      console.error(`${action} failed:`, err);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
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
        <CircularProgress size={60} sx={{ color: '#ec4899', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {t('student.loading')}
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
          {t('student.retry')}
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
          {t('student.no.found')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {t('student.no.found.desc')}
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
          backgroundColor: '#ec4899',
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
              color: '#ec4899',
              fontWeight: 700,
            }}
          >
            {t('student.submissions')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('student.monitor')}
          </Typography>
        </Box>

        <ExamineeFilters data={data} filters={filters} setFilters={setFilters} />
        
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
            {t('student.no.match')}
          </Alert>
        )}
        
        <Table size="medium" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('student')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('login.time')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('start.time')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('progress')}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{t('time.elapsed')}</TableCell>
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
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: '#6366f1',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      <Button 
                        onClick={() => setSelectedStudent(row.username)}
                        variant="text"
                        size="small"
                        sx={{ 
                          p: 0, 
                          minWidth: 'auto',
                          textTransform: 'none',
                          fontWeight: 600,
                          color: '#1e293b',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {row.fullName}
                      </Button>
                      <Typography variant="caption" color="text.secondary" display="block">
                        @{row.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.login ? new Date(row.login).toLocaleTimeString() : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.start ? new Date(row.start).toLocaleTimeString() : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.questionsSynced} / 10 {t('student.questions')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.timeElapsed} {t('student.min')}
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
                        '&.MuiChip-colorError': {
                          backgroundColor: '#ef4444',
                          color: 'white',
                        },
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title={t('student.reset.timer')}>
                      <IconButton
                        onClick={() => handleAction('Reset Timer', row.id)}
                        disabled={actionLoading.has(row.id)}
                        size="small"
                        sx={{
                          color: '#6366f1',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          },
                          '&:disabled': {
                            color: '#d1d5db',
                          },
                        }}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('student.restart.session')}>
                      <IconButton
                        onClick={() => handleAction('Restart Session', row.id)}
                        disabled={actionLoading.has(row.id)}
                        size="small"
                        sx={{
                          color: '#ec4899',
                          '&:hover': {
                            backgroundColor: 'rgba(236, 72, 153, 0.1)',
                          },
                          '&:disabled': {
                            color: '#d1d5db',
                          },
                        }}
                      >
                        <RestartAlt />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('student.switch.paper')}>
                      <IconButton
                        onClick={() => handleAction('Switch to Paper', row.id)}
                        disabled={actionLoading.has(row.id)}
                        size="small"
                        sx={{
                          color: '#f59e0b',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          },
                          '&:disabled': {
                            color: '#d1d5db',
                          },
                        }}
                      >
                        <Description />
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
        />
      </Paper>
      
      <StudentDetailsModal
        username={selectedStudent || ''}
        onClose={() => setSelectedStudent(null)}
      />
    </Box>
  );
}
