import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";

const muiCache = createCache({ key: "mui", prepend: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
);
