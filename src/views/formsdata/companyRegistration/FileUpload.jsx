import React, { useState, useCallback } from 'react';
import { IconFile, IconEye, IconX, IconTrash, IconPhoto, IconFileTypePdf } from '@tabler/icons-react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    ListItemText,
    ListItemIcon,
    ListItem,
    List,
    Paper,
    IconButton,
    Box,
    Dialog,
    Typography,
    Button,
    DialogContent,
    DialogTitle,
    DialogActions,
    Alert,
    Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const processFiles = (newFiles) => {
        const fileObjects = Array.from(newFiles).map((file) => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            type: file.type
        }));
        setFiles((prev) => [...prev, ...fileObjects]);
    };

    const handleFileChange = (event) => {
        processFiles(event.target.files);
    };

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = [...e.dataTransfer.files];
        processFiles(droppedFiles);
    }, []);

    const initiateDelete = (file) => {
        setFileToDelete(file);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (fileToDelete) {
            setFiles((prevFiles) => {
                const fileToRemove = prevFiles.find((f) => f.id === fileToDelete.id);
                if (fileToRemove) {
                    URL.revokeObjectURL(fileToRemove.url);
                }
                return prevFiles.filter((f) => f.id !== fileToDelete.id);
            });
            setDeleteConfirmOpen(false);
            setFileToDelete(null);
            setShowSuccessAlert(true); 
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccessAlert(false);
    };


    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setFileToDelete(null);
    };

    const handlePreview = (file) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) {
            return <IconPhoto size={32} stroke={1.5} />;
        } else if (fileType === 'application/pdf' || fileType.endsWith('.pdf')) {
            return <IconFileTypePdf size={32} stroke={1.5}/>;
        }
        return <IconFile size={32} stroke={1.5}  />;
    };

    const isPreviewable = (fileType) => {
        return fileType.startsWith('image/') || fileType === 'application/pdf' || fileType.endsWith('.pdf');
    };

    React.useEffect(() => {
        return () => {
            files.forEach((file) => {
                URL.revokeObjectURL(file.url);
            });
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4 }}>
            <Paper
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    width: '100%',
                    border: '2px dashed',
                    borderColor: isDragging ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'primary.light' : 'background.paper',
                    transition: 'background-color 0.3s, border-color 0.3s',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: isDragging ? 'primary.main' : 'grey.500' }} />
                    <Typography variant="h6" color="textSecondary">
                        قم بسحب وإفلات الملفات هنا
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        أو
                    </Typography>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 2 }}
                    >
                        اختر الملفات
                        <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
                    </Button>
                </Box>
            </Paper>

            <List sx={{ width: '100%', mt: 2 }}>
                {files.map((file) => (
                    <ListItem
                        key={file.id}
                        secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isPreviewable(file.file.type) && (
                                    <IconButton 
                                        sx={{ color: '#0A7EA4' }}
                                        onClick={() => handlePreview(file)}
                                    >
                                        <IconEye size={20} stroke={1.5} />
                                    </IconButton>
                                )}
                                <IconButton
                                    size="small"
                                    onClick={() => initiateDelete(file)}
                                    sx={{ color: '#dc3545' }}
                                >
                                    <IconTrash size={16} />
                                </IconButton>
                            </Box>
                        }
                        sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}
                    >
                        <ListItemIcon sx={{ color: '#dc3545' }}>
                            {getFileIcon(file.file.type)}
                        </ListItemIcon>
                        <ListItemText 
                            primary={file.file.name}
                            secondary={`${(file.file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                    </ListItem>
                ))}
            </List>

            <Dialog 
                open={showPreview} 
                onClose={handleClosePreview}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '90vh',
                        maxHeight: '90vh',
                        m: 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2
                }}>
                    <Typography variant="h6">معاينة الملف: {previewFile?.file.name}</Typography>
                    <IconButton onClick={handleClosePreview} size="small">
                        <IconX size={20} stroke={1.5} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ 
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {previewFile && (
                        previewFile.file.type.startsWith('image/') ? (
                            <img
                                src={previewFile.url}
                                alt={previewFile.file.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <iframe
                                src={previewFile.url}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    border: 'none',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px'
                                }}
                                title="File Preview"
                            />
                        )
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <Typography>
                        هل أنت متأكد من حذف الملف "{fileToDelete?.file.name}"؟
                    </Typography>
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
                autoHideDuration={2000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseAlert}
                    elevation={6}
                    variant="filled"
                    severity={alert.severity}
                >
                    تم حذف الملف بنجاح
                </Alert>
            </Snackbar>

            {files.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    تم رفع {files.length} ملفات
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;