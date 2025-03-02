import React, { useState } from 'react';
import CompanyRegistration from './CompanyRegistration';
import { Card, CardHeader, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import EditableTable from './editable/EditableTable';
import BorderedSection from '../components/BorderedSection';

const Registration = () => {
    const [text, setText] = useState("مؤسسة");

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    return (
        <>
            <BorderedSection title="النوع">
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
            {/* <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <FormLayout
                    title="جهات الاتصال"
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                >
                    <ContactsSection />
                </FormLayout>
            </Card> */}
            <Card sx={{ padding: 0, margin: '20px 0px' }}>
                <CardHeader title={`جدول ملخص ${text === "مؤسسة" ? "المؤسسات" : "الشركات"}`} sx={{ backgroundColor: '#0A7EA4', color: 'white', }} />
                <EditableTable text={text} />
            </Card>
        </>
    );
};

export default Registration;