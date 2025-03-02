
import React, { useState, createContext, useContext, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    IconButton,
    Box,
    Typography,
    InputAdornment,
} from '@mui/material';
import {
    IconChecks,
    IconInfoCircle,
    IconX,
    IconChevronDown,
    IconChevronUp,
    IconCircleCheck,
    IconExclamationCircle,
} from '@tabler/icons';
import { IconHelpOctagon } from '@tabler/icons-react';

const InputExplanation = ({ text, show = true, sx = {} }) => {
    if (!show) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mt: 1,
                color: 'warning.dark',
                ...sx,
            }}
        >
            <IconHelpOctagon
                size={16}
                style={{
                    marginRight: 8,
                    marginTop: 2,
                    flexShrink: 0,
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    color: 'inherit',
                    lineHeight: 1.5,
                }}
            >
                &nbsp;{text}
            </Typography>
        </Box>
    );
};

// Form Context
export const FormContext = createContext();
export const ExpansionContext = createContext();

// Enhanced Form Input with Explanation Integration
export const FormInput = () => {
    const [focusedInput, setFocusedInput] = useState(null);
    const [explanations, setExplanations] = useState({});
    const [showExplanations, setShowExplanations] = useState({});

    const toggleExplanation = (fieldName) => {
        setShowExplanations((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName],
        }));
    };

    const setExplanation = (fieldName, text) => {
        setExplanations((prev) => ({
            ...prev,
            [fieldName]: text,
        }));
    };

    const getInputStyle = (fieldName, touched, isSubmitted, validateField, formData) => {
        const value = formData[fieldName];
        const isTouched = touched[fieldName] || isSubmitted;
        const isValid = validateField(fieldName, value);

        const focusBorderColor = isTouched ? (isValid ? '#45a049' : '#f44336') : '#1976d2';

        return {
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: isTouched ? (isValid ? '#4caf50' : '#f44336') : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                    borderColor: isTouched ? (isValid ? '#45a049' : '#f44336') : 'rgba(0, 0, 0, 0.23)',
                },
                '&.Mui-focused fieldset': {
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 3px ${focusBorderColor}33`,
                },
                transition: 'box-shadow 0.3s ease-in-out',
            },
        };
    };

    const getInputProps = (
        fieldName,
        formData,
        touched,
        isSubmitted,
        validateField,
        handleInputReset,
        handleBlur,
        isSelect = false,
        explanationText = null,
    ) => {
        const value = formData[fieldName];
        const isTouched = touched[fieldName] || isSubmitted;
        const isValid = validateField(fieldName, value);
        const showValidation = isTouched && focusedInput !== fieldName;

        // Set explanation text if provided
        if (explanationText && !explanations[fieldName]) {
            setExplanation(fieldName, explanationText);
        }

        // Hide explanation when validation appears
        useEffect(() => {
            if (showValidation) {
                setShowExplanations((prev) => ({
                    ...prev,
                    [fieldName]: false,
                }));
            }
        }, [showValidation, fieldName]);

        const baseProps = {
            onFocus: () => setFocusedInput(fieldName),
            onBlur: (e) => {
                handleBlur(e);
                const isResetButton = e.relatedTarget?.getAttribute('data-reset-button') === 'true';
                const isInfoButton = e.relatedTarget?.getAttribute('data-info-button') === 'true';
                if (!isResetButton && !isInfoButton) {
                    setFocusedInput(null);
                }
            },
            sx: getInputStyle(fieldName, touched, isSubmitted, validateField, formData),
        };

        const validationIcon =
            showValidation &&
            value &&
            (isValid ? (
                <IconCircleCheck size={18} color="#4caf50" style={{ marginRight: 8 }} />
            ) : (
                <IconExclamationCircle size={18} color="#f44336" style={{ marginRight: 8 }} />
            ));

        const infoButton = explanations[fieldName] && (
            <IconButton
                data-info-button="true"
                onClick={() => toggleExplanation(fieldName)}
                size="small"
                sx={{
                    padding: '4px',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            >
                <IconHelpOctagon size={16} color="#0A7EA4" />
            </IconButton>
        );

        const resetButton = (
            <IconButton
                data-reset-button="true"
                onClick={(e) => handleInputReset(e, fieldName)}
                size="small"
                sx={{
                    padding: '4px',
                    marginRight: isSelect ? 1 : 0,
                    visibility: focusedInput === fieldName || formData[fieldName] ? 'visible' : 'hidden',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            >
                <IconX size={16} />
            </IconButton>
        );

        if (isSelect) {
            return {
                ...baseProps,
                SelectProps: {
                    endAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {validationIcon}
                            {infoButton}
                            {resetButton}
                        </Box>
                    ),
                },
            };
        }

        return {
            ...baseProps,
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        {validationIcon}
                        {infoButton}
                        {resetButton}
                    </InputAdornment>
                ),
            },
        };
    };

    const renderExplanation = (fieldName) => {
        if (!showExplanations[fieldName] || !explanations[fieldName]) return null;

        return <InputExplanation text={explanations[fieldName]} show={showExplanations[fieldName]} />;
    };

    return {
        focusedInput,
        getInputStyle,
        getInputProps,
        renderExplanation,
        toggleExplanation,
        setExplanation,
    };
};