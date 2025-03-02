import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Alert,
} from '@mui/material';
import { IconDownload } from '@tabler/icons-react';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';

const EditableTable = ({ text = 'مؤسسة', initialData = [] }) => {
  const [data, setData] = useState(initialData);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'name',
      header: `اسم ${text}`,
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'code',
      header: `كود ${text}`,
    },
    {
      accessorKey: 'balance',
      header: 'الرصيد',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('balance').toLocaleString()} ريال</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'الحالة',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <Badge
            color={status === 'نشط' ? 'success' : status === 'معلق' ? 'warning' : 'error'}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {editRowId === row.original.id ? (
            <>
              <Button variant="outlined" size="small" onClick={handleSave}>
                حفظ
              </Button>
              <Button variant="outlined" size="small" onClick={() => setEditRowId(null)}>
                إلغاء
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" size="small" onClick={() => handleEdit(row.original)}>
                تعديل
              </Button>
              <Button
                color="error"
                size="small"
                onClick={() => handleDeleteClick(row.original)}
              >
                حذف
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleEdit = (row) => {
    setEditRowId(row.id);
    setEditedData({ ...row });
  };

  const handleSave = () => {
    if (editedData) {
      setData(data.map((item) => (item.id === editedData.id ? editedData : item)));
      setEditRowId(null);
      setEditedData(null);
      setAlert({
        show: true,
        message: 'تم تحديث البيانات بنجاح',
        type: 'success',
      });
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedForDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setData(data.filter((item) => item.id !== selectedForDelete.id));
    setDeleteDialogOpen(false);
    setAlert({
      show: true,
      message: `تم حذف ${text} بنجاح`,
      type: 'success',
    });
  };

  const handleDownloadPDF = () => {
    const content = document.getElementById('table-content');

    // Use html2canvas and jsPDF
    import('html2canvas').then(({ default: html2canvas }) => {
      import('jspdf').then(({ default: jsPDF }) => {
        html2canvas(content).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
          });

          const imgWidth = 280;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${text}_report.pdf`);
        });
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">قائمة {text}</h2>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <IconDownload className="h-4 w-4" />
          تحميل PDF
        </Button>
      </div>

      <div className="rounded-md border" id="table-content">
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {data && data.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {editRowId === row.original.id && cell.column.id !== 'actions' ? (
                          cell.column.id === 'status' ? (
                            <FormControl fullWidth>
                              <InputLabel>الحالة</InputLabel>
                              <Select
                                value={editedData?.[cell.column.id]}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    [cell.column.id]: e.target.value,
                                  })
                                }
                              >
                                {['نشط', 'معلق', 'متوقف'].map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              value={editedData?.[cell.column.id] || ''}
                              onChange={(e) =>
                                setEditedData({
                                  ...editedData,
                                  [cell.column.id]: e.target.value,
                                })
                              }
                            />
                          )
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    لا توجد نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outlined"
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          السابق
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          التالي
        </Button>
      </div>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button color="error" onClick={handleDeleteConfirm}>
              حذف
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {alert.show && (
        <Alert severity={alert.type}>
          {alert.message}
        </Alert>
      )}
    </div>
  );
};

export default EditableTable;