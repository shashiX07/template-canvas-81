import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDummyStructuredTemplate } from "./lib/seedDummyTemplate";

// Seed dummy template for testing structured JSON format
seedDummyStructuredTemplate();

createRoot(document.getElementById("root")!).render(<App />);
