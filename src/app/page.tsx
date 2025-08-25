"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Alert,
  Fade,
  Zoom,
  useTheme,
} from "@mui/material";
import {
  Add,
  Remove,
  Person,
  Group,
  ArrowForward,
  EmojiPeople,
} from "@mui/icons-material";
import { usePeople } from "@/providers/PeopleProvider";

export default function HomePage() {
  const router = useRouter();
  const { setPeople } = usePeople();
  const theme = useTheme();

  const [names, setNames] = useState<string[]>([""]);
  const [showAlert, setShowAlert] = useState(false);

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const addField = () => {
    setNames([...names, ""]);
  };

  const removeField = (index: number) => {
    if (names.length > 1) {
      setNames(names.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const filtered = names.map((n) => n.trim()).filter((n) => n !== "");
    if (filtered.length > 0) {
      setPeople(filtered);
      router.push("/tasks");
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box textAlign="center" mb={4}>
            <Group
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
              تقسیم‌کننده وظایف
            </Typography>
            <Typography variant="h6" color="text.secondary">
              اسامی افرادی که می‌خواهید در تقسیم وظایف مشارکت کنند را وارد کنید
            </Typography>
          </Box>

          <Zoom in={true} timeout={500}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f5f7fa 100%)`,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <EmojiPeople color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="medium">
                  وارد کردن اسامی افراد
                </Typography>
              </Box>

              {showAlert && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  لطفاً حداقل یک نام معتبر وارد کنید.
                </Alert>
              )}

              <Box mb={3}>
                {names.map((name, index) => (
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
                      <TextField
                        fullWidth
                        label={`نام فرد ${index + 1}`}
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addField();
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => removeField(index)}
                        disabled={names.length === 1}
                        color="error"
                        sx={{
                          borderRadius: 2,
                          bgcolor: names.length === 1 ? "transparent" : "rgba(244, 67, 54, 0.08)",
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <IconButton
                        onClick={addField}
                        color="success"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "rgba(76, 175, 80, 0.08)",
                        }}
                      >
                        <Add />
                      </IconButton>
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
                ادامه به تقسیم وظایف
              </Button>

              <Box mt={3} pt={2} borderTop={`1px dashed ${theme.palette.divider}`}>
                <Typography variant="caption" color="text.secondary">
                  💡 برای افزودن فیلد جدید می‌توانید از دکمه + استفاده کنید یا در آخرین فیلد، کلید Enter را فشار دهید.
                </Typography>
              </Box>
            </Paper>
          </Zoom>
        </Box>
      </Fade>
    </Container>
  );
}