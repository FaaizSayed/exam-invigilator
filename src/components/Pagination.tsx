import { Box, TablePagination, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

type PaginationProps = {
  count: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  count,
  page,
  pageSize,
  setPage,
  setPageSize,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const handleFirstPageButtonClick = () => {
    setPage(1);
  };

  const handleBackButtonClick = () => {
    setPage(page - 1);
  };

  const handleNextButtonClick = () => {
    setPage(page + 1);
  };

  const handleLastPageButtonClick = () => {
    setPage(Math.max(0, Math.ceil(count / pageSize)));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <TablePagination
        component="div"
        count={count}
        page={page - 1}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={e => setPageSize(parseInt(e.target.value, 10))}
        rowsPerPageOptions={pageSizeOptions}
        labelRowsPerPage={t('rows.per.page')}
        labelDisplayedRows={({ from, to, count }) =>
          `${t('pagination.showing')} ${from}-${to} ${t('pagination.of')} ${count}`
        }
        dir={isRTL ? 'rtl' : 'ltr'}
        ActionsComponent={({ count, page, rowsPerPage }) => (
          <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="first page"
              sx={{ color: '#6366f1' }}
            ></IconButton>
            <IconButton
              onClick={handleBackButtonClick}
              disabled={page === 0}
              aria-label="previous page"
              sx={{ color: '#6366f1' }}
            >
              {isRTL ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="next page"
              sx={{ color: '#6366f1' }}
            >
              {isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
              onClick={handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="last page"
              sx={{ color: '#6366f1' }}
            ></IconButton>
          </Box>
        )}
        sx={{
          direction: isRTL ? 'rtl' : 'ltr',
          '& .MuiTablePagination-selectLabel': {
            color: '#6b7280',
            fontWeight: 500,
          },
          '& .MuiTablePagination-displayedRows': {
            color: '#6b7280',
            fontWeight: 500,
          },
          '& .MuiTablePagination-select': {
            background: 'white',
            borderRadius: 1,
            '&:hover': {
              background: '#f8fafc',
            },
          },
        }}
      />
    </Box>
  );
}
