import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import { http } from "./core/api/http.ts";
import { auth } from "./core/auth/auth.instance.ts";
import { installAuthInterceptor } from "./core/auth/auth.interceptors.ts";

installAuthInterceptor(http, auth);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      	<App />
    </BrowserRouter>
  </StrictMode>,
);
