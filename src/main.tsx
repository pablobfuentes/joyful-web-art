import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyStyleRegistry, getMergedStyleRegistry, STYLE_STORAGE_KEY } from "@/lib/apply-style-registry";
import { getDefaultRegistry, type RegistrySnapshot } from "@/config/get-default-registry";

function applyMergedStyles(): void {
  applyStyleRegistry(getMergedStyleRegistry());
}

async function bootstrap(): Promise<RegistrySnapshot> {
  try {
    const res = await fetch("/registry.json", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as RegistrySnapshot;
      if (data?.content != null && data?.style != null) return data;
    }
  } catch (_) {
    // ignore
  }
  return getDefaultRegistry();
}

bootstrap().then((registry) => {
  applyStyleRegistry(registry.style);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === STYLE_STORAGE_KEY && e.newValue != null) {
        applyMergedStyles();
      }
    });
  }

  createRoot(document.getElementById("root")!).render(<App initialRegistry={registry} />);
});
