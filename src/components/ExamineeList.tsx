import { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { formatDate } from "../utils/date";

type Props = { assessmentId: string };

export default function ExamineeList({ assessmentId }: Props) {
  const [data, setData] = useState<ExamSubmission[]>([]);
  const [filtered, setFiltered] = useState<ExamSubmission[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    group: "",
    examinee: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchExamSubmissions(assessmentId).then(setData);
  }, [assessmentId]);

  useEffect(() => {
    let filtered = data;
    if (filters.group)
      filtered = filtered.filter((a) => a.group === filters.group);
    if (filters.examinee)
      filtered = filtered.filter((a) => a.username === filters.examinee);
    if (filters.status)
      filtered = filtered.filter((a) => a.status === filters.status);
    setFiltered(filtered);
    setPage(1);
  }, [data, filters]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <ExamineeFilters data={data} filters={filters} setFilters={setFilters} />
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
            <TableRow key={row.id}>
              <TableCell>
                <Button onClick={() => setSelectedStudent(row.username)}>
                  {row.username}
                </Button>
              </TableCell>
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{formatDate(row.login)}</TableCell>
              <TableCell>{formatDate(row.start)}</TableCell>
              <TableCell>{row.questionsSynced}</TableCell>
              <TableCell>{row.timeElapsed}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                {row.status === "Student Submission" && (
                  <>
                    <Button size="small" color="primary" sx={{ mr: 1 }}>
                      Reset Timer
                    </Button>
                    <Button size="small" color="secondary">
                      Restart Session
                    </Button>
                  </>
                )}
                {row.status === "Absent" && (
                  <Button size="small" color="warning">
                    Switch to Paper
                  </Button>
                )}
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
      {selectedStudent && (
        <StudentDetailsModal
          username={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </Paper>
  );
}
