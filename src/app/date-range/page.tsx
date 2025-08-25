"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Fade,
  styled
} from "@mui/material";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type DateObject from "react-date-object";
import { useDates } from "@/providers/DatesProvider";
import { Event } from "@mui/icons-material";

type DateRange = [DateObject, DateObject] | null;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  borderRadius: 16,
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
}));

const StyledDatePicker = styled(DatePicker)({
  '& .rmdp-container': {
    width: '100%',
  },
  '& .rmdp-input': {
    border: '1px solid #ccc',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
    '&:focus': {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
      outline: 'none',
    }
  },
  '& .rmdp-day.rmdp-selected span': {
    backgroundColor: '#1976d2 !important',
  },
  '& .rmdp-range': {
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
  },
  '& .rmdp-day.rmdp-today span': {
    color: '#1976d2',
    fontWeight: 'bold'
  }
});

export default function DateRangePage() {
  const router = useRouter();
  const { setDates } = useDates();

  const [range, setRange] = useState<DateRange>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (value: unknown) => {
    if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
      setRange(value as [DateObject, DateObject]);
    } else {
      setRange(null);
    }
  };

  const handleSubmit = () => {
    if (!range) {
      setAlertMessage("لطفاً یک بازه زمانی معتبر انتخاب کنید.");
      setShowAlert(true);
      return;
    }

    const [startObj, endObj] = range;

    const start = startObj.toDate();
    const end = endObj.toDate();

    const startDate = start <= end ? start : end;
    const endDate = start <= end ? end : start;

    const days: Date[] = [];
    const cursor = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    while (cursor <= endDate) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    setDates(days);
    router.push("/results");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const formatSelectedRange = () => {
    if (!range) return null;
    
    const [start, end] = range;
    return (
      <Typography variant="body2" color="text.secondary" mt={2}>
        بازه انتخابی: از {start.format("DD MMMM YYYY")} تا {end.format("DD MMMM YYYY")}
      </Typography>
    );
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Event color="primary" sx={{ ml: 1, fontSize: 32 }} />
          <Typography variant="h4" fontWeight="600">
            انتخاب بازه زمانی
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          بازه زمانی مورد نظر برای برنامه‌ریزی وظایف را انتخاب کنید.
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <StyledDatePicker
            range
            value={range ?? []}
            onChange={handleChange}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-center"
            inputClass="custom-input"
            placeholder="برای انتخاب بازه زمانی کلیک کنید"
            render={(value: string, openCalendar: () => void) => {
              return (
                <Box 
                  onClick={openCalendar}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    width: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
                    }
                  }}
                >
                  <Typography variant="body1">
                    {value || "برای انتخاب بازه زمانی کلیک کنید"}
                  </Typography>
                </Box>
              );
            }}
          />
        </Box>

        {formatSelectedRange()}

        <Fade in={true}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!range}
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                opacity: 0.7,
                transform: 'none',
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={handleSubmit}
          >
            ادامه
          </Button>
        </Fade>
      </StyledPaper>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}