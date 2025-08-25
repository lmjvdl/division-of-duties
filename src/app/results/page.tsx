"use client";

import { usePeople } from "@/providers/PeopleProvider";
import { useTasks } from "@/providers/TasksProvider";
import { useDates } from "@/providers/DatesProvider";
import { assignTasks, Assignment } from "@/lib/assignTasks";

import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  styled,
  useTheme,
} from "@mui/material";

import * as XLSX from "xlsx";
import { Download, PictureAsPdf, TableChart, Share, CheckCircle } from "@mui/icons-material";
import { useState } from "react";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: '600',
    fontSize: '1rem',
  },
  '& .MuiTableCell-body': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const PersonCell = ({ person, people }: { person: string, people: string[] }) => {
  const theme = useTheme();
  const colorIndex = people.indexOf(person) % 5;
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
  ];
  
  return (
    <TableCell>
      <Chip 
        label={person || "-"} 
        size="small"
        color={person ? "primary" : "default"}
        variant={person ? "filled" : "outlined"}
        sx={{ 
          backgroundColor: person ? colors[colorIndex] : 'transparent',
          minWidth: 80,
          fontWeight: '500'
        }}
      />
    </TableCell>
  );
};

export default function ResultsPage() {
  const { people } = usePeople();
  const { tasks } = useTasks();
  const { dates } = useDates();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const theme = useTheme();

  const assignments: Assignment[] = assignTasks({ people, tasks, dates });

  const grouped: Record<string, Record<string, string>> = {};
  assignments.forEach((a) => {
    const dateKey = a.date.toLocaleDateString("fa-IR");
    if (!grouped[dateKey]) grouped[dateKey] = {};
    grouped[dateKey][a.task] = a.person;
  });

  const tableRows = Object.entries(grouped);

  const downloadExcel = () => {
    try {
      const header = ["تاریخ", ...tasks];
      const data = tableRows.map(([date, taskMap]) => [
        date,
        ...tasks.map((t) => taskMap[t] || ""),
      ]);

      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "نتایج");
      XLSX.writeFile(wb, "assignments.xlsx");
      
      setSnackbar({ open: true, message: 'فایل اکسل با موفقیت دانلود شد' });
    } catch {
      setSnackbar({ open: true, message: 'خطا در دانلود فایل اکسل' });
    }
  };

  const downloadPDFWithCanvas = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = await import("html2canvas");
  
      const element = document.getElementById('results-table');
      if (!element) {
        setSnackbar({ open: true, message: 'جدول پیدا نشد!' });
        return;
      }
  
      const canvas = await html2canvas.default(element, {
        scale: 2,
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('assignments.pdf');
  
      setSnackbar({ open: true, message: 'فایل PDF با موفقیت دانلود شد' });
    } catch (error) {
      console.error('خطا در تولید PDF:', error);
      setSnackbar({ open: true, message: 'خطا در دانلود فایل PDF' });
    }
  };
  
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'جدول تقسیم وظایف',
          text: 'نتایج تقسیم وظایف بین اعضای تیم',
          url: window.location.href,
        });
        setSnackbar({ open: true, message: 'نتایج با موفقیت به اشتراک گذاشته شد' });
      } catch {
        console.log('اشتراک گذاری لغو شد');
      }
    } else {
      setSnackbar({ open: true, message: 'قابلیت اشتراک گذاری در مرورگر شما پشتیبانی نمی شود' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <StyledPaper>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <TableChart color="primary" sx={{ ml: 1, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="600">
              جدول تقسیم وظایف
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Tooltip title="دانلود اکسل">
              <IconButton 
                onClick={downloadExcel}
                color="primary"
                sx={{ 
                  backgroundColor: theme.palette.primary.light,
                  '&:hover': { backgroundColor: theme.palette.primary.main }
                }}
              >
                <Download />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="دانلود PDF">
              <IconButton 
                onClick={downloadPDFWithCanvas}
                color="secondary"
                sx={{ 
                  backgroundColor: theme.palette.secondary.light,
                  '&:hover': { backgroundColor: theme.palette.secondary.main }
                }}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="اشتراک گذاری">
              <IconButton 
                onClick={shareResults}
                color="info"
                sx={{ 
                  backgroundColor: theme.palette.info.light,
                  '&:hover': { backgroundColor: theme.palette.info.main }
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          در این جدول، تقسیم‌بندی وظایف بین اعضای تیم در بازه زمانی مشخص شده نمایش داده شده است.
        </Alert>

        <Box sx={{ overflowX: 'auto' }}>
          <StyledTable id="results-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 120 }}>تاریخ</TableCell>
                {tasks.map((t, idx) => (
                  <TableCell key={idx} sx={{ minWidth: 150 }}>{t}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map(([date, taskMap], index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip 
                      label={date} 
                      color="default"
                      variant="outlined"
                      sx={{ fontWeight: '500' }}
                    />
                  </TableCell>
                  {tasks.map((t, i) => (
                    <PersonCell 
                      key={i} 
                      person={taskMap[t]} 
                      people={people} 
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </Box>

        {tableRows.length === 0 && (
          <Box textAlign="center" py={4}>
            <CheckCircle color="disabled" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              هیچ داده‌ای برای نمایش وجود ندارد
            </Typography>
          </Box>
        )}
      </StyledPaper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}