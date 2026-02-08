import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PlayProvider } from "./contexts/Play";
import { PhotoProvider } from "./contexts/PhotoContext";
import "./index.css";
import "../Cinematic Landing Page Design/src/styles/globals.css";

if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  const originalError = console.error;
  const shouldSuppress = (msg) =>
    msg.includes("unsupported GPOS table") ||
    msg.includes("unsupported GSUB table");

  console.warn = (...args) => {
    const msg = String(args[0] ?? "");
    if (shouldSuppress(msg)) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    const msg = String(args[0] ?? "");
    if (shouldSuppress(msg)) return;
    originalError(...args);
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayProvider>
        <PhotoProvider>
          <App />
        </PhotoProvider>
      </PlayProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
