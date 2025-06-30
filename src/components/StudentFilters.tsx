import type { Submission } from '../types/exam';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
} from '@mui/material';
import { FilterList, Clear, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { buildProgramTree, getUniqueSorted } from '../utils/helper';
import GroupTreeDropdown from './GroupTreeDropdown';
import { mockAssessments } from '../Mockapis/assessments';

type Filters = {
  area: string;
  group: string;
  examinee: string;
  status: string;
};

type Props = {
  data: Submission[];
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
};

export default function StudentFilters({ data, filters, setFilters }: Props) {
  const { t } = useLanguage();
  const [activeFilters, setActiveFilters] = useState(0);

  const areas = getUniqueSorted(data.map(item => item.area));
  // const groups = getUniqueSorted(data.map(item => item.group));
  const examinees = getUniqueSorted(data.map(item => item.fullName));
  const statuses = getUniqueSorted(data.map(item => item.status));

  useEffect(() => {
    let count = 0;

    for (const key in filters) {
      const filterKey = key as keyof typeof filters;
      if (filters[filterKey] !== '') {
        count++;
      }
    }

    setActiveFilters(count);
  }, [filters]);

  const programTree = buildProgramTree(mockAssessments);

  const clearAll = () => {
    setFilters({
      area: '',
      group: '',
      examinee: '',
      status: '',
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
              background: 'linear-gradient(45deg, #ec4899, #db2777)',
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
          onChange={e =>
            setFilters(prev => ({ ...prev, area: e.target.value }))
          }
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.areas')}</MenuItem>
          {areas.map(area => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </TextField>

        <GroupTreeDropdown
          value={filters.group}
          onChange={v => setFilters(prev => ({ ...prev, group: v }))}
          label={t('filters.group')}
          placeholder={t('filters.all.groups')}
          treeData={programTree}
        />

        <Autocomplete
          options={examinees}
          value={filters.examinee}
          onChange={(_, newValue) =>
            setFilters(prev => ({ ...prev, examinee: newValue || '' }))
          }
          renderInput={params => (
            <TextField
              {...params}
              label={t('filters.examinee')}
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                ...params.InputProps,
                startAdornment: <Search sx={{ color: '#6b7280', mr: 1 }} />,
              }}
            />
          )}
        />

        <TextField
          select
          label={t('filters.status')}
          value={filters.status}
          onChange={e =>
            setFilters(prev => ({ ...prev, status: e.target.value }))
          }
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">{t('filters.all.statuses')}</MenuItem>
          {statuses.map(status => (
            <MenuItem key={status} value={status}>
              {t(`status.${status.toLowerCase().replace(' ', '.')}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
}
