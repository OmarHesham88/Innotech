import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert as MuiAlert,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Grid,
    Box,
    Typography,
    Popover,
    MenuItem,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { IconSearch, IconDotsCircleHorizontal, IconTrash, IconEdit } from '@tabler/icons';
import BorderedSection from '../components/BorderedSection';
import { FormLayout } from '../components/FormLayout';
import { FormInput } from '../components/FormInput';

const initialData = [
    {
        id: 1,
        equipmentName: 'معدة 1',
        technician: 'فني 1',
        commonName: 'الاسم الدارج 1',
        description: 'وصف 1',
        type: 'معدة',
        status: 'مفعل',
        dateAdded: '2023-10-01',
    },
    {
        id: 2,
        equipmentName: 'مركبة 1',
        technician: 'فني 2',
        commonName: 'الاسم الدارج 2',
        description: 'وصف 2',
        type: 'مركبة',
        status: 'غير مفعل',
        dateAdded: '2023-10-02',
    },
];

const equipmentTypes = [
    { value: 'معدة 1', label: 'معدة 1' },
    { value: 'معدة 2', label: 'معدة 2' },
];

const vehicleTypes = [
    { value: 'مركبة 1', label: 'مركبة 1' },
    { value: 'مركبة 2', label: 'مركبة 2' },
];

