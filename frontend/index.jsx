import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (container) {
  try {
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render SevaSetu app:", error);

    container.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>The application failed to start. Please refresh the page.</p>
      </div>`;
  }
}
