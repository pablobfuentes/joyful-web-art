import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { STYLE_REGISTRY } from "@/config/style-registry";
import { applyStyleRegistry } from "@/lib/apply-style-registry";

applyStyleRegistry(STYLE_REGISTRY);

createRoot(document.getElementById("root")!).render(<App />);
