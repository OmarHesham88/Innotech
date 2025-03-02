import React, { useState, useRef } from 'react';
import '/src/index.css';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  IconButton,
  Avatar,
  Box,
  InputAdornment,
  Grid,
  Popover,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import {
  IconSearch,
  IconX,
  IconCamera,
  IconDotsCircleHorizontal,
  IconTrash,
  IconEdit,
} from '@tabler/icons';
import { FormInput } from '../../formsdata/components/FormInput';
import BorderedSection from '../components/BorderedSection';
import { Select } from 'formik-mui';
import { FormLayout } from '../components/FormLayout';

const initialContacts = [
  {
    fullName: '',
    companyName: 'شركة التقنية',
    department: 'قسم1',
    email: 'mohamed.ahmed@tech.com',
    phone: '0123456789',
    whatsapp: '0123456789',
    facebook: 'mohamed.ahmed',
    image: 'https://via.placeholder.com/150',
    address: 'القاهرة، مصر',
    notes: 'مطور برمجيات',
  },
  {
    fullName: 'علي محمود سعيد',
    companyName: 'شركة التسويق',
    department: 'قسم2',
    email: 'ali.mahmoud@marketing.com',
    phone: '0111222333',
    whatsapp: '0111222333',
    facebook: 'ali.mahmoud',
    image: 'https://via.placeholder.com/150',
    address: 'الإسكندرية، مصر',
    notes: 'مدير تسويق',
  },
  {
    fullName: 'فاطمة حسن محمد',
    companyName: 'شركة الموارد البشرية',
    department: 'قسم3',
    email: 'fatima.hassan@hr.com',
    phone: '0100111222',
    whatsapp: '0100111222',
    facebook: 'fatima.hassan',
    image: 'https://via.placeholder.com/150',
    address: 'الجيزة، مصر',
    notes: 'مسؤول موارد بشرية',
  },
];

const initialContact = {
  fullName: '',
  companyName: '',
  department: '',
  email: '',
  phone: '',
  whatsapp: '',
  facebook: '',
  image: '',
  address: '',
  notes: '',
};

const departments = ['قسم1', 'قسم2', 'قسم3', 'قسم4'];

