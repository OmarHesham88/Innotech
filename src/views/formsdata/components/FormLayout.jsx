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
} from '@mui/material';
import { IconChecks, IconInfoCircle, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons';

export const ExpansionContext = createContext();

export const FormLayout = ({
    title,
    children,
    onSubmit,
    loading = false,
    headerColor = '#0A7EA4',
    actionButtons,
    dialogTitle = 'معلومات إضافية',
    dialogContentText = '.....',
    showInfoIcon = true,
    showExpandButton = true,
    formExplanation = null,
}) => {
    const [open, setOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const [isAllExpanded, setIsAllExpanded] = useState(true);
    const [showFormExplanation, setShowFormExplanation] = useState(false);

    const [headerIconState, setHeaderIconState] = useState(true);

    useEffect(() => {
        const sectionStates = Object.values(expandedSections);

        if (sectionStates.length === 0) return;

        const allExpanded = sectionStates.every((state) => state === true);
        const allCollapsed = sectionStates.every((state) => state === false);

        if (allExpanded) {
            setHeaderIconState(true);
        } else if (allCollapsed) {
            setHeaderIconState(false);
        }
    }, [expandedSections]);

    const handleClickOpen = () => {
        if (formExplanation) {
            setShowFormExplanation(!showFormExplanation);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleAllSections = () => {
        const newState = !headerIconState;
        setHeaderIconState(newState);
        setIsAllExpanded(newState);

        const sectionsKeys = Object.keys(expandedSections);
        const newExpandedSections = {};
        sectionsKeys.forEach((key) => {
            newExpandedSections[key] = newState;
        });
        setExpandedSections(newExpandedSections);
    };

    const expansionContextValue = {
        expandedSections,
        setExpandedSections,
        isAllExpanded,
        setIsAllExpanded,
    };

    return (
        <ExpansionContext.Provider value={expansionContextValue}>
            <Card sx={{ padding: 0 }}>
                <CardHeader
                    title={title}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: "10px",
                        marginBottom: "10px",
                        borderBottom: `${headerColor} solid 1px`,
                        backgroundColor: headerColor,
                        color: "#fff",
                    }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {showExpandButton && (
                                <IconButton
                                    aria-label="toggle-sections"
                                    onClick={toggleAllSections}
                                    sx={{ color: '#fff' }}
                                >
                                    {headerIconState ? <IconChevronUp /> : <IconChevronDown />}
                                </IconButton>
                            )}
                            {showInfoIcon && (
                                <IconButton aria-label="info" onClick={handleClickOpen} sx={{ color: '#fff' }}>
                                    <IconInfoCircle />
                                </IconButton>
                            )}
                        </Box>
                    }
                />
                <form onSubmit={onSubmit}>
                    <CardContent sx={{
                        padding: "10px",
                    }}>
                        {formExplanation && showFormExplanation && (
                            <InputExplanation 
                                text={formExplanation} 
                                show={true} 
                                sx={{ 
                                    marginBottom: 2,
                                    padding: 2,
                                    backgroundColor: 'rgba(10, 126, 164, 0.05)',
                                    borderRadius: 1
                                }} 
                            />
                        )}
                        {children}
                    </CardContent>
                    <CardActions
                        sx={{
                            display: actionButtons === null ? 'none' : 'flex', // Hide completely if actionButtons is null
                            alignItems: 'center',
                            padding: '8px',
                            flexDirection: 'row-reverse',
                            borderTop: `1px solid ${headerColor}33`,
                        }}
                    >
                        {actionButtons || (
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    border: `${headerColor} solid 1px`,
                                    color: headerColor,
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        backgroundColor: headerColor,
                                        color: '#fff',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : <IconChecks />}
                                &nbsp;حفظ
                            </Button>
                        )}
                    </CardActions>
                </form>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            minWidth: { xs: '90%', sm: '550px' },
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {dialogTitle}
                        <IconButton aria-label="close" onClick={handleClose} sx={{ color: 'text.secondary' }}>
                            <IconX />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>{dialogContentText}</DialogContentText>
                    </DialogContent>
                </Dialog>
            </Card>
        </ExpansionContext.Provider>
    );
};