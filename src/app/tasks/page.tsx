"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Fade,
  Zoom,
  useTheme,
  styled
} from "@mui/material";
import { Add, Remove, Assignment, ArrowForward, EmojiEvents } from "@mui/icons-material";
import { useTasks } from "@/providers/TasksProvider";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f5f7fa 100%)`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.divider}`,
}));

const TaskTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
  },
  '& .MuiOutlinedInput-root:hover': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
  }
}));

export default function TasksPage() {
  const router = useRouter();
  const { setTasks } = useTasks();
  const theme = useTheme();

  const [taskList, setTaskList] = useState<string[]>([""]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleTaskChange = (index: number, value: string) => {
    const updated = [...taskList];
    updated[index] = value;
    setTaskList(updated);
  };

  const addField = () => {
    setTaskList([...taskList, ""]);
  };

  const removeField = (index: number) => {
    if (taskList.length > 1) {
      setTaskList(taskList.filter((_, i) => i !== index));
    } else {
      setAlertMessage("حداقل یک فیلد وظیفه باید وجود داشته باشد");
      setShowAlert(true);
    }
  };

  const handleSubmit = () => {
    const filtered = taskList.map((t) => t.trim()).filter((t) => t !== "");
    if (filtered.length > 0) {
      setTasks(filtered);
      router.push("/date-range");
    } else {
      setAlertMessage("لطفاً حداقل یک وظیفه معتبر وارد کنید");
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box textAlign="center" mb={4}>
            <EmojiEvents
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              تعریف وظایف
            </Typography>
            <Typography variant="h6" color="text.secondary">
              وظایفی که باید بین افراد تقسیم شوند را وارد کنید
            </Typography>
          </Box>

          <Zoom in={true} timeout={500}>
            <StyledPaper>
              <Box display="flex" alignItems="center" mb={3}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="medium">
                  لیست وظایف
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                می‌توانید با استفاده از دکمه‌های افزودن و حذف، تعداد فیلدها را تغییر دهید.
              </Typography>

              <Box mb={3}>
                {taskList.map((task, index) => (
                  <Zoom in={true} key={index} timeout={(index + 1) * 200}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={2}
                      gap={1}
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <TaskTextField
                        fullWidth
                        label={`وظیفه ${index + 1}`}
                        value={task}
                        onChange={(e) => handleTaskChange(index, e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Assignment color="action" />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="مثلاً: ‌آماده کردن صبحانه"
                      />
                      <IconButton
                        onClick={() => removeField(index)}
                        disabled={taskList.length === 1}
                        color="error"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: taskList.length === 1 ? 'transparent' : 'rgba(244, 67, 54, 0.08)'
                        }}
                      >
                        <Remove />
                      </IconButton>
                      {index === taskList.length - 1 && (
                        <IconButton 
                          onClick={addField} 
                          color="success"
                          sx={{ 
                            borderRadius: 2, 
                            backgroundColor: 'rgba(76, 175, 80, 0.08)' 
                          }}
                        >
                          <Add />
                        </IconButton>
                      )}
                    </Box>
                  </Zoom>
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleSubmit}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                ادامه به انتخاب بازه زمانی
              </Button>

              <Box mt={3} pt={2} borderTop={`1px dashed ${theme.palette.divider}`}>
                <Typography variant="caption" color="text.secondary">
                  💡 برای افزودن فیلد جدید می‌توانید از دکمه + استفاده کنید.
                </Typography>
              </Box>
            </StyledPaper>
          </Zoom>
        </Box>
      </Fade>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="warning" 
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: theme.shadows[4]
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}