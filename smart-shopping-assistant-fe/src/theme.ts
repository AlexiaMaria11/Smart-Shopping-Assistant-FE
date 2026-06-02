import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#800020",
      dark: "#5c0016",
      contrastText: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: "8px 24px",
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 4px 14px rgba(128, 0, 32, 0.28)",
            "&:hover": {
              backgroundColor: "#5c0016",
              boxShadow: "0 6px 20px rgba(128, 0, 32, 0.38)",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 18px rgba(128, 0, 32, 0.08)",
          border: "1px solid #f0e0e5",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 32px rgba(128, 0, 32, 0.16)",
          },
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: "0 12px 48px rgba(128, 0, 32, 0.15)",
          overflow: "hidden",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          fontSize: "1.2rem",
          color: "#ffffff",
          backgroundColor: "#800020",
          padding: "20px 28px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px 28px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 28px 24px",
          gap: 10,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "24px 0 0 24px",
          boxShadow: "-6px 0 48px rgba(128, 0, 32, 0.14)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorSuccess: {
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
