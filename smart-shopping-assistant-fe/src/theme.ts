import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    tokens: {
      accentPale: string;
      creamDark: string;
      border: string;
      gradients: {
        navbar: string;
        cartHeader: string;
        dialogTitle: string;
        buttonPrimary: string;
        buttonPrimaryHover: string;
      };
      shadows: {
        sm: string;
        md: string;
        lg: string;
      };
    };
  }
  interface ThemeOptions {
    tokens?: {
      accentPale?: string;
      creamDark?: string;
      border?: string;
      gradients?: {
        navbar?: string;
        cartHeader?: string;
        dialogTitle?: string;
        buttonPrimary?: string;
        buttonPrimaryHover?: string;
      };
      shadows?: {
        sm?: string;
        md?: string;
        lg?: string;
      };
    };
  }
}

const theme = createTheme({
  tokens: {
    accentPale: "#F8EDE8",
    creamDark: "#F0E6D8",
    border: "#E4CEBC",
    gradients: {
      navbar: "linear-gradient(135deg, #5A2430 0%, #722F37 50%, #4A1520 100%)",
      cartHeader:
        "linear-gradient(135deg, #5A2430 0%, #722F37 60%, #4A1520 100%)",
      dialogTitle:
        "linear-gradient(135deg, #8B3A44 0%, #722F37 60%, #4A1520 100%)",
      buttonPrimary:
        "linear-gradient(135deg, #8B3A44 0%, #722F37 50%, #5A2430 100%)",
      buttonPrimaryHover:
        "linear-gradient(135deg, #9B4A54 0%, #8B3A44 50%, #722F37 100%)",
    },
    shadows: {
      sm: "0 2px 10px rgba(114, 47, 55, 0.07)",
      md: "0 6px 24px rgba(114, 47, 55, 0.11)",
      lg: "0 12px 42px rgba(114, 47, 55, 0.15)",
    },
  },
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
            background: "var(--gradient-btn-primary)",
            boxShadow: "0 4px 18px rgba(114, 47, 55, 0.28)",
            "&:hover": {
              background: "var(--gradient-btn-primary-hover)",
              boxShadow: "0 6px 24px rgba(114, 47, 55, 0.40)",
            },
          },
          "&.MuiButton-outlinedPrimary": {
            borderColor: "var(--primary)",
            borderWidth: "1.5px",
            color: "var(--primary)",
            "&:hover": {
              borderColor: "var(--primary-dark)",
              backgroundColor: "rgba(114, 47, 55, 0.06)",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorError: {
          color: "var(--error)",
          "&:hover": { backgroundColor: "rgba(198, 40, 40, 0.08)" },
        },
        colorPrimary: {
          color: "var(--primary)",
          "&:hover": { backgroundColor: "rgba(114, 47, 55, 0.08)" },
        },
        colorInfo: {
          color: "var(--info)",
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
          border: "1px solid var(--border)",
          backgroundColor: "#ffffff",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 32px rgba(114, 47, 55, 0.12)",
            borderColor: "var(--accent)",
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
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary)",
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
          color: "var(--text-secondary)",
          "&.Mui-focused": { color: "var(--primary)" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 16px 56px rgba(114, 47, 55, 0.18)",
          overflow: "hidden",
          border: "1px solid var(--border)",
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
          background: "var(--gradient-dialog-title)",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 8,
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
          backgroundColor: "var(--cream)",
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
          color: "var(--error)",
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
        root: { borderColor: "var(--border)" },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: "var(--primary)" },
        thumb: {
          backgroundColor: "var(--primary)",
          border: "2px solid #fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          "&:hover": { boxShadow: "0 0 0 8px rgba(156, 93, 72, 0.16)" },
        },
        track: { backgroundColor: "var(--primary)" },
        rail: { backgroundColor: "var(--accent-light)" },
        valueLabel: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: "0.75rem",
          backgroundColor: "var(--primary)",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 700,
          fontSize: "0.68rem",
          minWidth: 18,
          height: 18,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(114, 47, 55, 0.07)",
          "&::after": {
            background:
              "linear-gradient(90deg, transparent, rgba(196, 144, 124, 0.15), transparent)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "var(--accent-pale)",
        },
        bar: {
          backgroundColor: "var(--primary)",
          borderRadius: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: "0.88rem",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: "0.85rem",
          color: "var(--text-primary)",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--accent)",
          padding: "4px 8px",
          "&.Mui-checked": { color: "var(--primary)" },
        },
      },
    },
  },
});

export default theme;
