import { Box, Select, MenuItem, Typography } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language as LanguageType } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
] as const;

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageType)}
        size="small"
        sx={{
          minWidth: 120,
          color: 'white',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            color: 'white',
          },
          '& .MuiOutlinedInput-root': {
            background: 'transparent',
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {lang.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
} 