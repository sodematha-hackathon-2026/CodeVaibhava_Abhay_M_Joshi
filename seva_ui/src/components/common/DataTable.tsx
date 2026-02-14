import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export interface Column<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  flex?: number;
  renderCell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: (row: T) => React.ReactNode;
  hideDefaultActions?: boolean;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  onEdit,
  onDelete,
  customActions,
  hideDefaultActions = false,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  style={{ 
                    minWidth: column.width,
                    flex: column.flex ? column.flex : undefined,
                    fontWeight: 700,
                    backgroundColor: '#fff4e6',
                    color: '#ff6b00',
                    fontSize: '0.95rem',
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {(!hideDefaultActions || customActions) && (
                <TableCell 
                  style={{ 
                    width: 120,
                    fontWeight: 700,
                    backgroundColor: '#fff4e6',
                    color: '#ff6b00',
                    fontSize: '0.95rem',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow 
                hover 
                key={row.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#fff9f0',
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={String(column.field)}>
                    {column.renderCell 
                      ? column.renderCell(row)
                      : String(row[column.field] ?? '')
                    }
                  </TableCell>
                ))}
                {(!hideDefaultActions || customActions) && (
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {customActions && customActions(row)}
                      {!hideDefaultActions && (
                        <>
                          {onEdit && (
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                              sx={{
                                color: '#1976d2',
                                '&:hover': {
                                  backgroundColor: '#e3f2fd',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              size="small"
                              onClick={() => onDelete(row)}
                              sx={{
                                color: '#d32f2f',
                                '&:hover': {
                                  backgroundColor: '#ffebee',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #e0e0e0',
        }}
      />
    </Paper>
  );
}

export const formatBoolean = (value: boolean): React.ReactNode => (
  <Chip 
    label={value ? 'Yes' : 'No'} 
    size="small"
    color={value ? 'success' : 'default'}
    sx={{ fontWeight: 600 }}
  />
);

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};