const AssetsClassifications = () => {
    const [data, setData] = useState(initialData);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        equipmentName: '',
        technician: '',
        commonName: '',
        description: '',
        type: 'معدة',
        status: 'مفعل',
        dateAdded: new Date().toISOString().split('T')[0],
    });
    const [editIndex, setEditIndex] = useState(-1);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [type, setType] = useState('معدة');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [scaled, setScaled] = useState(false);
    const [touched, setTouched] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Initialize FormInput
    const { getInputStyle, getInputProps, renderExplanation } = FormInput();

    // Validation Rules
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'equipmentName':
                return value.trim().length > 0;
            case 'technician':
                return value.trim().length > 0;
            case 'commonName':
                return value.trim().length > 0;
            case 'description':
                return true; // Description is optional, so always valid
            default:
                return true;
        }
    };

    const getErrorMessage = (fieldName) => {
        if (!touched[fieldName] && !isSubmitted) return '';

        switch (fieldName) {
            case 'equipmentName':
                return !currentItem.equipmentName.trim()
                    ? 'اسم المعدة/المركبة مطلوب'
                    : '';
            case 'technician':
                return !currentItem.technician.trim()
                    ? 'اسم الفني مطلوب'
                    : '';
            case 'commonName':
                return !currentItem.commonName.trim()
                    ? 'الاسم الدارج مطلوب'
                    : '';
            default:
                return '';
        }
    };

    const handleOpenDialog = (index = -1) => {
        if (index !== -1) {
            setCurrentItem(data[index]);
            setEditIndex(index);
            setType(data[index].type);
        } else {
            setCurrentItem({
                equipmentName: '',
                technician: '',
                commonName: '',
                description: '',
                type: 'معدة',
                status: 'مفعل',
                dateAdded: new Date().toISOString().split('T')[0],
            });
            setEditIndex(-1);
            setType('معدة');
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = (event, reason) => {
        if (reason === 'backdropClick') {
            setScaled(true);
            setTimeout(() => {
                setScaled(false);
            }, 300);
        } else {
            setOpenDialog(false);
        }
    };

    const handleSave = () => {
        setIsSubmitted(true);

        const isFormValid = Object.keys(currentItem).every((field) =>
            validateField(field, currentItem[field]),
        );

        if (!isFormValid) {
            return;
        }

        if (editIndex === -1) {
            setData([...data, { ...currentItem, id: data.length + 1 }]);
        } else {
            const updatedData = [...data];
            updatedData[editIndex] = currentItem;
            setData(updatedData);
        }
        setOpenDialog(false);
    };

    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
        setShowSuccessAlert(true);
        setDeleteConfirmOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({ ...currentItem, [name]: value });
        setTouched({ ...touched, [name]: true });
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        setCurrentItem({ ...currentItem, type: newType });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = data.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <FormLayout
                title="تصنيفات الأصول"
                actionButtons={null}
                dialogTitle=""
                dialogContentText=""
                showInfoIcon={false}
            >
                <BorderedSection title="جدول تصنيفات الأصول ">
                    <Box sx={{ padding: 2 }}>
                        <Box
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
                        >
                            <TextField
                                placeholder="بحث..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <IconSearch />,
                                }}
                                sx={{ width: 600 }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => handleOpenDialog()}
                                sx={{ marginLeft: 2 }}
                            >
                                إضافة تصنيف
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>النوع</TableCell>
                                        <TableCell>اسم المعدة/المركبة</TableCell>
                                        <TableCell>اسم الفني</TableCell>
                                        <TableCell>الاسم الدارج</TableCell>
                                        <TableCell>الوصف</TableCell>
                                        <TableCell>حالة التصنيف</TableCell>
                                        <TableCell>تاريخ الاضافة</TableCell>
                                        <TableCell>الإجراءات</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.equipmentName}</TableCell>
                                            <TableCell>{item.technician}</TableCell>
                                            <TableCell>{item.commonName}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{item.dateAdded}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={handleClick} sx={{ color: '#0A7EA4' }}>
                                                    <IconDotsCircleHorizontal />
                                                </IconButton>
                                                <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Box p={2}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: '#0A7EA4' }}
                                                            onClick={() => {
                                                                handleOpenDialog(index);
                                                                handleClose();
                                                            }}
                                                            title="تعديل"
                                                        >
                                                            <IconEdit />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: '#dc3545' }}
                                                            onClick={() => {
                                                                setFileToDelete(index);
                                                                setDeleteConfirmOpen(true);
                                                                handleClose();
                                                            }}
                                                            title="حذف"
                                                        >
                                                            <IconTrash />
                                                        </IconButton>
                                                    </Box>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Add/Edit Dialog */}
                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            PaperProps={{
                                className: scaled ? 'scale-dialog' : '',
                            }}
                            sx={{
                                '& .MuiDialog-paper': {
                                    width: { xs: '100%', sm: '80%', md: '600px' },
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    fontSize: '14px',
                                    color: '#fff',
                                    backgroundColor: '#0A7EA4',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {editIndex === -1 ? 'إضافة تصنيف' : 'تعديل تصنيف'}
                                <IconButton
                                    sx={{
                                        backgroundColor: '#EFF9FF',
                                        color: 'black',
                                        '&:hover': { color: '#0074BA' },
                                    }}
                                    size="small"
                                    variant="outlined"
                                    onClick={handleCloseDialog}
                                >
                                    <Close size="18" />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={4}>
                                        <FormControl component="fieldset">
                                            <RadioGroup row value={type} onChange={handleTypeChange}>
                                                <FormControlLabel value="معدة" control={<Radio />} label="معدة" />
                                                <FormControlLabel value="مركبة" control={<Radio />} label="مركبة" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            select
                                            fullWidth
                                            label={currentItem.type === 'معدة' ? 'نوع المعدة' : 'نوع المركبة'}
                                            name="equipmentName"
                                            value={currentItem?.equipmentName || ''}
                                            onChange={handleChange}
                                            error={Boolean(getErrorMessage('equipmentName'))}
                                            helperText={getErrorMessage('equipmentName')}
                                            {...getInputProps(
                                                'equipmentName',
                                                currentItem,
                                                touched,
                                                isSubmitted,
                                                validateField,
                                                (e) => {
                                                    e.stopPropagation();
                                                    setCurrentItem({ ...currentItem, equipmentName: '' });
                                                    setTouched({ ...touched, equipmentName: false });
                                                },
                                                () => setTouched({ ...touched, equipmentName: true }),
                                                true,
                                                'اختر نوع المعدة/المركبة من القائمة'
                                            )}
                                        >
                                            {(currentItem.type === 'معدة' ? equipmentTypes : vehicleTypes).map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {renderExplanation('equipmentName')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="اسم الفني"
                                            name="technician"
                                            value={currentItem?.technician || ''}
                                            onChange={handleChange}
                                            error={Boolean(getErrorMessage('technician'))}
                                            helperText={getErrorMessage('technician')}
                                            {...getInputProps(
                                                'technician',
                                                currentItem,
                                                touched,
                                                isSubmitted,
                                                validateField,
                                                (e) => {
                                                    e.stopPropagation();
                                                    setCurrentItem({ ...currentItem, technician: '' });
                                                    setTouched({ ...touched, technician: false });
                                                },
                                                () => setTouched({ ...touched, technician: true }),
                                                false,
                                                'أدخل اسم الفني المسؤول عن المعدة/المركبة'
                                            )}
                                        />
                                        {renderExplanation('technician')}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="الاسم الدارج"
                                            name="commonName"
                                            value={currentItem?.commonName || ''}
                                            onChange={handleChange}
                                            error={Boolean(getErrorMessage('commonName'))}
                                            helperText={getErrorMessage('commonName')}
                                            {...getInputProps(
                                                'commonName',
                                                currentItem,
                                                touched,
                                                isSubmitted,
                                                validateField,
                                                (e) => {
                                                    e.stopPropagation();
                                                    setCurrentItem({ ...currentItem, commonName: '' });
                                                    setTouched({ ...touched, commonName: false });
                                                },
                                                () => setTouched({ ...touched, commonName: true }),
                                                false,
                                                'أدخل الاسم الدارج للمعدة/المركبة'
                                            )}
                                        />
                                        {renderExplanation('commonName')}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="الوصف"
                                            name="description"
                                            multiline
                                            value={currentItem?.description || ''}
                                            onChange={handleChange}
                                            {...getInputProps(
                                                'description',
                                                currentItem,
                                                touched,
                                                isSubmitted,
                                                validateField,
                                                (e) => {
                                                    e.stopPropagation();
                                                    setCurrentItem({ ...currentItem, description: '' });
                                                    setTouched({ ...touched, description: false });
                                                },
                                                () => setTouched({ ...touched, description: true }),
                                                false,
                                                'أدخل وصفًا تفصيليًا للمعدة/المركبة'
                                            )}
                                        />
                                        {renderExplanation('description')}
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleSave} variant="contained">
                                    حفظ
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                            <DialogTitle>تأكيد الحذف</DialogTitle>
                            <DialogContent>
                                <Typography>هل أنت متأكد من حذف هذا التصنيف؟</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteConfirmOpen(false)}>إلغاء</Button>
                                <Button onClick={() => handleDelete(fileToDelete)} color="error">
                                    حذف
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Success Alert */}
                        <Snackbar
                            open={showSuccessAlert}
                            autoHideDuration={6000}
                            onClose={() => setShowSuccessAlert(false)}
                        >
                            <MuiAlert elevation={6} variant="filled" severity="success">
                                تم حذف التصنيف بنجاح
                            </MuiAlert>
                        </Snackbar>
                    </Box>
                </BorderedSection>
            </FormLayout>
        </>
    );
};

export default AssetsClassifications;