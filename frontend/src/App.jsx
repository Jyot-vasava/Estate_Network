import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globle.css";

function App() {
  const { mode } = useSelector((state) => state.theme);

  // Create MUI theme based on mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#0ea5e9",
            light: "#38bdf8",
            dark: "#0284c7",
          },
          secondary: {
            main: "#d946ef",
            light: "#e879f9",
            dark: "#c026d3",
          },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f8fafc",
            paper: mode === "dark" ? "#1e293b" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: mode === "dark" ? "#1e293b" : "#ffffff",
            color: mode === "dark" ? "#f1f5f9" : "#0f172a",
            border: `1px solid ${mode === "dark" ? "#334155" : "#e2e8f0"}`,
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
