import { createTheme } from "@mui/material/styles";

// Everything the stylesheets need that the MUI palette does not already carry.
// main.tsx turns every entry below into a CSS variable, so a value lives here once
// and the CSS files only ever reference it. See DESIGN.md for what each one means.
interface ThemeTokens {
  accentPale: string;
  creamDark: string;
  border: string;
  // Status colors. The MUI palette carries the main ones; these are the tints,
  // borders and the amber that only the stylesheets use.
  status: {
    warning: string;
    successText: string;
    successBorder: string;
    successSurface: string;
    errorBorder: string;
    errorSurface: string;
    gold: string;
    goldMuted: string;
  };
  // Neutral surfaces that sit between cream and white
  surfaces: {
    rowAlt: string;
    tableLine: string;
  };
  // The type scale. DESIGN.md names five roles; these are the steps they use.
  text: {
    xxs: string;
    xs: string;
    sm: string;
    body: string;
    control: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    title: string;
    amount: string;
    headline: string;
    page: string;
    section: string;
    display: string;
    hero: string;
    masthead: string;
  };
  // Icon glyph sizes. MUI sets an icon's size with font-size, which is why these
  // are not part of the type scale and must not be read as text steps.
  icons: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  // The 8px spacing rhythm
  space: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Actions are pills; surfaces step up this scale
  // The two intermediate burgundies every gradient runs through
  brand: {
    bright: string;
    deep: string;
  };
  radii: {
    hair: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    pill: string;
  };
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
    card: string;
    cardRaised: string;
    dialog: string;
    drawer: string;
    action: string;
    actionHover: string;
  };
}

declare module "@mui/material/styles" {
  interface Theme {
    tokens: ThemeTokens;
  }
  interface ThemeOptions {
    tokens?: ThemeTokens;
  }
}

