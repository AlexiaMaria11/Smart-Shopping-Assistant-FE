import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const muiCache = createCache({ key: "mui", prepend: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={muiCache}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CacheProvider>
  </StrictMode>,
);
