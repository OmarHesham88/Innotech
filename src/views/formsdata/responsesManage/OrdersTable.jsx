import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { IconSearch, IconEye, IconEdit, IconBrandWhatsapp, IconFile, IconFileX, IconCheck, IconTrash } from '@tabler/icons-react';
import * as XLSX from 'xlsx';
import { IconX } from '@tabler/icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BorderedSection from '../components/BorderedSection';
import OrdersPDF from './OrdersPDF'; 

// Fixed fake data for orders
const initialOrders = [
    {
        id: 1,
        orderId: 'ORD123',
        customerName: 'محمد أحمد',
        orderDate: '2023-10-01',
        status: 'قيد التنفيذ',
        totalAmount: '1500 ريال',
        whatsapp: '+1234567890',
    },
    {
        id: 2,
        orderId: 'ORD456',
        customerName: 'علي خالد',
        orderDate: '2023-10-02',
        status: 'مكتمل',
        totalAmount: '2500 ريال',
        whatsapp: '+0987654321',
    },
    {
        id: 3,
        orderId: 'ORD789',
        customerName: 'سارة محمد',
        orderDate: '2023-10-03',
        status: 'ملغى',
        totalAmount: '1000 ريال',
        whatsapp: '+1122334455',
    },
];

const OrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(initialOrders);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editRowId, setEditRowId] = useState(null);
    const [editedOrder, setEditedOrder] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setFilteredOrders(
            initialOrders.filter((order) =>
                Object.values(order).some((value) =>
                    value.toString().toLowerCase().includes(event.target.value.toLowerCase())
                )
            )
        );
    };

    const handleOpenPreviewDialog = (order) => {
        setSelectedOrder(order);
        setOpenPreviewDialog(true);
    };

    const handleClosePreviewDialog = () => {
        setOpenPreviewDialog(false);
        setSelectedOrder(null);
    };

    const handleEdit = (order) => {
        setEditRowId(order.id);
        setEditedOrder(order);
    };

    const handleSave = () => {
        const updatedOrders = filteredOrders.map((order) =>
            order.id === editRowId ? editedOrder : order
        );
        setFilteredOrders(updatedOrders);
        setEditRowId(null);
        setEditedOrder({});
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditedOrder({});
    };

    const handleChange = (field, value) => {
        setEditedOrder({ ...editedOrder, [field]: value });
    };

    const handleExportPDF = () => {
        return (
            <PDFDownloadLink
                document={<OrdersPDF orders={filteredOrders} />}
                fileName="orders.pdf"
            >
                {({ loading }) => (loading ? 'جار التحميل...' : 'تصدير PDF')}
            </PDFDownloadLink>
        );
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'orders.xlsx');
    };

    const handleSendToWhatsApp = (whatsappNumber, order) => {
        const message = `تفاصيل الطلب:
- رقم الطلب: ${order.orderId}
- اسم العميل: ${order.customerName}
- تاريخ الطلب: ${order.orderDate}
- الحالة: ${order.status}
- المبلغ الإجمالي: ${order.totalAmount}`;
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleDeleteClick = (orderId) => {
        setOrderToDelete(orderId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        const updatedOrders = filteredOrders.filter((order) => order.id !== orderToDelete);
        setFilteredOrders(updatedOrders);
        setOpenDeleteDialog(false);
        setOrderToDelete(null);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setOrderToDelete(null);
    };

    return (
        <Box>
            <BorderedSection title="جدول الطلبات">
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
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<IconFile />}
                            onClick={handleExportPDF}
                            sx={{ marginRight: 2 }}
                        >
                            تصدير PDF
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<IconFileX />}
                            onClick={handleExportExcel}
                        >
                            تصدير Excel
                        </Button>
                    </Box>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>رقم الطلب</TableCell>
                                <TableCell>اسم العميل</TableCell>
                                <TableCell>تاريخ الطلب</TableCell>
                                <TableCell>الحالة</TableCell>
                                <TableCell>المبلغ الإجمالي</TableCell>
                                <TableCell>الإجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <TextField
                                                value={editedOrder.orderId}
                                                onChange={(e) => handleChange('orderId', e.target.value)}
                                            />
                                        ) : (
                                            order.orderId
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <TextField
                                                value={editedOrder.customerName}
                                                onChange={(e) => handleChange('customerName', e.target.value)}
                                            />
                                        ) : (
                                            order.customerName
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <TextField
                                                value={editedOrder.orderDate}
                                                onChange={(e) => handleChange('orderDate', e.target.value)}
                                            />
                                        ) : (
                                            order.orderDate
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <TextField
                                                value={editedOrder.status}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                            />
                                        ) : (
                                            order.status
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <TextField
                                                value={editedOrder.totalAmount}
                                                onChange={(e) => handleChange('totalAmount', e.target.value)}
                                            />
                                        ) : (
                                            order.totalAmount
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === order.id ? (
                                            <>
                                                <IconButton onClick={handleSave} color="primary" size="small">
                                                    <IconCheck />
                                                </IconButton>
                                                <IconButton onClick={handleCancel} color="error" size="small">
                                                    <IconX />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <IconButton
                                                    onClick={() => handleOpenPreviewDialog(order)}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <IconEye />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleEdit(order)}
                                                    color="warning"
                                                    size="small"
                                                >
                                                    <IconEdit />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleSendToWhatsApp(order.whatsapp, order)}
                                                    color="success"
                                                    size="small"
                                                >
                                                    <IconBrandWhatsapp />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(order.id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <IconTrash />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </BorderedSection>

            {/* Preview Dialog */}
            <Dialog open={openPreviewDialog} onClose={handleClosePreviewDialog}>
                <DialogTitle>معاينة الطلب</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <p>رقم الطلب: {selectedOrder.orderId}</p>
                            <p>اسم العميل: {selectedOrder.customerName}</p>
                            <p>تاريخ الطلب: {selectedOrder.orderDate}</p>
                            <p>الحالة: {selectedOrder.status}</p>
                            <p>المبلغ الإجمالي: {selectedOrder.totalAmount}</p>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreviewDialog}>إغلاق</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <p>هل أنت متأكد أنك تريد حذف هذا الطلب؟</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>إلغاء</Button>
                    <Button onClick={handleDeleteConfirm} color="error">حذف</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrdersTable;