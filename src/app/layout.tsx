"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PeopleProvider } from "@/providers/PeopleProvider";
import { TasksProvider } from "@/providers/TasksProvider";
import { DatesProvider } from "@/providers/DatesProvider";

const theme = createTheme({
  typography: {
    fontFamily: "Vazirmatn, Arial, sans-serif",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body dir="rtl">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PeopleProvider>
            <TasksProvider>
              <DatesProvider>{children}</DatesProvider>
            </TasksProvider>
          </PeopleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
