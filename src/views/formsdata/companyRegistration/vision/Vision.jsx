import React, { useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
  MenuButtonStrikethrough,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonHorizontalRule,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
} from 'mui-tiptap';
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Stack,
  Paper,
  Typography,
} from '@mui/material';
import { IconDeviceFloppy, IconEdit, IconEye, IconTrash } from '@tabler/icons';

const Vision = () => {
  const [savedMessages, setSavedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const editorStyles = {
    '.ProseMirror': {
      minHeight: '300px',
      height: 'auto',
      padding: '16px',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
      '& p': {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      },
    },
    '.MuiTiptapMenuControlsContainer-root': {
      borderBottom: '1px solid #e0e0e0',
      padding: '8px',
      backgroundColor: '#f5f5f5',
      color: '#0A7EA4',
    },
    '.tiptap-container': {
      border: '1px solid #e0e0e0',
      marginTop: '8px',
      borderRadius: '8px',
      overflow: 'hidden',
      maxWidth: '100%',
      backgroundColor: '#e0e0e0',
      color: '#0A7EA4',
    },
    '.tiptap': {
      width: '100%',
      maxWidth: '100%',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: 'اكتب هنا...',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-full overflow-wrap-break-word',
        style: 'min-height: 300px; height: auto; padding: 16px;',
      },
    },
  });

  const getPreviewText = (htmlContent) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText;
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const handleSave = () => {
    if (content && content.trim() !== '<p></p>') {
      if (editingMessage) {
        setSavedMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage
              ? { ...msg, content: content, editedAt: new Date().toLocaleString() }
              : msg,
          ),
        );
        setEditingMessage(null);
      } else {
        const newMessage = {
          id: Date.now(),
          content: content,
          timestamp: new Date().toLocaleString(),
        };
        setSavedMessages((prev) => [newMessage, ...prev]);
      }
      if (editor) {
        editor.commands.setContent('');
      }
      setContent('');
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete === 'all') {
      setSavedMessages([]);
    } else {
      setSavedMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete));
    }
    setOpenDeleteDialog(false);
    setMessageToDelete(null);
  };

  const handleDeleteAll = () => {
    setMessageToDelete('all');
    setOpenDeleteDialog(true);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message.id);
    if (editor) {
      editor.commands.setContent(message.content);
    }
    setContent(message.content);
  };

  const handleOpenMessageDialog = (message) => {
    setSelectedMessage(message);
    setOpenMessageDialog(true);
  };

  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
    setSelectedMessage(null);
  };

  return (
    <Box className="w-full max-w-4xl mx-auto" p={0}>
      <Stack spacing={3}>
        <RichTextEditorProvider editor={editor}>
          <Box sx={editorStyles}>
            <Box className="tiptap-container">
              <MenuControlsContainer>
                <MenuSelectHeading sx={{ color: '#0A7EA4' }} />
                <MenuDivider sx={{ color: '#0A7EA4' }} />
                <MenuButtonBold sx={{ color: '#0A7EA4' }} />
                <MenuButtonItalic sx={{ color: '#0A7EA4' }} />
                <MenuButtonStrikethrough sx={{ color: '#0A7EA4' }} />
                <MenuDivider sx={{ color: '#0A7EA4' }} />
                <MenuButtonOrderedList sx={{ color: '#0A7EA4' }} />
                <MenuButtonBulletedList sx={{ color: '#0A7EA4' }} />
                <MenuDivider sx={{ color: '#0A7EA4' }} />
                <MenuButtonBlockquote sx={{ color: '#0A7EA4' }} />
                <MenuButtonCode sx={{ color: '#0A7EA4' }} />
                <MenuButtonHorizontalRule sx={{ color: '#0A7EA4' }} />
                <MenuDivider sx={{ color: '#0A7EA4' }} />
                <MenuButtonUndo sx={{ color: '#0A7EA4' }} />
                <MenuButtonRedo sx={{ color: '#0A7EA4' }} />
                <MenuDivider sx={{ color: '#0A7EA4' }} />
                <MenuButtonRemoveFormatting sx={{ color: '#0A7EA4' }} />
              </MenuControlsContainer>
            </Box>

            <RichTextField
              style={{
                minHeight: '300px',
                height: 'auto',
                padding: '16px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            />
          </Box>
        </RichTextEditorProvider>

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <IconButton color="primary" onClick={handleSave}>
            <IconDeviceFloppy />
          </IconButton>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            border: '1px solid #0A7EA4',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '24px',
            background: 'white',
          }}
        >
          <Stack
            direction={'column'}
            justifyContent={'space-between'}
            alignItems={'end'}
            sx={{ mb: 2 }}
          >
            {savedMessages.length > 0 && (
              <IconButton color="error" onClick={handleDeleteAll} size="small">
                <IconTrash />
              </IconButton>
            )}
          </Stack>

          {savedMessages.length === 0 ? (
            <Typography p={2} textAlign={'center'}>
              ليس هناك اي رسالة بعد.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {savedMessages.map((message) => (
                <Paper key={message.id} variant={'outlined'} sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
                      <Stack spacing={1} sx={{ flex: 1, mr: 2 }}>
                        <Typography variant={'caption'} color={'text.secondary'}>
                          {message.timestamp}
                          {message.editedAt && ' (edited ' + message.editedAt + ')'}
                        </Typography>
                        <Typography
                          variant={'body2'}
                          color={'text.secondary'}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { color: 'text.primary' },
                          }}
                          onClick={() => handleOpenMessageDialog(message)}
                        >
                          {getPreviewText(message.content)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditMessage(message)}
                          disabled={editingMessage !== null}
                        >
                          <IconEdit size={20} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenMessageDialog(message)}
                        >
                          <IconEye size={20} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageToDelete === 'all'
              ? 'هل أنت متأكد أنك تريد حذف كل الرسائل؟'
              : 'هل أنت متأكد انك تريد حذف هذه الرسالة؟'}{' '}
            لا يمكن الرجوع في ذلك.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openMessageDialog}
        onClose={handleCloseMessageDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '100%', sm: '80%', md: '500px' },
          },
        }}
      >
        <DialogTitle>تفاصيل الرسالة</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <div
              dangerouslySetInnerHTML={{ __html: selectedMessage.content }}
              style={{
                wordBreak: 'break-word',
                overflow: 'auto',
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog} color="primary">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vision;
