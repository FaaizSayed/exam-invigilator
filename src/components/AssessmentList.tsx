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
} from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/date";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SYNC_DELAY = 2000;

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
          console.error("Failed to load assessments:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load assessments"
          );
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

  const handleSync = useCallback(
    async (assessmentId: string) => {
      if (syncingIds.has(assessmentId)) return;

      setSyncingIds((prev) => new Set(prev).add(assessmentId));

      try {
        await new Promise((resolve) => setTimeout(resolve, SYNC_DELAY));

        setData((prev) =>
          prev.map((assessment) =>
            assessment.id === assessmentId
              ? { ...assessment, status: "Synced" as const }
              : assessment
          )
        );

        setSnackbar("Submissions synced successfully!");
      } catch (err) {
        console.error("Sync failed:", err);
        setSnackbar("Failed to sync submissions. Please try again.");
      } finally {
        setSyncingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(assessmentId);
          return newSet;
        });
      }
    },
    [syncingIds]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
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
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No assessments found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or check back later.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <AssessmentFilters
        data={data}
        filters={filters}
        setFilters={setFilters}
      />

      {filtered.length === 0 && data.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No assessments match your current filters.
        </Alert>
      )}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Area</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Monitor Examinees</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{formatDate(row.startDate)}</TableCell>
              <TableCell>{formatDate(row.endDate)}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{row.status}</span>
                  {syncingIds.has(row.id) && <CircularProgress size={16} />}
                </Box>
              </TableCell>
              <TableCell>
                <Link to={`/track-exam/${row.id}`}>Monitor</Link>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => handleSync(row.id)}
                  disabled={row.status === "Synced" || syncingIds.has(row.id)}
                  variant={row.status === "Synced" ? "outlined" : "contained"}
                >
                  {syncingIds.has(row.id) ? "Syncing..." : "Sync Submissions"}
                </Button>
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
      />
    </Paper>
  );
}
