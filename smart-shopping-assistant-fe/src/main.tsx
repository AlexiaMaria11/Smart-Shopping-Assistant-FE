import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";

const muiCache = createCache({ key: "mui", prepend: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            ":root": {
              "--primary": theme.palette.primary.main,
              "--primary-dark": theme.palette.primary.dark,
              "--primary-light": theme.palette.primary.light,
              "--accent": theme.palette.secondary.main,
              "--accent-dark": theme.palette.secondary.dark,
              "--accent-light": theme.palette.secondary.light,
              "--accent-pale": theme.tokens.accentPale,
              "--cream": theme.palette.background.default,
              "--cream-dark": theme.tokens.creamDark,
              "--text-primary": theme.palette.text.primary,
              "--text-secondary": theme.palette.text.secondary,
              "--border": theme.tokens.border,
              "--white": "#ffffff",
              "--error": theme.palette.error.main,
              "--info": theme.palette.info.main,
              "--success": theme.palette.success.main,
              "--shadow-sm": theme.tokens.shadows.sm,
              "--shadow-md": theme.tokens.shadows.md,
              "--shadow-lg": theme.tokens.shadows.lg,
              "--gradient-navbar": theme.tokens.gradients.navbar,
              "--gradient-cart-header": theme.tokens.gradients.cartHeader,
              "--gradient-dialog-title": theme.tokens.gradients.dialogTitle,
              "--gradient-btn-primary": theme.tokens.gradients.buttonPrimary,
              "--gradient-btn-primary-hover":
                theme.tokens.gradients.buttonPrimaryHover,
            },
          }}
        />
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
);
