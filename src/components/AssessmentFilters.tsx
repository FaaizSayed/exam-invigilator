import type { Assessment } from "../types/assessment";
import { Box, TextField, MenuItem, Stack } from "@mui/material";

type Filters = {
  area: string;
  program: string;
  course: string;
  status: string;
};

type Props = {
  data: Assessment[];
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
};

export default function AssessmentFilters({
  data,
  filters,
  setFilters,
}: Props) {
  const areas = Array.from(new Set(data.map((a) => a.area)));
  const programs = Array.from(new Set(data.map((a) => a.program)));
  const courses = Array.from(new Set(data.map((a) => a.course)));
  const statuses = Array.from(new Set(data.map((a) => a.status)));

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Area"
          value={filters.area}
          onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))}
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {areas.map((a) => (
            <MenuItem value={a} key={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Program"
          value={filters.program}
          onChange={(e) =>
            setFilters((f) => ({ ...f, program: e.target.value }))
          }
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {programs.map((p) => (
            <MenuItem value={p} key={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Course"
          value={filters.course}
          onChange={(e) =>
            setFilters((f) => ({ ...f, course: e.target.value }))
          }
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {courses.map((c) => (
            <MenuItem value={c} key={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {statuses.map((s) => (
            <MenuItem value={s} key={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
}
