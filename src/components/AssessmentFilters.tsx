import { useMemo, useCallback } from "react";
import type { Assessment } from "../types/assessment";
import { Box, TextField, MenuItem, Stack, Typography, Chip, IconButton } from "@mui/material";
import { FilterList, Clear } from "@mui/icons-material";

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
  const filterOptions = useMemo(() => {
    const areas = Array.from(new Set(data.map((a) => a.area))).sort();
    const programs = Array.from(new Set(data.map((a) => a.program))).sort();
    const courses = Array.from(new Set(data.map((a) => a.course))).sort();
    const statuses = Array.from(new Set(data.map((a) => a.status))).sort();
    
    return { areas, programs, courses, statuses };
  }, [data]);

  const handleFilterChange = useCallback((field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, [setFilters]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearAllFilters = useCallback(() => {
    setFilters({ area: "", program: "", course: "", status: "" });
  }, [setFilters]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2,
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
      }}>
        <FilterList sx={{ color: '#6366f1' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip 
            label={`${activeFiltersCount} active`}
            size="small"
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        )}
      </Box>
      
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          select
          label="Area"
          value={filters.area}
          onChange={(e) => handleFilterChange('area', e.target.value)}
          size="small"
          sx={{ 
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              background: 'white',
              '&:hover': {
                background: '#f8fafc',
              },
            },
          }}
          disabled={filterOptions.areas.length === 0}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>All Areas</span>
              <Chip label={data.length} size="small" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </MenuItem>
          {filterOptions.areas.map((area) => {
            const count = data.filter(a => a.area === area).length;
            return (
              <MenuItem value={area} key={area}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{area}</span>
                  <Chip 
                    label={count} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.75rem',
                      background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                      color: 'white',
                    }} 
                  />
                </Box>
              </MenuItem>
            );
          })}
        </TextField>
        
        <TextField
          select
          label="Program"
          value={filters.program}
          onChange={(e) => handleFilterChange('program', e.target.value)}
          size="small"
          sx={{ 
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              background: 'white',
              '&:hover': {
                background: '#f8fafc',
              },
            },
          }}
          disabled={filterOptions.programs.length === 0}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>All Programs</span>
              <Chip label={data.length} size="small" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </MenuItem>
          {filterOptions.programs.map((program) => {
            const count = data.filter(a => a.program === program).length;
            return (
              <MenuItem value={program} key={program}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{program}</span>
                  <Chip 
                    label={count} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.75rem',
                      background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                      color: 'white',
                    }} 
                  />
                </Box>
              </MenuItem>
            );
          })}
        </TextField>
        
        <TextField
          select
          label="Course"
          value={filters.course}
          onChange={(e) => handleFilterChange('course', e.target.value)}
          size="small"
          sx={{ 
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              background: 'white',
              '&:hover': {
                background: '#f8fafc',
              },
            },
          }}
          disabled={filterOptions.courses.length === 0}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>All Courses</span>
              <Chip label={data.length} size="small" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </MenuItem>
          {filterOptions.courses.map((course) => {
            const count = data.filter(a => a.course === course).length;
            return (
              <MenuItem value={course} key={course}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{course}</span>
                  <Chip 
                    label={count} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.75rem',
                      background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                      color: 'white',
                    }} 
                  />
                </Box>
              </MenuItem>
            );
          })}
        </TextField>
        
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          size="small"
          sx={{ 
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              background: 'white',
              '&:hover': {
                background: '#f8fafc',
              },
            },
          }}
          disabled={filterOptions.statuses.length === 0}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>All Statuses</span>
              <Chip label={data.length} size="small" sx={{ fontSize: '0.75rem' }} />
            </Box>
          </MenuItem>
          {filterOptions.statuses.map((status) => {
            const count = data.filter(a => a.status === status).length;
            return (
              <MenuItem value={status} key={status}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{status}</span>
                  <Chip 
                    label={count} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.75rem',
                      background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                      color: 'white',
                    }} 
                  />
                </Box>
              </MenuItem>
            );
          })}
        </TextField>
      </Stack>
      
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </Typography>
          <IconButton
            size="small"
            onClick={clearAllFilters}
            sx={{
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
