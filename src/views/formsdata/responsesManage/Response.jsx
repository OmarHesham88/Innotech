import React, { useState } from 'react';
import OrdersCards from './OrdersCards';
import { FormLayout } from '../components/FormLayout';
import OrdersTable from './OrdersTable';
import { Card } from '@mui/material';


const Response = () => {


    return (
        <>
            {/* <BorderedSection title="النوع">
                <RadioGroup
                    row
                    value={text}
                    onChange={handleTextChange}
                >
                    <FormControlLabel value="مؤسسة" control={<Radio />} label="مؤسسة" />
                    <FormControlLabel value="شركة" control={<Radio />} label="شركة" />
                </RadioGroup>
            </BorderedSection>

            <CompanyRegistration text={text} />
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <FormLayout
                    title="جهات الاتصال"
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                >
                    <ContactsSection />
                </FormLayout>
            </Card>
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <FormLayout
                    title="الرسالة"
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                >
                    <TiptapEdit text={text} />
                </FormLayout>
            </Card>
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <CardHeader title="الشعار" sx={{ backgroundColor: '#0A7EA4', color: 'white', }} />
                <Thumbnail text={text} />
            </Card>
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <CardHeader title="QR Code" sx={{ backgroundColor: '#0A7EA4', color: 'white', }} />
                <QR text={text} />
            </Card>
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <CardHeader title={`جدول ملخص ${text === "مؤسسة" ? "المؤسسات" : "الشركات"}`} sx={{ backgroundColor: '#0A7EA4', color: 'white', }} />
                <EditableTable text={text} /> */}
            {/* </Card> */}
            <FormLayout
                    title="الطلبات"
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                    showExpandButton={false}
                >
            <OrdersCards />
            </FormLayout>
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
            <FormLayout
                    title="عرض الطلبات"
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                    // showExpandButton={false}
                >
            <OrdersTable />
            </FormLayout>
            </Card>
        </>
    );
};

export default Response;