import type { Exam } from "../types/exam";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  Box, 
  TextField, 
  MenuItem, 
  Stack, 
  Typography,
  Chip,
  IconButton
} from "@mui/material";
import { FilterList, Clear } from "@mui/icons-material";

type Filters = {
  area: string;
  program: string;
  course: string;
  status: string;
};

type Props = {
  data: Exam[];
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
};

export default function Filters({ data, filters, setFilters }: Props) {
  const { t } = useLanguage();

  const areas = [...new Set(data.map(item => item.area))].sort();
  const programs = [...new Set(data.map(item => item.program))].sort();
  const courses = [...new Set(data.map(item => item.course))].sort();
  const statuses = [...new Set(data.map(item => item.status))].sort();

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const clearAll = () => {
    setFilters({
      area: "",
      program: "",
      course: "",
      status: "",
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('filters.title')}
          </Typography>
        </Box>
        {activeFilters > 0 && (
          <Chip 
            label={`${activeFilters} ${t('filters.active')} ${t('filters.applied')}`}
            color="primary"
            size="small"
            sx={{ 
              background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        )}
        {activeFilters > 0 && (
          <IconButton
            onClick={clearAll}
            size="small"
            sx={{
              color: '#ef4444',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <Clear />
          </IconButton>
        )}
      </Box>

      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        <TextField
          select
          label={t('filters.area')}
          value={filters.area}
          onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.areas')}</MenuItem>
          {areas.map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label={t('filters.program')}
          value={filters.program}
          onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value }))}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.groups')}</MenuItem>
          {programs.map((program) => (
            <MenuItem key={program} value={program}>
              {program}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label={t('filters.course')}
          value={filters.course}
          onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.groups')}</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label={t('filters.status')}
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.statuses')}</MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {t(`status.${status.toLowerCase().replace(' ', '.')}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
}
