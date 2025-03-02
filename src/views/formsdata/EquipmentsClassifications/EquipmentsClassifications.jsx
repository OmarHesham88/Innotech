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
    FormLabel,
    Grid,
    Box,
    Typography,
    Popover,
    MenuItem,
    Paper,
    Divider,
    InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { IconSearch, IconDotsCircleHorizontal, IconTrash, IconEdit, IconCircleCheck, IconExclamationCircle, IconX } from '@tabler/icons';
import BorderedSection from '../components/BorderedSection';
import { FormLayout } from '../components/FormLayout';
import { FormInput } from '../components/FormInput';
import FileUpload from '../companyRegistration/FileUpload';
import InputExplanation from '../components/InputExplanation';

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
        vinNumber: 'VIN123456789',
        initialReading: '1000',
        operatingHours: '150',
        workHours: '120',
        travelDistance: '',
        oilBurnRate: '2.5',
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
        vinNumber: 'VIN987654321',
        initialReading: '5000',
        operatingHours: '200',
        workHours: '',
        travelDistance: '10000',
        oilBurnRate: '1.8',
    },
];

const EquipmentsClassifications = () => {
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
        vinNumber: '',
        initialReading: '',
        operatingHours: '',
        workHours: '',
        travelDistance: '10000',
        oilBurnRate: '',
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
    
    // Use the FormInput hook
    const { 
        focusedInput, 
        getInputStyle, 
        getInputProps, 
        renderExplanation, 
        toggleExplanation, 
        setExplanation 
    } = FormInput();

    const equipmentTypes = [
        { value: 'حفارة', label: 'حفارة' },
        { value: 'رافعة', label: 'رافعة' },
        { value: 'مولد كهربائي', label: 'مولد كهربائي' },
    ];

    const vehicleTypes = [
        { value: 'سيارة', label: 'سيارة' },
        { value: 'شاحنة', label: 'شاحنة' },
        { value: 'حافلة', label: 'حافلة' },
    ];

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'equipmentName':
                return value.trim().length > 0;
            case 'technician':
                return value.trim().length > 0;
            case 'commonName':
                return value.trim().length > 0;
            case 'description':
                return true;
            case 'vinNumber':
                return value.trim().length > 0;
            case 'initialReading':
                return value.trim().length > 0;
            case 'operatingHours':
                return value.trim().length > 0;
            case 'oilBurnRate':
                return value.trim().length > 0;
            default:
                return true;
        }
    };

    const handleInputReset = (e, fieldName) => {
        e.preventDefault();
        setCurrentItem({ ...currentItem, [fieldName]: '' });
    };

    const handleBlur = (e) => {
        const name = e.target.name;
        setTouched({ ...touched, [name]: true });
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
                vinNumber: '',
                initialReading: '',
                operatingHours: '',
                workHours: '8',
                travelDistance: '10000',
                oilBurnRate: '',
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
        setCurrentItem({
            ...currentItem,
            type: newType,
            workHours: newType === 'معدة' ? '10' : '',
            travelDistance: newType === 'مركبة' ? '10000' : '',
        });
    };

    const getInputPropsWithUnit = (fieldName, unit) => {
        const baseProps = getInputProps(
            fieldName,
            currentItem,
            touched,
            isSubmitted,
            validateField,
            handleInputReset,
            handleBlur
        );

        const originalEndAdornment = baseProps.InputProps.endAdornment;

        return {
            ...baseProps,
            InputProps: {
                ...baseProps.InputProps,
                endAdornment: (
                    <InputAdornment position="end">
                        {originalEndAdornment}
                        <Typography variant="caption" sx={{ ml: 1 }}>{unit}</Typography>
                    </InputAdornment>
                ),
            }
        };
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
    const [popoverIndex, setPopoverIndex] = React.useState(null);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setPopoverIndex(index);
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
                dialogTitle="معلومات حول تصنيفات الأصول"
                dialogContentText="هذه الصفحة تستخدم لإدارة وتصنيف المعدات والمركبات"
                showInfoIcon={true}
                formExplanation="قم بإدخال وإدارة جميع تصنيفات الأصول من هذه الصفحة"
            >
                <BorderedSection title="التصنيف الرئيسي">
                    <Box sx={{ px: 3 }}>
                        <FormControl component="fieldset">
                            <RadioGroup row value={type} onChange={handleTypeChange}>
                                <FormControlLabel value="معدة" control={<Radio />} label="معدة" />
                                <FormControlLabel value="مركبة" control={<Radio />} label="مركبة" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </BorderedSection>
                <BorderedSection title="بيانات التصنيفات">
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label={currentItem.type === 'معدة' ? 'نوع المعدة' : 'نوع المركبة'}
                                    name="equipmentName"
                                    value={currentItem?.equipmentName || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('equipmentName', currentItem.equipmentName)) ||
                                        (touched.equipmentName &&
                                            !validateField('equipmentName', currentItem.equipmentName))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('equipmentName', currentItem.equipmentName)) ||
                                            (touched.equipmentName &&
                                                !validateField('equipmentName', currentItem.equipmentName))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'equipmentName',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
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
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="اسم الفني"
                                    name="technician"
                                    value={currentItem?.technician || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('technician', currentItem.technician)) ||
                                        (touched.technician && !validateField('technician', currentItem.technician))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('technician', currentItem.technician)) ||
                                            (touched.technician && !validateField('technician', currentItem.technician))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'technician',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
                                        false,
                                        'أدخل اسم الفني المسئول عن المعدة'
                                    )}
                                />
                                {renderExplanation('technician')}

                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="الاسم الدارج"
                                    name="commonName"
                                    value={currentItem?.commonName || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('commonName', currentItem.commonName)) ||
                                        (touched.commonName && !validateField('commonName', currentItem.commonName))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('commonName', currentItem.commonName)) ||
                                            (touched.commonName && !validateField('commonName', currentItem.commonName))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'commonName',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
                                        false,
                                        'الاسم المستخدم بشكل شائع للمعدة/المركبة'
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
                                    rows={3}
                                    value={currentItem?.description || ''}
                                    onChange={handleChange}
                                    {...getInputProps(
                                        'description',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
                                        false,
                                        'أدخل وصفًا مفصلًا للمعدة/المركبة'
                                    )}
                                />
                                {renderExplanation('description')}
                            </Grid>
                            <Grid item xs={12}>
                                <FileUpload />
                            </Grid>
                        </Grid>
                    </Box>
                </BorderedSection>
                <BorderedSection title="البيانات المسترجعة">
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={9}>
                                <TextField
                                    fullWidth
                                    label="رقم الهيكل (VIN)"
                                    name="vinNumber"
                                    value={currentItem?.vinNumber || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('vinNumber', currentItem.vinNumber)) ||
                                        (touched.vinNumber && !validateField('vinNumber', currentItem.vinNumber))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('vinNumber', currentItem.vinNumber)) ||
                                            (touched.vinNumber && !validateField('vinNumber', currentItem.vinNumber))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'vinNumber',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
                                        false,
                                        'رقم تعريف المركبة/المعدة الفريد'
                                    )}
                                />
                                {renderExplanation('vinNumber')}
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    تسجيل
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ padding: 2 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>النوع</TableCell>
                                        <TableCell>اسم المعدة/المركبة</TableCell>
                                        <TableCell>اسم الفني</TableCell>
                                        <TableCell>الاسم الدارج</TableCell>
                                        <TableCell>رقم الهيكل (VIN)</TableCell>
                                        <TableCell>بداية تسجيل القراءة</TableCell>
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
                                            <TableCell>{item.vinNumber}</TableCell>
                                            <TableCell>{item.initialReading}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{item.dateAdded}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={(e) => handleClick(e, index)}
                                                    sx={{ color: '#0A7EA4' }}
                                                >
                                                    <IconDotsCircleHorizontal />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                                        handleOpenDialog(popoverIndex);
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
                                        setFileToDelete(popoverIndex);
                                        setDeleteConfirmOpen(true);
                                        handleClose();
                                    }}
                                    title="حذف"
                                >
                                    <IconTrash />
                                </IconButton>
                            </Box>
                        </Popover>
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
                <BorderedSection title="بيانات العداد">
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="بداية تسجيل القراءة"
                                    name="initialReading"
                                    type="number"
                                    value={currentItem?.initialReading || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('initialReading', currentItem.initialReading)) ||
                                        (touched.initialReading && !validateField('initialReading', currentItem.initialReading))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('initialReading', currentItem.initialReading)) ||
                                            (touched.initialReading && !validateField('initialReading', currentItem.initialReading))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputPropsWithUnit('initialReading', 'كم')}
                                />
                                {renderExplanation('initialReading')}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="عدد ساعات التشغيل"
                                    name="operatingHours"
                                    type="number"
                                    value={currentItem?.operatingHours || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('operatingHours', currentItem.operatingHours)) ||
                                        (touched.operatingHours && !validateField('operatingHours', currentItem.operatingHours))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('operatingHours', currentItem.operatingHours)) ||
                                            (touched.operatingHours && !validateField('operatingHours', currentItem.operatingHours))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'operatingHours',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur
                                    )}
                                />
                                {renderExplanation('operatingHours')}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {currentItem.type === 'معدة' ? (
                                    <TextField
                                        fullWidth
                                        label="ساعات العمل"
                                        name="workHours"
                                        type="number"
                                        value={currentItem?.workHours || '10'}
                                        onChange={handleChange}
                                        disabled
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        label="المسافة المقطوعة"
                                        name="travelDistance"
                                        type="number"
                                        value={currentItem?.travelDistance || '10000'}
                                        onChange={handleChange}
                                        disabled
                                        InputProps={{
                                            endAdornment: (
                                                <>
                                                    <Typography variant="caption" sx={{ ml: 1 }}>كم</Typography>
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </BorderedSection>

                <BorderedSection title="بيانات حرق الزيت">
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="معدل حرق الزيت"
                                    name="oilBurnRate"
                                    type="number"
                                    value={currentItem?.oilBurnRate || ''}
                                    onChange={handleChange}
                                    error={
                                        (isSubmitted && !validateField('oilBurnRate', currentItem.oilBurnRate)) ||
                                        (touched.oilBurnRate && !validateField('oilBurnRate', currentItem.oilBurnRate))
                                    }
                                    helperText={
                                        (isSubmitted && !validateField('oilBurnRate', currentItem.oilBurnRate)) ||
                                            (touched.oilBurnRate && !validateField('oilBurnRate', currentItem.oilBurnRate))
                                            ? 'هذا الحقل مطلوب'
                                            : ''
                                    }
                                    {...getInputProps(
                                        'oilBurnRate',
                                        currentItem,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        handleBlur,
                                        false,
                                        'معدل استهلاك الزيت بالنسبة للمعدة/المركبة'
                                    )}
                                />
                                {renderExplanation('oilBurnRate')}
                            </Grid>
                        </Grid>
                    </Box>
                </BorderedSection>
            </FormLayout>
        </>
    );
};

export default EquipmentsClassifications;