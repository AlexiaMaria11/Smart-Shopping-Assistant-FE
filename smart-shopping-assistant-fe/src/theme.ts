import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#722F37",
      dark: "#4A1520",
      light: "#9B4A55",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#C4907C",
      dark: "#9A6855",
      light: "#E8C0B0",
      contrastText: "#1C0A08",
    },
    background: {
      default: "#FBF5EE",
      paper: "#ffffff",
    },
    text: {
      primary: "#1C0A08",
      secondary: "#7A4F3A",
    },
    info: {
      main: "#2E7D9E",
      light: "#E3F3F8",
      contrastText: "#ffffff",
    },
    success: {
      main: "#5C8A4E",
      light: "#EAF3E7",
      contrastText: "#ffffff",
    },
    error: {
      main: "#C62828",
      light: "#FCE8E8",
      contrastText: "#ffffff",
    },
    divider: "#E4CEBC",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: "9px 28px",
          fontSize: "0.9rem",
          "&.MuiButton-containedPrimary": {
            background:
              "linear-gradient(135deg, #8B3A44 0%, #722F37 50%, #5A2430 100%)",
            boxShadow: "0 4px 18px rgba(114, 47, 55, 0.28)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #9B4A54 0%, #8B3A44 50%, #722F37 100%)",
              boxShadow: "0 6px 24px rgba(114, 47, 55, 0.40)",
            },
          },
          "&.MuiButton-outlinedPrimary": {
            borderColor: "#722F37",
            borderWidth: "1.5px",
            color: "#722F37",
            "&:hover": {
              borderColor: "#4A1520",
              backgroundColor: "rgba(114, 47, 55, 0.06)",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorError: {
          color: "#C62828",
          "&:hover": { backgroundColor: "rgba(198, 40, 40, 0.08)" },
        },
        colorPrimary: {
          color: "#722F37",
          "&:hover": { backgroundColor: "rgba(114, 47, 55, 0.08)" },
        },
        colorInfo: {
          color: "#2E7D9E",
          "&:hover": { backgroundColor: "rgba(46, 125, 158, 0.08)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            "0 2px 16px rgba(114, 47, 55, 0.07), 0 1px 4px rgba(28, 10, 8, 0.05)",
          border: "1px solid #EAD9CC",
          backgroundColor: "#ffffff",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 32px rgba(114, 47, 55, 0.12)",
            borderColor: "#C4907C",
          },
          transition:
            "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#ffffff",
          fontFamily: '"Poppins", sans-serif',
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4CEBC" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#C4907C",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#722F37",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: "0.9rem",
          color: "#7A4F3A",
          "&.Mui-focused": { color: "#722F37" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 16px 56px rgba(114, 47, 55, 0.18)",
          overflow: "hidden",
          border: "1px solid #EAD9CC",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          fontSize: "1.2rem",
          color: "#ffffff",
          background:
            "linear-gradient(135deg, #8B3A44 0%, #722F37 60%, #4A1520 100%)",
          padding: "20px 28px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: "32px 28px 24px", backgroundColor: "#ffffff" },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 28px 24px",
          gap: 10,
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "20px 0 0 20px",
          boxShadow: "-8px 0 56px rgba(114, 47, 55, 0.16)",
          backgroundColor: "#FBF5EE",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500,
          fontSize: "0.78rem",
        },
        colorSuccess: {
          backgroundColor: "#EAF3E7",
          color: "#3D6B32",
          fontWeight: 600,
          border: "1px solid #C4DEC0",
        },
        colorError: {
          backgroundColor: "#FCE8E8",
          color: "#C62828",
          fontWeight: 600,
          border: "1px solid #F0C0C0",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontFamily: '"Poppins", sans-serif' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: "0.82rem",
          fontWeight: 500,
          borderColor: "rgba(255,255,255,0.25)",
          "&.Mui-selected": {
            backgroundColor: "rgba(196, 144, 124, 0.22)",
            borderColor: "rgba(196, 144, 124, 0.5)",
            fontWeight: 700,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#E4CEBC" },
      },
    },
  },
});

export default theme;
