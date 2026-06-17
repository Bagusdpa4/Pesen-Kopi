import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Css
import "./components/css/index.css";
// Routes
import { App } from "./routes/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