const theme = createTheme({
  tokens: {
    accentPale: "#F8EDE8",
    creamDark: "#F0E6D8",
    border: "#E4CEBC",
    status: {
      warning: "#C46A1B",
      successText: "#3D6B32",
      successBorder: "#C4DEC0",
      successSurface: "#F6FBF5",
      errorBorder: "#F0C0C0",
      errorSurface: "#FDF5F5",
      gold: "#C9A84C",
      goldMuted: "#C4B08A",
    },
    surfaces: {
      rowAlt: "#FDF8F5",
      tableLine: "#F0E6DD",
    },
    text: {
      xxs: "0.72rem",      // badges, counters, the smallest meta
      xs: "0.78rem",       // uppercase labels and table headers
      sm: "0.82rem",       // helper text, card descriptions
      body: "0.88rem",     // the workhorse: prose, table cells, controls
      control: "0.9rem",   // MUI inputs and buttons
      md: "0.95rem",       // emphasised body
      lg: "1rem",          // lead-in text, cart line totals
      xl: "1.05rem",       // product card names
      xxl: "1.2rem",       // price tags, drawer and dialog titles
      title: "1.35rem",    // form dialog titles, empty-state headings
      amount: "1.5rem",    // the cart total
      headline: "1.7rem",  // page headings in the shop
      page: "1.85rem",     // management page titles
      section: "2.1rem",   // section headings at desktop
      display: "2.4rem",   // the home hero at mobile
      hero: "3.4rem",      // the home hero above 900px
      masthead: "4.4rem",  // the lookbook masthead, the largest step there is
    },
    icons: {
      xs: "16px",   // inside buttons, beside a label
      sm: "18px",   // inline with body text
      md: "20px",   // standalone controls
      lg: "32px",   // empty-state and feature glyphs
    },
    space: {
      xs: "8px",
      sm: "12px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
    brand: {
      bright: "#8B3A44",
      deep: "#5A2430",
    },
    radii: {
      hair: "3px",
      xs: "8px",
      sm: "10px",
      md: "12px",
      lg: "16px",
      xl: "18px",
      xxl: "20px",
      pill: "50px",
    },
    gradients: {
      navbar: "linear-gradient(135deg, var(--burgundy-deep) 0%, var(--primary) 50%, var(--primary-dark) 100%)",
      cartHeader:
        "linear-gradient(135deg, var(--burgundy-deep) 0%, var(--primary) 60%, var(--primary-dark) 100%)",
      dialogTitle:
        "linear-gradient(135deg, var(--burgundy-bright) 0%, var(--primary) 60%, var(--primary-dark) 100%)",
      buttonPrimary:
        "linear-gradient(135deg, var(--burgundy-bright) 0%, var(--primary) 50%, var(--burgundy-deep) 100%)",
      buttonPrimaryHover:
        "linear-gradient(135deg, var(--primary-light) 0%, var(--burgundy-bright) 50%, var(--primary) 100%)",
    },
    // Every shadow is burgundy at low alpha — never neutral black
    shadows: {
      sm: "0 2px 10px rgba(114, 47, 55, 0.07)",
      md: "0 6px 24px rgba(114, 47, 55, 0.11)",
      lg: "0 12px 42px rgba(114, 47, 55, 0.15)",
      card: "0 2px 16px rgba(114, 47, 55, 0.07), 0 1px 4px rgba(28, 10, 8, 0.05)",
      cardRaised: "0 10px 32px rgba(114, 47, 55, 0.12)",
      dialog: "0 16px 56px rgba(114, 47, 55, 0.18)",
      drawer: "-8px 0 56px rgba(114, 47, 55, 0.16)",
      action: "0 4px 18px rgba(114, 47, 55, 0.28)",
      actionHover: "0 6px 24px rgba(114, 47, 55, 0.40)",
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
    fontFamily: '"Archivo", "Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
    h2: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
    h3: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
    h4: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
    h5: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
    h6: { fontFamily: '"Marcellus", Georgia, serif', fontWeight: 400 },
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
          borderRadius: "var(--radius-pill)",
          padding: "9px 28px",
          fontSize: "var(--text-control)",
          "&.MuiButton-containedPrimary": {
            background: "var(--gradient-btn-primary)",
            boxShadow: "var(--shadow-action)",
            "&:hover": {
              background: "var(--gradient-btn-primary-hover)",
              boxShadow: "var(--shadow-action-hover)",
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
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border)",
          backgroundColor: "#ffffff",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "var(--shadow-card-raised)",
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
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--white)",
          fontFamily: '"Archivo", sans-serif',
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
          fontFamily: '"Archivo", sans-serif',
          fontSize: "var(--text-control)",
          color: "var(--text-secondary)",
          "&.Mui-focused": { color: "var(--primary)" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "var(--radius-xxl)",
          boxShadow: "var(--shadow-dialog)",
          overflow: "hidden",
          border: "1px solid var(--border)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Marcellus", Georgia, serif',
          fontWeight: 400,
          fontSize: "var(--text-xxl)",
          color: "var(--white)",
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
          borderRadius: "var(--radius-xxl) 0 0 var(--radius-xxl)",
          boxShadow: "var(--shadow-drawer)",
          backgroundColor: "var(--cream)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Archivo", sans-serif',
          fontWeight: 500,
          fontSize: "var(--text-xs)",
        },
        colorSuccess: {
          backgroundColor: "var(--success-light)",
          color: "var(--success-text)",
          fontWeight: 600,
          border: "1px solid var(--success-border)",
        },
        colorError: {
          backgroundColor: "var(--error-light)",
          color: "var(--error)",
          fontWeight: 600,
          border: "1px solid var(--error-border)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontFamily: '"Archivo", sans-serif' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Archivo", sans-serif',
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          borderColor: "rgba(255, 255, 255, 0.25)",
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
          border: "2px solid var(--white)",
          boxShadow: "0 2px 6px rgba(var(--ink-rgb), 0.18)",
          "&:hover": { boxShadow: "0 0 0 8px rgba(var(--primary-rgb), 0.16)" },
        },
        track: { backgroundColor: "var(--primary)" },
        rail: { backgroundColor: "var(--accent-light)" },
        valueLabel: {
          fontFamily: '"Archivo", sans-serif',
          fontSize: "var(--text-xxs)",
          backgroundColor: "var(--primary)",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: '"Archivo", sans-serif',
          fontWeight: 700,
          fontSize: "var(--text-xxs)",
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
          fontFamily: '"Archivo", sans-serif',
          fontSize: "var(--text-body)",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: '"Archivo", sans-serif',
          fontSize: "var(--text-sm)",
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
