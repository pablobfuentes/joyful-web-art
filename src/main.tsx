import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyStyleRegistry, getMergedStyleRegistry, STYLE_STORAGE_KEY } from "@/lib/apply-style-registry";

function applyMergedStyles(): void {
  applyStyleRegistry(getMergedStyleRegistry());
}

applyStyleRegistry(getMergedStyleRegistry());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STYLE_STORAGE_KEY && e.newValue != null) {
      applyMergedStyles();
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
