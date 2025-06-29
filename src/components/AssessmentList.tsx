import { useState, useEffect, useMemo, useCallback } from "react";
import type { Assessment } from "../types/assessment";
import { fetchAssessments } from "../api/assessments";
import AssessmentFilters from "./AssessmentFilters";
import Pagination from "./Pagination";
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
import { formatDate } from "../utils/date";
import { Visibility, Sync, CheckCircle, Schedule, PlayArrow } from "@mui/icons-material";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SYNC_DELAY = 2000;

const getStatusIcon = (status: string) => {
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

const getStatusColor = (status: string) => {
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

export default function AssessmentList() {
  const [data, setData] = useState<Assessment[]>([]);
  const [filtered, setFiltered] = useState<Assessment[]>([]);
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
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchAssessments();
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

    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
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

  const handleSync = useCallback(async (assessmentId: string) => {
    if (syncingIds.has(assessmentId)) return;
    
    setSyncingIds(prev => new Set(prev).add(assessmentId));
    
    try {
      await new Promise(resolve => setTimeout(resolve, SYNC_DELAY));
      
      setData(prev => prev.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, status: "Synced" as const }
          : assessment
      ));
      
      setSnackbar("Submissions synced successfully!");
    } catch (err) {
      console.error('Sync failed:', err);
      setSnackbar("Failed to sync submissions. Please try again.");
    } finally {
      setSyncingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(assessmentId);
        return newSet;
      });
    }
  }, [syncingIds]);

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
          Loading Assessments...
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
          No assessments found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          Try adjusting your filters or check back later for new assessments.
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Assessment Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your exam assessments
          </Typography>
        </Box>

        <AssessmentFilters
          data={data}
          filters={filters}
          setFilters={setFilters}
        />
        
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
            No assessments match your current filters.
          </Alert>
        )}
        
        <Table size="medium" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Area</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Assessment</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>End Date</TableCell>
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
                    {formatDate(row.startDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(row.endDate)}
                  </Typography>
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
                      }}
                    />
                    {syncingIds.has(row.id) && (
                      <CircularProgress size={16} sx={{ color: '#6366f1' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1} alignItems="center">
                    <Tooltip title="Monitor Examinees">
                      <IconButton
                        component={Link}
                        to={`/track-exam/${row.id}`}
                        size="small"
                        sx={{
                          background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #4f46e5, #3730a3)',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Button
                      size="small"
                      onClick={() => handleSync(row.id)}
                      disabled={row.status === "Synced" || syncingIds.has(row.id)}
                      variant={row.status === "Synced" ? "outlined" : "contained"}
                      startIcon={row.status === "Synced" ? <CheckCircle /> : <Sync />}
                      sx={{
                        ...(row.status === "Synced" ? {
                          borderColor: '#10b981',
                          color: '#10b981',
                          '&:hover': {
                            borderColor: '#059669',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          },
                        } : {
                          background: 'linear-gradient(45deg, #ec4899, #db2777)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #db2777, #be185d)',
                          },
                        }),
                      }}
                    >
                      {syncingIds.has(row.id) ? "Syncing..." : "Sync"}
                    </Button>
                  </Box>
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
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        )}
        
        <Snackbar
          open={!!snackbar}
          autoHideDuration={4000}
          onClose={() => setSnackbar(null)}
          message={snackbar}
          sx={{
            '& .MuiSnackbarContent-root': {
              background: 'linear-gradient(45deg, #10b981, #059669)',
              borderRadius: 2,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
