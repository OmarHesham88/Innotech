import React, { useState } from 'react';
import { TextField, Box, Grid, Alert as MuiAlert, Snackbar } from '@mui/material';
import BorderedSection from '../components/BorderedSection';
import { FormLayout } from '../components/FormLayout';
import { FormInput } from '../components/FormInput';

const DelegateRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const { getInputProps, renderExplanation } = FormInput();

    const validateField = (fieldName, value = '') => {
        switch (fieldName) {
            case 'name':
                return value.trim().length >= 2;
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            default:
                return true;
        }
    };

    const getErrorMessage = (fieldName) => {
        if (!touched[fieldName] && !isSubmitted) return '';

        switch (fieldName) {
            case 'name':
                return !formData.name.trim()
                    ? 'الاسم مطلوب'
                    : formData.name.trim().length < 2
                        ? 'الاسم يجب أن يحتوي على حرفين على الأقل'
                        : '';
            case 'email':
                return !formData.email.trim()
                    ? 'البريد الإلكتروني مطلوب'
                    : !validateField('email', formData.email)
                        ? 'يرجى إدخال بريد إلكتروني صحيح'
                        : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputReset = (e, fieldName) => {
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            [fieldName]: '',
        }));
        setTouched((prev) => ({
            ...prev,
            [fieldName]: false,
        }));
    };

    const handleBlur = (fieldName) => {
        setTouched((prev) => ({
            ...prev,
            [fieldName]: true,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const isValid = validateField('name', formData.name) && validateField('email', formData.email);

        if (isValid) {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('Form submitted:', formData);

                // Show success message
                setAlert({
                    open: true,
                    message: 'تم حفظ البيانات بنجاح',
                    severity: 'success',
                });

                setFormData({
                    name: '',
                    email: '',
                });
                setTouched({
                    name: false,
                    email: false,
                });
                setIsSubmitted(false);
            } catch (error) {
                console.error('Submission error:', error);
                setAlert({
                    open: true,
                    message: 'حدث خطأ أثناء حفظ البيانات',
                    severity: 'error',
                });
            } finally {
                setLoading(false);
            }
        } else {
            setAlert({
                open: true,
                message: 'يرجى إدخال جميع البيانات المطلوبة بشكل صحيح',
                severity: 'warning',
            });
        }
    };

    return (
        <>
            <FormLayout
                title=" تسجيل بيانات المفوض"
                dialogTitle="نموذج تسجيل بيانات المفوض"
                onSubmit={handleSubmit}
                loading={loading}
            >
                <BorderedSection title="نموذج تسجيل بيانات المفوض">
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="الاسم"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={Boolean(getErrorMessage('name'))}
                                    helperText={getErrorMessage('name')}
                                    {...getInputProps(
                                        'name',
                                        formData,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        () => handleBlur('name'),
                                        false,
                                        'أدخل الاسم الكامل للمفوض',
                                    )}
                                />
                                {renderExplanation('name')}
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="البريد الإلكتروني"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={Boolean(getErrorMessage('email'))}
                                    helperText={getErrorMessage('email')}
                                    {...getInputProps(
                                        'email',
                                        formData,
                                        touched,
                                        isSubmitted,
                                        validateField,
                                        handleInputReset,
                                        () => handleBlur('email'),
                                        false,
                                        'أدخل بريدًا إلكترونيًا صالحًا (مثال: example@domain.com)',
                                    )}
                                />
                                {renderExplanation('email')}
                            </Grid>
                        </Grid>
                    </Box>
                </BorderedSection>
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
            </FormLayout>
        </>
    );
};

export default DelegateRegister;