import { TablePagination } from "@mui/material";

type Props = {
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
}: Props) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page - 1}
      onPageChange={(_, newPage) => setPage(newPage + 1)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value, 10))}
      rowsPerPageOptions={pageSizeOptions}
    />
  );
}
