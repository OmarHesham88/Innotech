import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Arabic font
Font.register({
    family: 'Cairo',
    src: {
        family: 'Cairo',
        fonts: [
            {
                src: 'https://fonts.gstatic.com/s/cairo/v20/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.ttf',
                fontWeight: 'normal',
            },
        ],
    },
});

// Define PDF styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'rtl',
        backgroundColor: '#ffffff',
        padding: 30,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'right',
        fontFamily: 'Cairo',
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
    },
    tableHeader: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f0f0f0',
        padding: 5,
        textAlign: 'right',
        fontSize: 12,
        fontFamily: 'Cairo',
    },
    tableCell: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        textAlign: 'right',
        fontSize: 10,
        fontFamily: 'Cairo',
    },
});

const OrdersPDF = ({ orders }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>جدول الطلبات</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableHeader}>رقم الطلب</Text>
                    <Text style={styles.tableHeader}>اسم العميل</Text>
                    <Text style={styles.tableHeader}>تاريخ الطلب</Text>
                    <Text style={styles.tableHeader}>الحالة</Text>
                    <Text style={styles.tableHeader}>المبلغ الإجمالي</Text>
                </View>
                {orders.map((order) => (
                    <View style={styles.tableRow} key={order.id}>
                        <Text style={styles.tableCell}>{order.orderId}</Text>
                        <Text style={styles.tableCell}>{order.customerName}</Text>
                        <Text style={styles.tableCell}>{order.orderDate}</Text>
                        <Text style={styles.tableCell}>{order.status}</Text>
                        <Text style={styles.tableCell}>{order.totalAmount}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default OrdersPDF;