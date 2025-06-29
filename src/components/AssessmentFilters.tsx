import { useMemo, useCallback } from "react";
import type { Assessment } from "../types/assessment";
import { Box, TextField, MenuItem, Stack, Typography } from "@mui/material";

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
  // Memoize filter options to prevent unnecessary re-renders
  const filterOptions = useMemo(() => {
    const areas = Array.from(new Set(data.map((a) => a.area))).sort();
    const programs = Array.from(new Set(data.map((a) => a.program))).sort();
    const courses = Array.from(new Set(data.map((a) => a.course))).sort();
    const statuses = Array.from(new Set(data.map((a) => a.status))).sort();

    return { areas, programs, courses, statuses };
  }, [data]);

  const handleFilterChange = useCallback(
    (field: keyof Filters, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    [setFilters]
  );

  // Show filter count
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Box sx={{ mb: 2 }}>
      {activeFiltersCount > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}{" "}
          active
        </Typography>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Area"
          value={filters.area}
          onChange={(e) => handleFilterChange("area", e.target.value)}
          size="small"
          style={{ minWidth: 120 }}
          disabled={filterOptions.areas.length === 0}
        >
          <MenuItem value="">All ({data.length})</MenuItem>
          {filterOptions.areas.map((area) => {
            const count = data.filter((a) => a.area === area).length;
            return (
              <MenuItem value={area} key={area}>
                {area} ({count})
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          select
          label="Program"
          value={filters.program}
          onChange={(e) => handleFilterChange("program", e.target.value)}
          size="small"
          style={{ minWidth: 120 }}
          disabled={filterOptions.programs.length === 0}
        >
          <MenuItem value="">All ({data.length})</MenuItem>
          {filterOptions.programs.map((program) => {
            const count = data.filter((a) => a.program === program).length;
            return (
              <MenuItem value={program} key={program}>
                {program} ({count})
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          select
          label="Course"
          value={filters.course}
          onChange={(e) => handleFilterChange("course", e.target.value)}
          size="small"
          style={{ minWidth: 120 }}
          disabled={filterOptions.courses.length === 0}
        >
          <MenuItem value="">All ({data.length})</MenuItem>
          {filterOptions.courses.map((course) => {
            const count = data.filter((a) => a.course === course).length;
            return (
              <MenuItem value={course} key={course}>
                {course} ({count})
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          size="small"
          style={{ minWidth: 120 }}
          disabled={filterOptions.statuses.length === 0}
        >
          <MenuItem value="">All ({data.length})</MenuItem>
          {filterOptions.statuses.map((status) => {
            const count = data.filter((a) => a.status === status).length;
            return (
              <MenuItem value={status} key={status}>
                {status} ({count})
              </MenuItem>
            );
          })}
        </TextField>
      </Stack>

      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() =>
              setFilters({ area: "", program: "", course: "", status: "" })
            }
          >
            Clear all filters
          </Typography>
        </Box>
      )}
    </Box>
  );
}
