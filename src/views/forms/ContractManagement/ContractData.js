import { Avatar, Box, Button, Card, IconButton, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip } from "@mui/material";
import { FormLayout } from "../../formsdata/components/FormLayout";
import BorderedSection from "../../formsdata/components/BorderedSection";
import { IconDotsCircleHorizontal, IconEdit, IconSearch, IconTrash } from "@tabler/icons";
import { useState } from "react";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import PrintContract from "./PrintContract";
import { Print as PrintIcon } from '@mui/icons-material';


const ContractData = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const initialContracts = [
        {
            contractTitle: 'عقد توظيف',
            firstParty: 'شركة التقنية',
            secondParty: 'محمد أحمد علي',
            contractTerms: ['توظيف مطور برمجيات بدوام كامل', 'راتب شهري قدره 123 ريال', 'إجازة سنوية 30 يوم'],
            from: '2024-01-01',
            to: '2025-01-01'
        },
        {
            contractTitle: 'عقد خدمات تسويقية',
            firstParty: 'شركة التسويق',
            secondParty: 'علي محمود سعيد',
            contractTerms: ['تقديم خدمات استشارية في مجال التسويق الرقمي', 'تطوير استراتيجية تسويقية متكاملة', 'إعداد تقارير شهرية عن أداء الحملات'],
            from: '2024-02-01',
            to: '2024-08-01'
        },
        {
            contractTitle: 'عقد توظيف موارد بشرية',
            firstParty: 'شركة الموارد البشرية',
            secondParty: 'فاطمة حسن محمد',
            contractTerms: ['إدارة شؤون الموظفين وعمليات التوظيف', 'تطوير سياسات الموارد البشرية', 'تنظيم برامج تدريبية للموظفين'],
            from: '2024-03-01',
            to: '2025-03-01'
        }
    ];
    const [contracts, setcontracts] = useState(initialContracts);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page when searching
    };
    const filteredcontracts = contracts.filter((contract) => {
        const matchesSearch = Object.values(contract).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        );
        const matchesCategory = filterCategory ? contract.department === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get the current page's data
    const getCurrentPageData = () => {
        const startIndex = page * rowsPerPage;
        return filteredcontracts.slice(startIndex, startIndex + rowsPerPage);
    };

    return (
        <>
            <Box sx={{ margin: '30px 0px' }}>
                <FormLayout
                    title=" جدول توثيق العقود "
                    actionButtons={null}
                    dialogTitle=""
                    dialogContentText=""
                    showInfoIcon={false}
                >
                    <BorderedSection title=" جدول توثيق العقود " >
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
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>عنوان العقد</TableCell>
                                        <TableCell> الطرف الأول </TableCell>
                                        <TableCell>الطرف الثاني </TableCell>
                                        <TableCell> بنود العقد </TableCell>
                                        <TableCell> من </TableCell>
                                        <TableCell> الي </TableCell>
                                        <TableCell> الإجراءات </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getCurrentPageData().map((contract, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{contract.contractTitle}</TableCell>
                                            <TableCell>{contract.firstParty}</TableCell>
                                            <TableCell>{contract.secondParty}</TableCell>
                                            <TableCell>{contract.contractTerms}</TableCell>
                                            <TableCell>{contract.from}</TableCell>
                                            <TableCell>{contract.to}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    <Tooltip title="طباعة">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                const printWindow = window.open('', '_blank');
                                                                printWindow.document.write(`
                                                                                            <html dir="rtl">
                                                                                                <head>
                                                                                                    <title>${contract.contractTitle}</title>
                                                                                                    <style>
                                                                                                        body { font-family: Arial, sans-serif; padding: 20px; }
                                                                                                        h1 { text-align: center; margin-bottom: 30px; }
                                                                                                        .contract-info { margin: 20px 0; }
                                                                                                        .dates { display: flex; justify-content: space-between; margin-top: 30px; }
                                                                                                    </style>
                                                                                                </head>
                                                                                                <body>
                                                                                                    <h1>${contract.contractTitle}</h1>
                                                                                                    <div class="contract-info">
                                                                                                        <p><strong>الطرف الأول:</strong> ${contract.firstParty}</p>
                                                                                                        <p><strong>الطرف الثاني:</strong> ${contract.secondParty}</p>
                                                                                                    </div>
                                                                                                    <div class="contract-info">
                                                                                                        <h2>بنود العقد:</h2>
                                                                                                        <p>${contract.contractTerms}</p>
                                                                                                    </div>
                                                                                                    <div class="dates">
                                                                                                        <p>من: ${contract.from}</p>
                                                                                                        <p>إلى: ${contract.to}</p>
                                                                                                    </div>
                                                                                                </body>
                                                                                            </html>
                                                                                        `);
                                                                printWindow.document.close();
                                                                printWindow.print();
                                                            }}
                                                        >
                                                            <PrintIcon sx={{ color: 'primary.main' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="تعديل">
                                                        <IconButton size="small" sx={{ color: 'warning.main' }}>
                                                            <IconEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="حذف">
                                                        <IconButton size="small" sx={{ color: '#dc3545' }} >
                                                            <IconTrash />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            {/* <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                    <Tooltip title="تعديل">
                                                        <IconButton
                                                            size="small"
                                                        >
                                                            <EditIcon sx={{ color: 'warning.main' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="حذف">
                                                        <IconButton
                                                            size="small"
                                                        >
                                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="حذف">
                                                        <PrintContract contract ={contract}/>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[25, 50, 100]}
                            component="div"
                            count={filteredcontracts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="عدد الصفوف:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
                            }
                        />
                    </BorderedSection>
                </FormLayout>
            </Box>
        </>
    );
};

export default ContractData;