const ContactsSection = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editIndex, setEditIndex] = useState(-1);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [alert, setAlert] = useState(false);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [scaled, setScaled] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const fileInputRef = useRef(null);

  const { getInputStyle, getInputProps, renderExplanation } = FormInput();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024 * 5) {
      alert('File size is too large! Max 5MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result;
      setImageUrl(imageUrl);
      setCurrentContact({ ...currentContact, image: imageUrl });
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const handleOpenDialog = (index = -1) => {
    if (index !== -1) {
      setCurrentContact(contacts[index]);
      setEditIndex(index);
    } else {
      setCurrentContact(initialContact);
      setEditIndex(-1);
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

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'fullName':
        return value.trim().length > 0;
      case 'companyName':
        return value.trim().length > 0;
      case 'department':
        return value.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^(010|011|012|015)\d{8}$/.test(value);
      case 'whatsapp':
        return /^(010|011|012|015)\d{8}$/.test(value);
      case 'facebook':
        return value.trim().length > 0;
      case 'address':
        return value.trim().length > 0;
      case 'notes':
        return true;
      default:
        return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleInputReset = (e, fieldName) => {
    e.stopPropagation();
    setCurrentContact({ ...currentContact, [fieldName]: '' });
    setTouched({ ...touched, [fieldName]: false });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSaveContact = () => {
    setIsSubmitted(true);

    const isFormValid = Object.keys(currentContact).every((field) =>
      validateField(field, currentContact[field]),
    );

    if (!isFormValid) {
      return;
    }

    if (editIndex === -1) {
      setContacts([...contacts, currentContact]);
    } else {
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = currentContact;
      setContacts(updatedContacts);
    }

    handleCloseDialog();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = Object.values(contact).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const matchesCategory = filterCategory ? contact.department === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const initiateDelete = (index) => {
    setFileToDelete(index);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete !== null) {
      const updatedContacts = contacts.filter((_, index) => index !== fileToDelete);
      setContacts(updatedContacts);
      setDeleteConfirmOpen(false);
      setFileToDelete(null);
      setShowSuccessAlert(true);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setFileToDelete(null);
  };

  return (
    <>
      <FormLayout
        title="جهات الاتصال"
        actionButtons={null}
        dialogTitle=""
        dialogContentText=""
        showInfoIcon={false}
      >
        <BorderedSection title="جهات الاتصال">
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
              sx={{ width: 600 }}
            />
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ marginLeft: 2 }}
            >
              إضافة جهة اتصال
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الصورة</TableCell>
                  <TableCell>الاسم رباعي</TableCell>
                  <TableCell>اسم الشركة</TableCell>
                  <TableCell>القسم</TableCell>
                  <TableCell>البريد الإلكتروني</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>الواتساب</TableCell>
                  <TableCell>الفيس بوك</TableCell>
                  <TableCell>العنوان</TableCell>
                  <TableCell>ملاحظات</TableCell>
                  <TableCell>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar src={contact.image} alt={contact.fullName} />
                    </TableCell>
                    <TableCell>{contact.fullName}</TableCell>
                    <TableCell>{contact.companyName}</TableCell>
                    <TableCell>{contact.department}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.whatsapp}</TableCell>
                    <TableCell>{contact.facebook}</TableCell>
                    <TableCell>{contact.address}</TableCell>
                    <TableCell>{contact.notes}</TableCell>
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
                            sx={{ color: 'warning.main' }}
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
                              initiateDelete(index);
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
        </BorderedSection>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            className: scaled ? 'scale-dialog' : '',
          }}
          sx={{
            '& .MuiDialog-paper': {
              width: { xs: '100%', sm: '80%', md: '900px' },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: "10px",
              marginBottom: "10px",
              borderBottom: `#0A7EA4 solid 1px`,
              backgroundColor: "#0A7EA4",
              color: "#fff",
            }}
          >
            {editIndex === -1 ? 'إضافة جهة اتصال' : 'تعديل جهة اتصال'}
            <IconButton
              sx={{ backgroundColor: '#EFF9FF', color: 'black', '&:hover': { color: '#0074BA' } }}
              size="small"
              variant="outlined"
              onClick={handleCloseDialog}
            >
              <IconX size="18" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} p={1}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 130,
                    height: 130,
                    marginBottom: '20px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={handleImageClick}
                >
                  <Avatar
                    src={currentContact.image || imageUrl}
                    alt={currentContact.fullName}
                    sx={{ width: '100%', height: '100%' }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(10, 126, 164, 0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: currentContact.image ? 0 : 1,
                      transition: 'opacity 0.3s ease-in-out',
                      color: '#fff',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <IconCamera />
                  </Box>
                </Box>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="الاسم رباعي"
                    name="fullName"
                    value={currentContact.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('fullName', currentContact.fullName)) ||
                      (touched.fullName && !validateField('fullName', currentContact.fullName))
                    }
                    helperText={
                      (isSubmitted && !validateField('fullName', currentContact.fullName)) ||
                        (touched.fullName && !validateField('fullName', currentContact.fullName))
                        ? 'هذا الحقل مطلوب'
                        : ''
                    }
                    {...getInputProps(
                      'fullName',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل الاسم الرباعي لجهة الاتصال',
                    )}
                  />
                  {renderExplanation('fullName')}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم الشركة"
                    name="companyName"
                    value={currentContact.companyName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('companyName', currentContact.companyName)) ||
                      (touched.companyName &&
                        !validateField('companyName', currentContact.companyName))
                    }
                    helperText={
                      (isSubmitted && !validateField('companyName', currentContact.companyName)) ||
                        (touched.companyName &&
                          !validateField('companyName', currentContact.companyName))
                        ? 'هذا الحقل مطلوب'
                        : ''
                    }
                    {...getInputProps(
                      'companyName',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل اسم الشركة التابعة لجهة الاتصال',
                    )}
                  />
                  {renderExplanation('companyName')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    name="department"
                    label="القسم"
                    value={currentContact.department}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('department', currentContact.department)) ||
                      (touched.department &&
                        !validateField('department', currentContact.department))
                    }
                    helperText={
                      (isSubmitted && !validateField('department', currentContact.department)) ||
                        (touched.department &&
                          !validateField('department', currentContact.department))
                        ? 'هذا الحقل مطلوب'
                        : ''
                    }
                    fullWidth
                    {...getInputProps(
                      'department',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      true,
                      'اختر القسم التابع لجهة الاتصال',
                    )}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                  {renderExplanation('department')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    name="email"
                    value={currentContact.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('email', currentContact.email)) ||
                        (touched.email && !validateField('email', currentContact.email))
                                                ? 'البريد الإلكتروني غير صالح'
                        : ''
                    }
                    helperText={
                      (isSubmitted && !validateField('email', currentContact.email)) ||
                        (touched.email && !validateField('email', currentContact.email))
                        ? 'البريد الإلكتروني غير صالح'
                        : ''
                    }
                    {...getInputProps(
                      'email',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل بريدًا إلكترونيًا صالحًا (مثال: example@domain.com)',
                    )}
                  />
                  {renderExplanation('email')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الهاتف"
                    name="phone"
                    value={currentContact.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('phone', currentContact.phone)) ||
                      (touched.phone && !validateField('phone', currentContact.phone))
                    }
                    helperText={
                      (isSubmitted && !validateField('phone', currentContact.phone)) ||
                        (touched.phone && !validateField('phone', currentContact.phone))
                        ? 'يجب أن يبدأ رقم الهاتف بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم'
                        : ''
                    }
                    {...getInputProps(
                      'phone',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل رقم هاتف صالح (مثال: 01012345678)',
                    )}
                  />
                  {renderExplanation('phone')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الواتساب"
                    name="whatsapp"
                    value={currentContact.whatsapp}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('whatsapp', currentContact.whatsapp)) ||
                      (touched.whatsapp && !validateField('whatsapp', currentContact.whatsapp))
                    }
                    helperText={
                      (isSubmitted && !validateField('whatsapp', currentContact.whatsapp)) ||
                        (touched.whatsapp && !validateField('whatsapp', currentContact.whatsapp))
                        ? 'يجب أن يبدأ رقم الواتساب بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم'
                        : ''
                    }
                    {...getInputProps(
                      'whatsapp',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل رقم واتساب صالح (مثال: 01012345678)',
                    )}
                  />
                  {renderExplanation('whatsapp')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="الفيس بوك"
                    name="facebook"
                    value={currentContact.facebook}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('facebook', currentContact.facebook)) ||
                      (touched.facebook && !validateField('facebook', currentContact.facebook))
                    }
                    helperText={
                      (isSubmitted && !validateField('facebook', currentContact.facebook)) ||
                        (touched.facebook && !validateField('facebook', currentContact.facebook))
                        ? 'هذا الحقل مطلوب'
                        : ''
                    }
                    {...getInputProps(
                      'facebook',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل رابط الفيس بوك الخاص بجهة الاتصال',
                    )}
                  />
                  {renderExplanation('facebook')}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="العنوان"
                    name="address"
                    value={currentContact.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                      (isSubmitted && !validateField('address', currentContact.address)) ||
                      (touched.address && !validateField('address', currentContact.address))
                    }
                    helperText={
                      (isSubmitted && !validateField('address', currentContact.address)) ||
                        (touched.address && !validateField('address', currentContact.address))
                        ? 'هذا الحقل مطلوب'
                        : ''
                    }
                    {...getInputProps(
                      'address',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل العنوان الكامل لجهة الاتصال',
                    )}
                  />
                  {renderExplanation('address')}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات"
                    name="notes"
                    multiline
                    value={currentContact.notes}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    {...getInputProps(
                      'notes',
                      currentContact,
                      touched,
                      isSubmitted,
                      validateField,
                      handleInputReset,
                      handleBlur,
                      false,
                      'أدخل أي ملاحظات إضافية حول جهة الاتصال',
                    )}
                  />
                  {renderExplanation('notes')}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "10px",
              borderTop: `#0A7EA4 solid 1px`,
            }}
          >
            <Button
              onClick={handleSaveContact}
              sx={{
                border: `#0A7EA4 solid 1px`,
                color: "#0A7EA4",
                backgroundColor: '#fff',
                '&:hover': {
                  backgroundColor: "#0A7EA4",
                  color: '#fff',
                },
              }}
              variant="contained"
            >
              حفظ
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogContent>
            <Typography>هل أنت متأكد من حذف جهة الاتصال؟</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              إلغاء
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              حذف
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={6000}
          onClose={() => setShowSuccessAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
          >
            تم حذف جهة الاتصال بنجاح
          </MuiAlert>
        </Snackbar>
      </FormLayout>
    </>
  );
};

export default ContactsSection;