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
              "--burgundy-bright": theme.tokens.brand.bright,
              "--burgundy-deep": theme.tokens.brand.deep,
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
              "--error-light": theme.palette.error.light,
              "--error-border": theme.tokens.status.errorBorder,
              "--error-surface": theme.tokens.status.errorSurface,
              "--info": theme.palette.info.main,
              "--success": theme.palette.success.main,
              "--success-light": theme.palette.success.light,
              "--success-text": theme.tokens.status.successText,
              "--success-border": theme.tokens.status.successBorder,
              "--success-surface": theme.tokens.status.successSurface,
              "--warning": theme.tokens.status.warning,
              "--gold": theme.tokens.status.gold,
              "--gold-muted": theme.tokens.status.goldMuted,
              "--row-alt": theme.tokens.surfaces.rowAlt,
              "--table-line": theme.tokens.surfaces.tableLine,
              // Channel triplets, so a stylesheet can tint a token with any alpha
              // (rgba(var(--primary-rgb), 0.08)) instead of repeating the hex by hand
              "--primary-rgb": "114, 47, 55",
              "--primary-dark-rgb": "74, 21, 32",
              "--accent-rgb": "196, 144, 124",
              "--ink-rgb": "28, 10, 8",
              "--white-rgb": "255, 255, 255",
              "--shadow-sm": theme.tokens.shadows.sm,
              "--shadow-md": theme.tokens.shadows.md,
              "--shadow-lg": theme.tokens.shadows.lg,
              "--shadow-card": theme.tokens.shadows.card,
              "--shadow-card-raised": theme.tokens.shadows.cardRaised,
              "--shadow-dialog": theme.tokens.shadows.dialog,
              "--shadow-drawer": theme.tokens.shadows.drawer,
              "--shadow-action": theme.tokens.shadows.action,
              "--shadow-action-hover": theme.tokens.shadows.actionHover,
              "--text-xxs": theme.tokens.text.xxs,
              "--text-xs": theme.tokens.text.xs,
              "--text-sm": theme.tokens.text.sm,
              "--text-body": theme.tokens.text.body,
              "--text-control": theme.tokens.text.control,
              "--text-md": theme.tokens.text.md,
              "--text-lg": theme.tokens.text.lg,
              "--text-xl": theme.tokens.text.xl,
              "--text-xxl": theme.tokens.text.xxl,
              "--text-title": theme.tokens.text.title,
              "--text-amount": theme.tokens.text.amount,
              "--text-headline": theme.tokens.text.headline,
              "--text-page": theme.tokens.text.page,
              "--text-section": theme.tokens.text.section,
              "--text-display": theme.tokens.text.display,
              "--text-hero": theme.tokens.text.hero,
              "--text-masthead": theme.tokens.text.masthead,
              "--icon-xs": theme.tokens.icons.xs,
              "--icon-sm": theme.tokens.icons.sm,
              "--icon-md": theme.tokens.icons.md,
              "--icon-lg": theme.tokens.icons.lg,
              "--space-xs": theme.tokens.space.xs,
              "--space-sm": theme.tokens.space.sm,
              "--space-md": theme.tokens.space.md,
              "--space-lg": theme.tokens.space.lg,
              "--space-xl": theme.tokens.space.xl,
              "--radius-hair": theme.tokens.radii.hair,
              "--radius-xs": theme.tokens.radii.xs,
              "--radius-sm": theme.tokens.radii.sm,
              "--radius-md": theme.tokens.radii.md,
              "--radius-lg": theme.tokens.radii.lg,
              "--radius-xl": theme.tokens.radii.xl,
              "--radius-xxl": theme.tokens.radii.xxl,
              "--radius-pill": theme.tokens.radii.pill,
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
