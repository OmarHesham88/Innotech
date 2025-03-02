import { useState } from 'react';
import BorderedSection from '../../formsdata/components/BorderedSection';
import { FormLayout } from '../../formsdata/components/FormLayout';
import { Snackbar, Alert as MuiAlert, MenuItem, Box, Chip, Grid, IconButton } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { FormInput } from '../../formsdata/components/FormInput';
import AddContract from './AddContract';
import ContractData from './ContractData';
import { IconCircleCheck, IconExclamationCircle, IconX } from '@tabler/icons';

const ContractManagement = () => {
    const { getInputStyle, getInputProps, focusedInput } = FormInput();
    const [touched, setTouched] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [allItem, setAllItem] = useState([]);

    // Add contract terms options
    const contractTermsOptions = [
        { id: 1, label: 'شروط الدفع والسداد' },
        { id: 2, label: 'مدة العقد والتجديد' },
        { id: 3, label: 'حقوق والتزامات الطرف الأول' },
        { id: 4, label: 'حقوق والتزامات الطرف الثاني' },
        { id: 5, label: 'شروط إنهاء العقد' },
        { id: 6, label: 'السرية وعدم المنافسة' },
        { id: 7, label: 'القانون المطبق والاختصاص القضائي' },
        { id: 8, label: 'القوة القاهرة' },
        { id: 9, label: 'التعويضات والجزاءات' },
        { id: 10, label: 'آلية حل النزاعات' },
    ];

    const [formData, setFormData] = useState({
        contractTitle: '',
        firstParty: '',
        secondParty: '',
        from: '',
        toDate: '',
        contractTerms: [], // Array for multiple selections
    });

    const handleReset = () => {
        setFormData({
            contractTitle: '',
            firstParty: '',
            secondParty: '',
            from: '',
            toDate: '',
            contractTerms: [],
        });
        setTouched({});
        setIsSubmitted(false);
    };

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const validateField = (name, value) => {
        switch (name) {
            case 'contractTitle':
                return (
                    /^[\u0600-\u06FFa-zA-Z\s]+$/.test((value || '').trim()) &&
                    (value || '').trim().length >= 3
                );
            case 'firstParty':
                return (
                    /^[\u0600-\u06FFa-zA-Z\s]+$/.test((value || '').trim()) &&
                    (value || '').trim().length >= 3
                );
            case 'secondParty':
                return (
                    /^[\u0600-\u06FFa-zA-Z\s]+$/.test((value || '').trim()) &&
                    (value || '').trim().length >= 3
                );
            case 'from':
                return (value || '').trim().length > 0;
            case 'toDate':
                return (value || '').trim().length > 0;
            case 'contractTerms':
                return Array.isArray(value) && value.length > 0;
            default:
                return true;
        }
    };

    const handleInputReset = (e, fieldName) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldName === 'contractTerms' ? [] : '',
        }));
        setTouched((prev) => ({
            ...prev,
            [fieldName]: false,
        }));
        setIsSubmitted(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    // Special handler for multi-select
    const handleMultiSelectChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const isValid = Object.keys(formData).every((field) => validateField(field, formData[field]));

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

    return (
        <>
            <FormLayout
                title={`تسجيل وتوثيق العقود و الأصول `}
                dialogTitle={`تسجيل وتوثيق العقود و الأصول `}
                onSubmit={handleSubmit}
                loading={loading}
                dialogContentText="....."
            >
                <BorderedSection title="توثيق العقد ">
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12} md={4}>
                            <CustomTextField
                                name="contractTitle"
                                label={' عنوان العقد '}
                                value={formData.contractTitle}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={
                                    (isSubmitted && !validateField('contractTitle', formData.contractTitle)) ||
                                    (touched.contractTitle && !validateField('contractTitle', formData.contractTitle))
                                }
                                helperText={
                                    (isSubmitted && !formData.contractTitle) ||
                                        (touched.contractTitle && !formData.contractTitle)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                fullWidth
                                disabled={isDisabled}
                                {...getInputProps(
                                    'contractTitle',
                                    formData,
                                    touched,
                                    isSubmitted,
                                    validateField,
                                    handleInputReset,
                                    handleBlur,
                                )}
                                sx={getInputStyle('contractTitle', touched, isSubmitted, validateField, formData)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CustomTextField
                                name="firstParty"
                                label={' الطرف الأول'}
                                value={formData.firstParty}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={
                                    (isSubmitted && !validateField('firstParty', formData.firstParty)) ||
                                    (touched.firstParty && !validateField('firstParty', formData.firstParty))
                                }
                                helperText={
                                    (isSubmitted && !formData.firstParty) ||
                                        (touched.firstParty && !formData.firstParty)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                fullWidth
                                disabled={isDisabled}
                                {...getInputProps(
                                    'firstParty',
                                    formData,
                                    touched,
                                    isSubmitted,
                                    validateField,
                                    handleInputReset,
                                    handleBlur,
                                )}
                                sx={getInputStyle('firstParty', touched, isSubmitted, validateField, formData)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CustomTextField
                                name="secondParty"
                                label={' الطرف الثاني '}
                                value={formData.secondParty}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={
                                    (isSubmitted && !validateField('secondParty', formData.secondParty)) ||
                                    (touched.secondParty && !validateField('secondParty', formData.secondParty))
                                }
                                helperText={
                                    (isSubmitted && !formData.secondParty) ||
                                        (touched.secondParty && !formData.secondParty)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                fullWidth
                                disabled={isDisabled}
                                {...getInputProps(
                                    'secondParty',
                                    formData,
                                    touched,
                                    isSubmitted,
                                    validateField,
                                    handleInputReset,
                                    handleBlur,
                                )}
                                sx={getInputStyle('secondParty', touched, isSubmitted, validateField, formData)}
                            />
                        </Grid>
                        {/* Contract Terms Multi-Select - Fixed */}
                        <Grid item xs={12} md={12}>
                            <CustomTextField
                                select
                                name="contractTerms"
                                label="بنود العقد"
                                value={formData.contractTerms}
                                onChange={handleMultiSelectChange}
                                onBlur={handleBlur}
                                error={
                                    (isSubmitted && !validateField('contractTerms', formData.contractTerms)) ||
                                    (touched.contractTerms && !validateField('contractTerms', formData.contractTerms))
                                }
                                helperText={
                                    (isSubmitted && !formData.contractTerms?.length) ||
                                        (touched.contractTerms && !formData.contractTerms?.length)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                fullWidth
                                sx={getInputStyle('contractTerms', touched, isSubmitted, validateField, formData)}
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const option = contractTermsOptions.find((opt) => opt.id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={option?.label}
                                                        size="small"
                                                        sx={{ margin: '0 2px 2px 0' }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    ),
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: 250,
                                            },
                                        },
                                    },
                                    endAdornment: (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {touched.contractTerms &&
                                                focusedInput !== 'contractTerms' &&
                                                formData.contractTerms &&
                                                (validateField('contractTerms', formData.contractTerms) ? (
                                                    <IconCircleCheck size={18} color="#4caf50" style={{ marginRight: 8 }} />
                                                ) : (
                                                    ''
                                                ))}
                                            <IconButton
                                                data-reset-button="true"
                                                onClick={(e) => handleInputReset(e, 'contractTerms')}
                                                size="small"
                                                sx={{
                                                    padding: '4px',
                                                    marginRight: 1,
                                                    visibility:
                                                        focusedInput === 'contractTerms' || formData.contractTerms.length
                                                            ? 'visible'
                                                            : 'hidden',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                    },
                                                }}
                                            >
                                                <IconX size={16} />
                                            </IconButton>
                                        </Box>
                                    ),
                                }}
                                disabled={isDisabled}
                                onFocus={() => setFocusedInput('contractTerms')}
                            >
                                {contractTermsOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <AddContract allItem={allItem} setAllItem={setAllItem} />
                        </Grid>
                        {/* from Date */}
                        <Grid item xs={12} md={5}>
                            <CustomTextField
                                name="from"
                                label=" من "
                                type="date"
                                value={formData.from}
                                onChange={handleInputChange}
                                error={(isSubmitted && !formData.from) || (touched.from && !formData.from)}
                                helperText={
                                    (isSubmitted && !formData.from) || (touched.from && !formData.from)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                {...getInputProps(
                                    'from',
                                    formData,
                                    touched,
                                    isSubmitted,
                                    validateField,
                                    handleInputReset,
                                    handleBlur,
                                )}
                            />
                        </Grid>
                        {/* to Date */}
                        <Grid item xs={12} md={5}>
                            <CustomTextField
                                name="toDate"
                                label="  الي "
                                type="date"
                                value={formData.toDate}
                                onChange={handleInputChange}
                                error={(isSubmitted && !formData.toDate) || (touched.toDate && !formData.toDate)}
                                helperText={
                                    (isSubmitted && !formData.toDate) || (touched.toDate && !formData.toDate)
                                        ? 'هذا الحقل مطلوب'
                                        : ''
                                }
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                {...getInputProps(
                                    'toDate',
                                    formData,
                                    touched,
                                    isSubmitted,
                                    validateField,
                                    handleInputReset,
                                    handleBlur,
                                )}
                            />
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
            </FormLayout>
            <ContractData />
        </>
    );
};

export default ContractManagement;
