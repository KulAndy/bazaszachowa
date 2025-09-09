import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.scss";
import App from "./App";
import { I18nProvider } from "./context/I18nProvider";
import { ThemeProvider } from "./context/ThemeProvider";

const root = ReactDOM.createRoot(document.querySelector("#root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
