import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Grid,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Stack } from '@mui/system';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { FormInput } from '../components/FormInput';
import { FormLayout } from '../components/FormLayout';
import FileUpload from './FileUpload';
import BorderedSection from '../components/BorderedSection';
import Logo from './Logo';
import Vision from './vision/Vision';

const CompanyRegistration = ({ text = 'مؤسسة' }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    registrationNumber: '',
    taxId: '',
    capital: '',
    activityStatus: '',
    activityCode: '',
    establishmentDate: '',
    notificationEnabled: false,
    notificationDuration: 30,
    otherType: '',
    address: '',
    geolocation: '',
  });

  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const [editDialog, setEditDialog] = useState({
    open: false,
    typeId: null,
    value: '',
  });

  const [companyTypes, setCompanyTypes] = useState([
    { id: 'private', label: `${text} خاصة`, isDefault: true },
    { id: 'public', label: `${text} عامة`, isDefault: true },
    { id: 'other', label: 'أخرى', isDefault: true },
  ]);

  useEffect(() => {
    setCompanyTypes([
      { id: 'private', label: `${text} خاصة`, isDefault: true },
      { id: 'public', label: `${text} عامة`, isDefault: true },
      { id: 'other', label: 'أخرى', isDefault: true },
    ]);
  }, [text]);

  const activityStatuses = [
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'متوقف' },
    { value: 'liquidation', label: 'تحت التصفية' },
  ];

  const { getInputStyle, getInputProps, renderExplanation } = FormInput();

  const validateTaxId = (value) => {
    const regex = /^\d{3}-\d{3}-\d{3}$/;
    return regex.test(value || '');
  };

  const validateRegistrationNumber = (value) => {
    const regex = /^\d{4}-\d{5}-\d{5}$/;
    return regex.test(value || '');
  };

  const validateAddress = (value) => {
    return (value || '').trim().length >= 5;
  };

  const validateGeolocation = (value) => {
    const googleMapsRegex = /^https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9_-]+$/;
    return googleMapsRegex.test(value || '');
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return (
          /^[\u0600-\u06FFa-zA-Z\s]+$/.test((value || '').trim()) &&
          (value || '').trim().length >= 3
        );
      case 'taxId':
        return validateTaxId(value);
      case 'registrationNumber':
        return validateRegistrationNumber(value);
      case 'capital':
        return value > 0;
      case 'activityCode':
        return (value || '').trim().length > 0;
      case 'establishmentDate':
        return (value || '').trim().length > 0;
      case 'type':
        return (value || '').trim().length > 0;
      case 'activityStatus':
        return (value || '').trim().length > 0;
      case 'address':
        return validateAddress(value);
      case 'geolocation':
        return validateGeolocation(value);
      default:
        return true;
    }
  };

  const formatTaxId = (value = '') => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 9)}`;
  };

  const formatRegistrationNumber = (value = '') => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 9) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 9)}-${numbers.slice(9, 14)}`;
  };

  const handleInputReset = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      [fieldName]: '',
    }));
    setTouched((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
    setIsSubmitted(false);
  };

  const handleAddCustomType = () => {
    if ((formData.otherType || '').trim()) {
      const newType = {
        id: `custom-${Date.now()}`,
        label: formData.otherType,
        isDefault: false,
      };

      setCompanyTypes((prev) => [...prev, newType]);
      setFormData((prev) => ({
        ...prev,
        type: newType.id,
        otherType: '',
      }));
    }
  };

  const getSortedCompanyTypes = () => {
    const otherType = companyTypes.find((type) => type.id === 'other');
    const regularTypes = companyTypes.filter((type) => type.id !== 'other');

    const sortedRegularTypes = [...regularTypes].sort((a, b) => {
      if (a.isDefault !== b.isDefault) {
        return a.isDefault ? -1 : 1;
      }
      return a.label.localeCompare(b.label);
    });

    return otherType ? [...sortedRegularTypes, otherType] : sortedRegularTypes;
  };

  const renderMenuItemContent = (option) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <span>{option.label}</span>
        {!option.isDefault && (
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditDialog(option.id);
              }}
              sx={{ color: '#0A7EA4' }}
            >
              <IconEdit size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteType(option.id);
              }}
              sx={{ color: '#dc3545' }}
            >
              <IconTrash size={16} />
            </IconButton>
          </Stack>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isValid = Object.keys(formData).every(
      (field) => !requiresValidation(field) || validateField(field, formData[field]),
    );

    if (!isValid) {
      setAlert({
        open: true,
        message: 'يرجى التحقق من صحة البيانات المدخلة',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAlert({
        open: true,
        message: 'تم حفظ البيانات بنجاح',
        severity: 'success',
      });
      handleReset();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'حدث خطأ أثناء حفظ البيانات',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const requiresValidation = (fieldName) => {
    return [
      'name',
      'taxId',
      'registrationNumber',
      'capital',
      'activityCode',
      'establishmentDate',
      'type',
      'activityStatus',
    ].includes(fieldName);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      type: '',
      registrationNumber: '',
      taxId: '',
      capital: '',
      activityStatus: '',
      activityCode: '',
      establishmentDate: '',
      notificationEnabled: false,
      notificationDuration: 30,
      otherType: '',
    });
    setTouched({});
    setIsSubmitted(false);
  };

  const handleOpenEditDialog = (typeId) => {
    const type = companyTypes.find((t) => t.id === typeId);
    setEditDialog({
      open: true,
      typeId,
      value: type.label,
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      open: false,
      typeId: null,
      value: '',
    });
  };

  const handleUpdateType = () => {
    if ((editDialog.value || '').trim()) {
      setCompanyTypes((prev) =>
        prev.map((type) =>
          type.id === editDialog.typeId
            ? { ...type, label: (editDialog.value || '').trim() }
            : type,
        ),
      );
      handleCloseEditDialog();
      setAlert({
        open: true,
        message: `تم تحديث نوع ال${text} بنجاح`,
        severity: 'success',
      });
    } else {
      setAlert({
        open: true,
        message: `يرجى إدخال اسم صحيح لنوع ال${text}`,
        severity: 'error',
      });
    }
  };

  const handleDeleteType = (typeId) => {
    setCompanyTypes((prev) => prev.filter((type) => type.id !== typeId));
    if (formData.type === typeId) {
      setFormData((prev) => ({
        ...prev,
        type: '',
      }));

      setAlert({
        open: true,
        message: `تم حذف نوع ال${text} بنجاح`,
        severity: 'success',
      });
    }
  };

  const validNames =
    text === 'مؤسسة'
      ? ['مؤسسة 1', 'مؤسسة 2', 'مؤسسة 3', 'مؤسسة 4', 'مؤسسة']
      : ['شركة 1', 'شركة 2', 'شركة 3', 'شركة 4', 'شركة'];
  const [attempts, setAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const attemptsRef = useRef(0);

  const validateInstitutionName = (value) => {
    return validNames.includes(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
  
    if (name === 'taxId') {
      formattedValue = formatTaxId(value);
    } else if (name === 'registrationNumber') {
      formattedValue = formatRegistrationNumber(value);
    } else if (name === 'name') {
      formattedValue = value.replace(/[^\u0600-\u06FFa-zA-Z\s]/g, '');
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === 'name' && !isDisabled) {
      if ((formData[name] || '').trim().length > 0) {
        const passesGeneralValidation = validateField(name, formData[name]);
        const passesSpecificValidation = validateInstitutionName(formData[name]);

        if (!passesGeneralValidation || !passesSpecificValidation) {
          attemptsRef.current += 1;
          setAttempts(attemptsRef.current);

          if (attemptsRef.current >= 3) {
            setIsDisabled(true);
            setTimeLeft(10);
            attemptsRef.current = 0;
            setAttempts(0);
          }
        } else {
          attemptsRef.current = 0;
          setAttempts(0);
        }
      }
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isDisabled) {
      setIsDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isDisabled]);

  return (
    <>
      <FormLayout
        title={`تسجيل بيانات ال${text}`}
        dialogTitle={`تسجيل بيانات ال${text}`}
        onSubmit={handleSubmit}
        loading={loading}
        dialogContentText="....."
      >
        <BorderedSection title="تسجيل البيانات">
          <Grid container spacing={2} p={1}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="name"
                label={isDisabled ? `اسم ال${text} (مغلق لمدة ${timeLeft} ثواني)` : `اسم ال${text}`}
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={
                  (isSubmitted && !validateField('name', formData.name)) ||
                  (touched.name && !validateField('name', formData.name))
                }
                helperText={
                  isDisabled
                    ? `[🚫عدد المحاولات الخاطئة:3]  | نذكرك بذكر الله لحين الانتهاء ${timeLeft} | يجب إدخال اسم ال${text} صحيح`
                    : (isSubmitted && !validateField('name', formData.name)) ||
                      (touched.name && !validateField('name', formData.name))
                      ? 'يجب أن يحتوي الإسم على 3 أحرف على الأقل'
                      : ''
                }
                fullWidth
                disabled={isDisabled}
                {...getInputProps(
                  'name',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'يجب أن يحتوي اسم المؤسسة على 3 أحرف على الأقل ويجب أن يكون باللغة العربية أو الإنجليزية',
                )}
                sx={getInputStyle('name', touched, isSubmitted, validateField, formData)}
              />
              {renderExplanation('name')}
            </Grid>

{/* نوع المؤسسة Dropdown */}
<Grid item xs={12} md={6}>
  <CustomTextField
    select
    name="type"
    label={`نوع ال${text}`}
    value={formData.type}
    onChange={handleInputChange}
    error={(isSubmitted && !formData.type) || (touched.type && !formData.type)}
    helperText={
      (isSubmitted && !formData.type) || (touched.type && !formData.type)
        ? 'هذا الحقل مطلوب'
        : ''
    }
    fullWidth
    {...getInputProps(
      'type',
      formData,
      touched,
      isSubmitted,
      validateField,
      handleInputReset,
      handleBlur,
      true,
      'اختر نوع المؤسسة من القائمة أو أضف نوعًا جديدًا',
    )}
  >
    {getSortedCompanyTypes().map((option) => (
      <MenuItem key={option.id} value={option.id}>
        {renderMenuItemContent(option)}
      </MenuItem>
    ))}
  </CustomTextField>
  {renderExplanation('type')}
</Grid>

{/* نوع المؤسسة أخرى Field (Conditional Rendering) */}
{formData.type === 'other' && (
  <Grid item xs={12} md={12}>
    <CustomTextField
      name="otherType"
      label={`نوع ال${text} (أخرى)`}
      value={formData.otherType}
      onChange={handleInputChange}
      error={
        (isSubmitted && !formData.otherType) ||
        (touched.otherType && !formData.otherType)
      }
      helperText={
        (isSubmitted && !formData.otherType) ||
          (touched.otherType && !formData.otherType)
          ? `يرجى تحديد نوع ال${text}`
          : ''
      }
      fullWidth
      {...getInputProps(
        'otherType',
        formData,
        touched,
        isSubmitted,
        validateField,
        handleInputReset,
        handleBlur,
        false,
        'أدخل نوعًا جديدًا للمؤسسة إذا لم يكن موجودًا في القائمة',
      )}
      InputProps={{
        ...getInputProps(
          'otherType',
          formData,
          touched,
          isSubmitted,
          validateField,
          handleInputReset,
          handleBlur,
        ).InputProps,
        endAdornment: (
          <InputAdornment position="end">
            {
              getInputProps(
                'otherType',
                formData,
                touched,
                isSubmitted,
                validateField,
                handleInputReset,
                handleBlur,
              ).InputProps?.endAdornment
            }
            <IconButton
              onClick={handleAddCustomType}
              disabled={!(formData.otherType || '').trim()}
              sx={{
                color: '#086c8c',
                ml: 1,
              }}
            >
              <IconPlus />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    {renderExplanation('otherType')}
  </Grid>
)}

            <Dialog open={editDialog.open} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
              <DialogTitle>{`تعديل نوع ال${text}`}</DialogTitle>
              <DialogContent>
                <CustomTextField
                  autoFocus
                  margin="dense"
                  label={`نوع ال${text}`}
                  type="text"
                  fullWidth
                  value={editDialog.value}
                  onChange={(e) => setEditDialog((prev) => ({ ...prev, value: e.target.value }))}
                  error={(editDialog.value || '').trim() === ''}
                  helperText={(editDialog.value || '').trim() === '' ? 'هذا الحقل مطلوب' : ''}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseEditDialog}
                  sx={{
                    color: '#fff',
                    backgroundColor: '#0A7EA4',
                    '&:hover': {
                      color: '#666',
                      backgroundColor: '#fff',
                    },
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdateType}
                  disabled={(editDialog.value || '').trim() === ''}
                  sx={{
                    color: '#0A7EA4',
                    '&:hover': {
                      backgroundColor: 'rgba(10, 126, 164, 0.08)',
                      color: '#0A7EA4',
                    },
                  }}
                >
                  حفظ التغييرات
                </Button>
              </DialogActions>
            </Dialog>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="taxId"
                label="رقم البطاقة الضريبية"
                value={formData.taxId}
                onChange={handleInputChange}
                error={
                  (isSubmitted && !validateTaxId(formData.taxId)) ||
                  (touched.taxId && !validateTaxId(formData.taxId))
                }
                helperText={
                  (isSubmitted && !validateTaxId(formData.taxId)) ||
                    (touched.taxId && !validateTaxId(formData.taxId))
                    ? 'صيغة غير صحيحة (###-###-###)'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'taxId',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'يجب أن يتكون رقم البطاقة الضريبية من 9 أرقام بتنسيق ###-###-###',
                )}
              />
              {renderExplanation('taxId')}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="registrationNumber"
                label="رقم السجل التجاري"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                error={
                  (isSubmitted && !validateRegistrationNumber(formData.registrationNumber)) ||
                  (touched.registrationNumber &&
                    !validateRegistrationNumber(formData.registrationNumber))
                }
                helperText={
                  (isSubmitted && !validateRegistrationNumber(formData.registrationNumber)) ||
                    (touched.registrationNumber &&
                      !validateRegistrationNumber(formData.registrationNumber))
                    ? 'صيغة غير صحيحة (####-#####-#####)'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'registrationNumber',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'يجب أن يتكون رقم السجل التجاري من 14 رقمًا بتنسيق ####-#####-#####',
                )}
              />
              {renderExplanation('registrationNumber')}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="capital"
                label="رأس مال الشركة"
                type="number"
                value={formData.capital}
                onChange={handleInputChange}
                error={(isSubmitted && !formData.capital) || (touched.capital && !formData.capital)}
                helperText={
                  (isSubmitted && !formData.capital) || (touched.capital && !formData.capital)
                    ? 'هذا الحقل مطلوب'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'capital',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'أدخل رأس مال الشركة بالأرقام فقط',
                )}
              />
              {renderExplanation('capital')}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                select
                name="activityStatus"
                label="حالة النشاط"
                value={formData.activityStatus}
                onChange={handleInputChange}
                error={
                  (isSubmitted && !formData.activityStatus) ||
                  (touched.activityStatus && !formData.activityStatus)
                }
                helperText={
                  (isSubmitted && !formData.activityStatus) ||
                    (touched.activityStatus && !formData.activityStatus)
                    ? 'هذا الحقل مطلوب'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'activityStatus',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  true,
                  'اختر حالة النشاط الحالية للمؤسسة',
                )}
              >
                {activityStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
              {renderExplanation('activityStatus')}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="activityCode"
                label="كود النشاط"
                value={formData.activityCode}
                onChange={handleInputChange}
                error={
                  (isSubmitted && !formData.activityCode) ||
                  (touched.activityCode && !formData.activityCode)
                }
                helperText={
                  (isSubmitted && !formData.activityCode) ||
                    (touched.activityCode && !formData.activityCode)
                    ? 'هذا الحقل مطلوب'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'activityCode',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'أدخل كود النشاط الخاص بالمؤسسة',
                )}
              />
              {renderExplanation('activityCode')}
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="establishmentDate"
                label="تاريخ التأسيس"
                type="date"
                value={formData.establishmentDate}
                onChange={handleInputChange}
                error={
                  (isSubmitted && !formData.establishmentDate) ||
                  (touched.establishmentDate && !formData.establishmentDate)
                }
                helperText={
                  (isSubmitted && !formData.establishmentDate) ||
                    (touched.establishmentDate && !formData.establishmentDate)
                    ? 'هذا الحقل مطلوب'
                    : ''
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
                {...getInputProps(
                  'establishmentDate',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'أدخل تاريخ تأسيس المؤسسة',
                )}
              />
              {renderExplanation('establishmentDate')}
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="address"
                label="العنوان"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={
                  (isSubmitted && !validateAddress(formData.address)) ||
                  (touched.address && !validateAddress(formData.address))
                }
                helperText={
                  (isSubmitted && !validateAddress(formData.address)) ||
                    (touched.address && !validateAddress(formData.address))
                    ? 'يجب أن يحتوي العنوان على 5 أحرف على الأقل'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'address',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'أدخل العنوان الكامل للمؤسسة',
                )}
                sx={getInputStyle('address', touched, isSubmitted, validateField, formData)}
              />
              {renderExplanation('address')}
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="geolocation"
                label="الموقع الجغرافي"
                value={formData.geolocation}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={
                  (isSubmitted && !validateGeolocation(formData.geolocation)) ||
                  (touched.geolocation && !validateGeolocation(formData.geolocation))
                }
                helperText={
                  (isSubmitted && !validateGeolocation(formData.geolocation)) ||
                    (touched.geolocation && !validateGeolocation(formData.geolocation))
                    ? 'يجب إدخال رابط خرائط Google صحيح (مثال: https://maps.app.goo.gl/75jn6iXCFc9)'
                    : ''
                }
                fullWidth
                {...getInputProps(
                  'geolocation',
                  formData,
                  touched,
                  isSubmitted,
                  validateField,
                  handleInputReset,
                  handleBlur,
                  false,
                  'أدخل رابط خرائط Google للموقع الجغرافي للمؤسسة',
                )}
                sx={getInputStyle('geolocation', touched, isSubmitted, validateField, formData)}
              />
              {renderExplanation('geolocation')}
            </Grid>
          </Grid>
          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity={alert.severity}
              onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
            >
              {alert.message}
            </MuiAlert>
          </Snackbar>
        </BorderedSection>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BorderedSection title="رفع الملفات">
              <FileUpload />
            </BorderedSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <BorderedSection title="رفع الشعار">
              <Logo />
            </BorderedSection>
          </Grid>
        </Grid>
        <BorderedSection title=" الرسالة">
          <Vision />
        </BorderedSection>
      </FormLayout>
    </>
  );
};

export default CompanyRegistration;