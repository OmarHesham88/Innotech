import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, Alert as MuiAlert } from '@mui/material';
import { IconCheck, IconChecks, IconInfoCircle, IconPlus, IconX } from '@tabler/icons';
import React, { useState } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AddContract = ({ allItem, setAllItem }) => {
    const [open, setOpen] = useState(false);
    const [newItem, setNewItem] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info',
    });


    const handleSave = () => {
        setIsSubmitted(true);
        if (newItem.trim()) {
            setLoading(true)
            setAlert({
                open: true,
                message: 'تم حفظ البيانات بنجاح',
                severity: 'success',
            });
            setAllItem((prevArray) => [...prevArray, newItem]);
            setNewItem("")
            setIsSubmitted(false);
        } else {
            setAlert({
                open: true,
                message: 'يرجى التحقق من صحة البيانات المدخلة',
                severity: 'error',
            });
        }
        setLoading(false)

    };
    console.log("allItem", allItem);

    return (
        <>
            <Button
                variant="contained"
                sx={{
                    border: `#0A7EA4 solid 1px`,
                    color: "#0A7EA4",
                    backgroundColor: '#fff',
                    '&:hover': {
                        backgroundColor: "#0A7EA4",
                        color: '#fff',
                    },
                }}
                onClick={handleOpen}
            >
                <IconPlus />
                إضافة بند جديد
            </Button>
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
                        padding: "10px",
                        marginBottom: "10px",
                        borderBottom: `#0A7EA4 solid 1px`,
                        backgroundColor: "#0A7EA4",
                        color: "#fff",
                    }}
                >
                    إضافة بنود جديدة
                    <IconButton
                        sx={{
                            backgroundColor: '#EFF9FF',
                            color: "black",
                            '&:hover': { color: '#0074BA' }
                        }}
                        aria-label="close"
                        size="small"
                        onClick={handleClose}
                    >
                        <IconX size={18} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12}>
                            <CustomTextField
                                label="إضافة بند جديد"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                fullWidth
                                error={isSubmitted && !newItem.trim()}
                                helperText={isSubmitted && !newItem.trim() ? 'هذا الحقل مطلوب' : ''}
                            />
                        </Grid>
                    </Grid>
                    {/* <DialogContentText>dialogContentText</DialogContentText> */}
                </DialogContent>
                <DialogActions sx={{
                    padding: "10px",
                    borderTop: `#0A7EA4 solid 1px`,
                }}>
                    <Button
                        type="submit"
                        onClick={handleSave}
                        disabled={loading}
                        endIcon={loading ? <CircularProgress size={20} /> : <IconChecks />}
                        sx={{
                            border: `#0A7EA4 solid 1px`,
                            color: "#0A7EA4",
                            backgroundColor: '#fff',
                            '&:hover': {
                                backgroundColor: "#0A7EA4",
                                color: '#fff',
                            },
                        }}
                    >
                        إضافة
                    </Button>

                    <Snackbar
                        open={alert.open}
                        autoHideDuration={6000}
                        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddContract;