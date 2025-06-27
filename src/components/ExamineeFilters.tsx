import type { ExamSubmission } from "../types/examSubmission";
import { Box, TextField, MenuItem, Stack } from "@mui/material";

type Filters = {
  group: string;
  examinee: string;
  status: string;
};

type Props = {
  data: ExamSubmission[];
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
};

export default function ExamineeFilters({ data, filters, setFilters }: Props) {
  const groups = Array.from(new Set(data.map((a) => a.group)));
  const examinees = Array.from(new Set(data.map((a) => a.username)));
  const statuses = Array.from(new Set(data.map((a) => a.status)));

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Group"
          value={filters.group || ""}
          onChange={(e) => setFilters((f) => ({ ...f, group: e.target.value }))}
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {groups.map((g) => (
            <MenuItem value={g} key={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Examinee"
          value={filters.examinee || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, examinee: e.target.value }))
          }
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {examinees.map((e) => (
            <MenuItem value={e} key={e}>
              {e}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={filters.status || ""}
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
