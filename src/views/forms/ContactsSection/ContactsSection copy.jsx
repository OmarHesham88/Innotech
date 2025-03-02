import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';

const ContactsSection = () => {
  // Initial fake data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      username: 'محمد أحمد',
      role: 'مدير',
      email: 'mohamed@company.com',
      phone: '+966551234567',
      faceData: 'رمز الوجه: MA-123-456',
    },
    {
      id: 2,
      username: 'فاطمة علي',
      role: 'مشرف',
      email: 'fatima@company.com',
      phone: '+966547654321',
      faceData: 'رمز الوجه: FA-789-012',
    },
    {
      id: 3,
      username: 'خالد سعيد',
      role: 'موظف',
      email: 'khaled@company.com',
      phone: '+966509876543',
      faceData: 'رمز الوجه: KS-345-678',
    },
  ]);

  // State management
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newContact, setNewContact] = useState({
    username: '',
    role: '',
    email: '',
    phone: '',
    faceData: '',
  });

  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterFaceData, setFilterFaceData] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({
    username: '',
    role: '',
    email: '',
    phone: '',
    faceData: '',
  });

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      role: '',
      email: '',
      phone: '',
      faceData: '',
    };

    if (!newContact.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
      isValid = false;
    }

    if (!newContact.role) {
      newErrors.role = 'الدور مطلوب';
      isValid = false;
    }

    if (!newContact.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newContact.email)) {
      newErrors.email = 'بريد إلكتروني غير صحيح';
      isValid = false;
    }

    if (!newContact.phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
      isValid = false;
    }

    if (!newContact.faceData) {
      newErrors.faceData = 'بيانات الوجه مطلوبة';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Dialog handlers
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setNewContact({ username: '', role: '', email: '', phone: '', faceData: '' });
    setErrors({ username: '', role: '', email: '', phone: '', faceData: '' });
  };

  // Delete handlers
  const handleOpenDeleteDialog = (contact) => {
    setCurrentContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCurrentContact(null);
  };

  // Call functionality
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Edit contact
  const handleEdit = (contact) => {
    setNewContact(contact);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Delete contact
  const handleDelete = () => {
    setContacts(contacts.filter((contact) => contact.id !== currentContact.id));
    handleCloseDeleteDialog();
  };

  // Input change handler
  const handleInputChange = (e) => {
    setNewContact({
      ...newContact,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Save contact
  const handleSaveContact = () => {
    if (!validateForm()) return;

    if (isEditing) {
      setContacts(contacts.map((contact) => (contact.id === newContact.id ? newContact : contact)));
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.username.includes(filterName) &&
      contact.phone.includes(filterPhone) &&
      contact.role.includes(filterRole) &&
      contact.faceData.includes(filterFaceData)
    );
  });

  return (
    <Box sx={{ fontSize: '1.1rem', border: '1px solid #0A7EA4 ', borderRadius: '10px' }}>
      {/* Filter Section */}
      <Typography
        variant="h4"
        sx={{ mb: 2, background: '#0A7EA4', color: '#ffff', padding: '15px 10px' }}
      >
        جهات الاتصال
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          mb: 3,
          flexWrap: 'wrap',
          '& .MuiInputBase-root': { fontSize: '1.1rem' },
          '& .MuiInputLabel-root': { fontSize: '1.1rem' },
        }}
      >
        <TextField
          label="البحث بالاسم"
          variant="outlined"
          size="small"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="البحث بالهاتف"
          variant="outlined"
          size="small"
          value={filterPhone}
          onChange={(e) => setFilterPhone(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="البحث ببيانات الوجه"
          variant="outlined"
          size="small"
          value={filterFaceData}
          onChange={(e) => setFilterFaceData(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>الدور</InputLabel>
          <Select
            value={filterRole}
            label="الدور"
            onChange={(e) => setFilterRole(e.target.value)}
            sx={{ fontSize: '1.1rem' }}
          >
            <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
              الكل
            </MenuItem>
            <MenuItem value="مدير" sx={{ fontSize: '1.1rem' }}>
              مدير
            </MenuItem>
            <MenuItem value="مشرف" sx={{ fontSize: '1.1rem' }}>
              مشرف
            </MenuItem>
            <MenuItem value="موظف" sx={{ fontSize: '1.1rem' }}>
              موظف
            </MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            ml: 'auto',
            fontSize: '1.1rem',
            padding: '8px 20px',
          }}
        >
          إضافة جهة اتصال جديدة
        </Button>
      </Box>

      {/* Contacts Table */}
      <TableContainer component={Paper}>
        <Table sx={{ '& .MuiTableCell-root': { fontSize: '1.1rem' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>اسم المستخدم</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>الدور</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                البريد الإلكتروني
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>رقم الهاتف</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>بيانات الوجه</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell sx={{ fontSize: '1.1rem' }}>{contact.username}</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>{contact.role}</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>{contact.email}</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>{contact.phone}</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>{contact.faceData}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(contact)} sx={{ fontSize: '1.3rem' }}>
                    <EditIcon color="primary" fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(contact)}
                    sx={{ fontSize: '1.3rem' }}
                  >
                    <DeleteIcon color="error" fontSize="inherit" />
                  </IconButton>
                  <IconButton onClick={() => handleCall(contact.phone)} sx={{ fontSize: '1.3rem' }}>
                    <PhoneIcon color="success" fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontSize: '1.3rem' }}>
          {isEditing ? 'تعديل الاتصال' : 'إضافة جهة اتصال جديدة'}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 400,
            pt: 2,
            '& .MuiInputBase-root': { fontSize: '1.1rem' },
            '& .MuiInputLabel-root': { fontSize: '1.1rem' },
          }}
        >
          <TextField
            name="username"
            label="اسم المستخدم"
            value={newContact.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
            sx={{mt:3}}
          />

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>الدور</InputLabel>
            <Select name="role" value={newContact.role} label="الدور" onChange={handleInputChange}>
              <MenuItem value="مدير" sx={{ fontSize: '1.1rem' }}>
                مدير
              </MenuItem>
              <MenuItem value="مشرف" sx={{ fontSize: '1.1rem' }}>
                مشرف
              </MenuItem>
              <MenuItem value="موظف" sx={{ fontSize: '1.1rem' }}>
                موظف
              </MenuItem>
            </Select>
            {errors.role && (
              <span style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.role}</span>
            )}
          </FormControl>

          <TextField
            name="email"
            label="البريد الإلكتروني"
            type="email"
            value={newContact.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            name="phone"
            label="رقم الهاتف"
            value={newContact.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <TextField
            name="faceData"
            label="بيانات الوجه"
            value={newContact.faceData}
            onChange={handleInputChange}
            error={!!errors.faceData}
            helperText={errors.faceData}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ fontSize: '1.1rem' }}>
            إلغاء
          </Button>
          <Button onClick={handleSaveContact} variant="contained" sx={{ fontSize: '1.1rem' }}>
            {isEditing ? 'حفظ التغييرات' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ fontSize: '1.3rem' }}>تأكيد الحذف</DialogTitle>
        <DialogContent sx={{ fontSize: '1.1rem' }}>
          هل أنت متأكد من رغبتك في حذف {currentContact?.username}؟
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ fontSize: '1.1rem' }}>
            إلغاء
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ fontSize: '1.1rem' }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactsSection;
