import React from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip,
    Paper,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const TableHeader = ({
    totalItems,
    onSearchChange,
    onSortChange,
    onSortOrderChange,
    handlePrint,
    handleExportExcel,
    currentSort,
    currentSortOrder,
    addBtn,
    selectedRows,
    tableTitle,
}) => {
    const printTableRef = React.useRef();

    const handlePrintInternal = useReactToPrint({
        content: () => printTableRef.current,
    });

    const handleExportExcelInternal = () => {
        const ws = XLSX.utils.json_to_sheet(selectedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'exported_data.xlsx');
    };

    return (
        <Paper ref={printTableRef} style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{tableTitle}</h2>
                <div>{addBtn}</div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <FormControl variant="outlined" size="small" style={{ minWidth: '120px' }}>
                    <InputLabel>ترتيب على حسب</InputLabel>
                    <Select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="name">الاسم</MenuItem>
                        <MenuItem value="date">التاريخ</MenuItem>
                        <MenuItem value="quantity">الكمية</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" style={{ minWidth: '120px' }}>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={currentSortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value)}
                        label="Order"
                    >
                        <MenuItem value="asc">تصاعدي</MenuItem>
                        <MenuItem value="desc">تنازلي</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title="طباعة Excel">
                    <IconButton onClick={handleExportExcelInternal}>
                        <FileDownloadIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="طباعة PDF">
                    <IconButton onClick={handlePrintInternal}>
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <span>العدد الكلي: {totalItems}</span>
            </div>
        </Paper>
    );
};

export default TableHeader;
