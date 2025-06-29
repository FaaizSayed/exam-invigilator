import { useState, useEffect, useMemo, useCallback } from "react";
import type { ExamSubmission } from "../types/examSubmission";
import { fetchExamSubmissions } from "../api/examSubmissions";
import ExamineeFilters from "./ExamineeFilters";
import Pagination from "./Pagination";
import StudentDetailsModal from "./StudentDetailsModal";
import {
  Button,
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
  Tooltip,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { formatDate } from "../utils/date";
import { 
  Person, 
  Timer, 
  RestartAlt, 
  Assignment, 
  CheckCircle, 
  Warning,
  PlayArrow,
  Stop
} from "@mui/icons-material";

type Props = { assessmentId: string };

const DEFAULT_PAGE_SIZE = 10;

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle fontSize="small" color="success" />;
    case 'In Progress':
      return <PlayArrow fontSize="small" color="primary" />;
    case 'Student Submission':
      return <Warning fontSize="small" color="warning" />;
    case 'Absent':
      return <Stop fontSize="small" color="error" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string): 'success' | 'primary' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'Student Submission': return 'warning';
    case 'Absent': return 'error';
    default: return 'default';
  }
};

export default function ExamineeList({ assessmentId }: Props) {
  const [data, setData] = useState<ExamSubmission[]>([]);
  const [filtered, setFiltered] = useState<ExamSubmission[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    group: "",
    examinee: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchExamSubmissions(assessmentId);
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
    loadData();
    return () => {
      mounted = false;
    };
  }, [assessmentId]);

  const filteredData = useMemo(() => {
    let result = data;
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
    return result;
  }, [data, filters]);

  useEffect(() => {
    setFiltered(filteredData);
    setPage(1);
  }, [filteredData]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleAction = useCallback(async (action: string, submissionId: string) => {
    if (actionLoading.has(submissionId)) return;
    setActionLoading(prev => new Set(prev).add(submissionId));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      if (Math.random() < 0.15) {
        throw new Error(`${action} failed - please try again`);
      }
      setData(prev => prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, status: 'In Progress' as const }
          : submission
      ));
      console.log(`${action} completed for submission ${submissionId}`);
    } catch (err) {
      console.error(`${action} failed:`, err);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  }, [actionLoading]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Loading Submissions...
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
          '& .MuiAlert-icon': { fontSize: '2rem' },
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
            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
            '&:hover': {
              background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
            }
          }}
        >
          Retry
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: 3,
          border: '2px dashed #cbd5e1',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: '#475569', fontWeight: 600 }}>
          No submissions found for this assessment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          Students will appear here once they start their exam.
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
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          borderRadius: '12px 12px 0 0',
          zIndex: 0,
        }}
      />
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
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
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Student Submissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage student exam progress
          </Typography>
        </Box>

        <ExamineeFilters data={data} filters={filters} setFilters={setFilters} />
        
        {filtered.length === 0 && data.length > 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' },
            }}
          >
            No submissions match your current filters.
          </Alert>
        )}
        
        <Table size="medium" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Login Time</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Time Elapsed</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((row) => (
              <TableRow 
                key={row.id} 
                hover
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f8fafc, #f1f5f9)',
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
                        background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
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
                          textTransform: 'none',
                          fontWeight: 600,
                          color: '#1e293b',
                          p: 0,
                          minWidth: 'auto',
                          '&:hover': {
                            background: 'transparent',
                            color: '#6366f1',
                          },
                        }}
                      >
                        {row.username}
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        {row.fullName}
                      </Typography>
                      <Chip 
                        label={`Group ${row.group}`} 
                        size="small" 
                        sx={{ 
                          mt: 0.5,
                          background: 'linear-gradient(45deg, #f1f5f9, #e2e8f0)',
                          color: '#475569',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(row.login)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(row.start)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.questionsSynced}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      questions
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Timer fontSize="small" sx={{ color: '#6366f1' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.timeElapsed} min
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(row.status)}
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        '&.MuiChip-colorSuccess': {
                          background: 'linear-gradient(45deg, #10b981, #059669)',
                          color: 'white',
                        },
                        '&.MuiChip-colorPrimary': {
                          background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                          color: 'white',
                        },
                        '&.MuiChip-colorWarning': {
                          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                          color: 'white',
                        },
                        '&.MuiChip-colorError': {
                          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                          color: 'white',
                        },
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {row.status === "Student Submission" && (
                    <Box display="flex" gap={1}>
                      <Tooltip title="Reset Timer">
                        <IconButton
                          size="small"
                          disabled={actionLoading.has(row.id)}
                          onClick={() => handleAction('Reset Timer', row.id)}
                          sx={{
                            background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #4f46e5, #3730a3)',
                              transform: 'scale(1.05)',
                            },
                            '&:disabled': {
                              background: '#e5e7eb',
                              color: '#9ca3af',
                            },
                          }}
                        >
                          <Timer fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Restart Session">
                        <IconButton
                          size="small"
                          disabled={actionLoading.has(row.id)}
                          onClick={() => handleAction('Restart Session', row.id)}
                          sx={{
                            background: 'linear-gradient(45deg, #ec4899, #db2777)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #db2777, #be185d)',
                              transform: 'scale(1.05)',
                            },
                            '&:disabled': {
                              background: '#e5e7eb',
                              color: '#9ca3af',
                            },
                          }}
                        >
                          <RestartAlt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {row.status === "Absent" && (
                    <Tooltip title="Switch to Paper">
                      <IconButton
                        size="small"
                        disabled={actionLoading.has(row.id)}
                        onClick={() => handleAction('Switch to Paper', row.id)}
                        sx={{
                          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #d97706, #b45309)',
                            transform: 'scale(1.05)',
                          },
                          '&:disabled': {
                            background: '#e5e7eb',
                            color: '#9ca3af',
                          },
                        }}
                      >
                        <Assignment fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {row.status === "Completed" && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No actions available
                    </Typography>
                  )}
                  {actionLoading.has(row.id) && (
                    <CircularProgress size={20} sx={{ color: '#6366f1' }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filtered.length > 0 && (
          <Pagination
            count={filtered.length}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        )}
        
        {selectedStudent && (
          <StudentDetailsModal
            username={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </Paper>
    </Box>
  );
}
