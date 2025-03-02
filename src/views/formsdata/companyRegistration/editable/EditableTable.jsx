import * as React from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Chip,
  Box,
  MenuItem,
  IconButton,
  TextField,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Paper,
  TableContainer,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import BorderedSection from '../../components/BorderedSection';

// Sample Data
const institutionsData = {
  مؤسسة: [
    {
      id: 1,
      name: 'مؤسسة النور التعليمية',
      code: 'EDU001',
      address: 'شارع المعز، القاهرة',
      location: '30.0444° N, 31.2357° E',
      balance: 150000,
      accountType: 'تعليمي',
      manager: 'أحمد محمود',
      users: 25,
      status: 'نشط',
      sector: 'تعليم',
      lastUpdate: '2024-02-18',
    },
    {
      id: 2,
      name: 'مستشفى الشفاء',
      code: 'HOS002',
      address: 'شارع الملك فيصل، جدة',
      location: '21.5433° N, 39.1728° E',
      balance: 280000,
      accountType: 'صحي',
      manager: 'سارة علي',
      users: 45,
      status: 'نشط',
      sector: 'صحة',
      lastUpdate: '2024-02-17',
    },
    {
      id: 3,
      name: 'مركز الأمل للتدريب',
      code: 'TRN003',
      address: 'شارع حمد الكبير، الرياض',
      location: '24.7136° N, 46.6753° E',
      balance: 75000,
      accountType: 'تدريبي',
      manager: 'محمد خالد',
      users: 15,
      status: 'معلق',
      sector: 'تدريب',
      lastUpdate: '2024-02-16',
    },
  ],
  شركة: [
    {
      id: 1,
      name: 'شركة الأمل للتقنية',
      code: 'TECH001',
      address: 'شارع الملك فهد، الرياض',
      location: '24.7136° N, 46.6753° E',
      balance: 500000,
      accountType: 'تقني',
      manager: 'محمد العلي',
      users: 50,
      status: 'نشط',
      sector: 'تقنية',
      lastUpdate: '2024-02-18',
    },
  ],
};

const statusOptions = [
  { value: 'نشط', label: 'نشط' },
  { value: 'معلق', label: 'معلق' },
  { value: 'متوقف', label: 'متوقف' },
];

const EditableTable = ({ text = 'مؤسسة' }) => {
  const [data, setData] = React.useState(() => [...institutionsData[text]]);
  const [editRowId, setEditRowId] = React.useState(null);
  const [editedData, setEditedData] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState(null);
  const [alert, setAlert] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setFilteredOrders(
      initialOrders.filter((order) =>
        Object.values(order).some((value) =>
          value.toString().toLowerCase().includes(event.target.value.toLowerCase()),
        ),
      ),
    );
  };
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('name', {
      header: () => `اسم ${text}`,
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('code', {
      header: () => `كود ${text}`,
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('address', {
      header: () => 'العنوان',
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('location', {
      header: () => 'الموقع الجغرافي',
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('balance', {
      header: () => 'الرصيد',
      cell: (info) => (
        <Typography variant="subtitle1">{info.getValue().toLocaleString()} ريال</Typography>
      ),
    }),
    columnHelper.accessor('accountType', {
      header: () => 'نوع الحساب',
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('manager', {
      header: () => `مدير ${text}`,
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('users', {
      header: () => 'المستخدمون',
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('status', {
      header: () => 'الحالة',
      cell: (info) => (
        <Chip
          sx={{
            bgcolor:
              info.getValue() === 'نشط'
                ? (theme) => theme.palette.success.light
                : info.getValue() === 'معلق'
                ? (theme) => theme.palette.warning.light
                : (theme) => theme.palette.error.light,
            color:
              info.getValue() === 'نشط'
                ? (theme) => theme.palette.success.main
                : info.getValue() === 'معلق'
                ? (theme) => theme.palette.warning.main
                : (theme) => theme.palette.error.main,
            borderRadius: '8px',
          }}
          label={info.getValue()}
        />
      ),
    }),
    columnHelper.accessor('sector', {
      header: () => 'القطاع',
      cell: (info) => <Typography variant="subtitle1">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('lastUpdate', {
      header: () => 'آخر تحديث',
      cell: (info) => (
        <Typography variant="subtitle1">
          {new Date(info.getValue()).toLocaleDateString('ar-SA')}
        </Typography>
      ),
    }),
    columnHelper.accessor('actions', {
      header: () => 'إجراءات',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editRowId === row.original.id ? (
            <>
              <IconButton onClick={handleSave} color="primary" size="small">
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => setEditRowId(null)} color="error" size="small">
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => handleEdit(row.original)} color="primary" size="small">
                <IconEdit />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteClick(row.original)}
                color="error"
                size="small"
              >
                <IconTrash />
              </IconButton>
            </>
          )}
        </Box>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
        open: true,
        message: 'تم تحديث البيانات بنجاح',
        severity: 'success',
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
      open: true,
      message: `تم حذف ${text} بنجاح`,
      severity: 'success',
    });
  };

  const handleChange = (e, field) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: e.target.value,
      });
    }
  };

  return (
    <Box mt={3}>
      <BorderedSection title="جدول ملخص المؤسسات">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
          }}
        >
          <TextField
            placeholder="بحث..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <IconSearch />,
            }}
            sx={{ width: 1000 }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        backgroundColor: 'background.paper',
                        fontWeight: 'bold',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {editRowId === row.original.id && cell.column.id !== 'actions' ? (
                        cell.column.id === 'status' ? (
                          <Select
                            value={editedData?.[cell.column.id] || ''}
                            onChange={(e) => handleChange(e, cell.column.id)}
                            size="small"
                            fullWidth
                          >
                            {statusOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <TextField
                            size="small"
                            value={editedData?.[cell.column.id] || ''}
                            onChange={(e) => handleChange(e, cell.column.id)}
                            fullWidth
                          />
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BorderedSection>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} dir="rtl">
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من حذف {text} "{selectedForDelete?.name}"؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditableTable;
