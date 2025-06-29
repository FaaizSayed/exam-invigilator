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
} from "@mui/material";
import { formatDate } from "../utils/date";

type Props = { assessmentId: string };

const DEFAULT_PAGE_SIZE = 10;

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

  const getStatusColor = (status: string): 'success' | 'primary' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Student Submission': return 'warning';
      case 'Absent': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading submissions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="body2">{error}</Typography>
        <Button 
          size="small" 
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No submissions found for this assessment
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <ExamineeFilters data={data} filters={filters} setFilters={setFilters} />
      {filtered.length === 0 && data.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No submissions match your current filters.
        </Alert>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>Questions Synced</TableCell>
            <TableCell>Time Elapsed (min)</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Button 
                  onClick={() => setSelectedStudent(row.username)}
                  variant="text"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  {row.username}
                </Button>
              </TableCell>
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{formatDate(row.login)}</TableCell>
              <TableCell>{formatDate(row.start)}</TableCell>
              <TableCell>
                <Tooltip title={`${row.questionsSynced} questions synchronized`}>
                  <span>{row.questionsSynced}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{row.timeElapsed}</TableCell>
              <TableCell>
                <Chip 
                  label={row.status} 
                  color={getStatusColor(row.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {row.status === "Student Submission" && (
                  <Box display="flex" gap={1}>
                    <Button 
                      size="small" 
                      color="primary"
                      disabled={actionLoading.has(row.id)}
                      onClick={() => handleAction('Reset Timer', row.id)}
                    >
                      {actionLoading.has(row.id) ? 'Resetting...' : 'Reset Timer'}
                    </Button>
                    <Button 
                      size="small" 
                      color="secondary"
                      disabled={actionLoading.has(row.id)}
                      onClick={() => handleAction('Restart Session', row.id)}
                    >
                      Restart
                    </Button>
                  </Box>
                )}
                {row.status === "Absent" && (
                  <Button 
                    size="small" 
                    color="warning"
                    disabled={actionLoading.has(row.id)}
                    onClick={() => handleAction('Switch to Paper', row.id)}
                  >
                    {actionLoading.has(row.id) ? 'Switching...' : 'Switch to Paper'}
                  </Button>
                )}
                {row.status === "Completed" && (
                  <Typography variant="caption" color="text.secondary">
                    No actions available
                  </Typography>
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
  );
}
