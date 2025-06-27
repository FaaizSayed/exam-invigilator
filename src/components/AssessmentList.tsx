import { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/date";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function AssessmentList() {
  const [data, setData] = useState<Assessment[]>([]);
  const [filtered, setFiltered] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    area: "",
    program: "",
    course: "",
    status: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchAssessments()
      .then(setData)
      .catch(() => setError("Failed to load assessments"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = data;
    if (filters.area)
      filtered = filtered.filter((a) => a.area === filters.area);
    if (filters.program)
      filtered = filtered.filter((a) => a.program === filters.program);
    if (filters.course)
      filtered = filtered.filter((a) => a.course === filters.course);
    if (filters.status)
      filtered = filtered.filter((a) => a.status === filters.status);
    setFiltered(filtered);
    setPage(1);
  }, [data, filters]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <AssessmentFilters
        data={data}
        filters={filters}
        setFilters={setFilters}
      />
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
            <TableRow key={row.id}>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{formatDate(row.startDate)}</TableCell>
              <TableCell>{formatDate(row.endDate)}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <Link to={`/track-exam/${row.id}`}>Monitor</Link>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => setSnackbar("Submissions synced!")}
                  disabled={row.status === "Synced"}
                >
                  Sync Submissions
                </Button>
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
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Paper>
  );
}
