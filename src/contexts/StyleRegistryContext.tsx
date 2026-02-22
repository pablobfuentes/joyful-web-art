/**
 * Provides the merged style registry (default + localStorage overrides) so the main app
 * can read style values in React (e.g. image paths, divider config). Updates on storage
 * event and when refreshStyleRegistry() is called (e.g. Index mount for same-tab).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMergedStyleRegistry, STYLE_STORAGE_KEY } from "@/lib/apply-style-registry";
import type { StyleRegistry } from "@/config/style-registry";

type StyleRegistryState = {
  registry: StyleRegistry;
  /** Re-read from localStorage so same-tab editor saves apply when user navigates to main page. */
  refreshStyleRegistry: () => void;
};

const StyleRegistryContext = createContext<StyleRegistryState | null>(null);

export function StyleRegistryProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<StyleRegistry>(() => getMergedStyleRegistry());

  const refreshStyleRegistry = useCallback(() => {
    setRegistry(getMergedStyleRegistry());
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STYLE_STORAGE_KEY) refreshStyleRegistry();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshStyleRegistry]);

  const value = useMemo(
    () => ({ registry, refreshStyleRegistry }),
    [registry, refreshStyleRegistry]
  );

  return (
    <StyleRegistryContext.Provider value={value}>
      {children}
    </StyleRegistryContext.Provider>
  );
}

export function useStyleRegistry(): StyleRegistryState {
  const ctx = useContext(StyleRegistryContext);
  if (!ctx) {
    return {
      registry: getMergedStyleRegistry(),
      refreshStyleRegistry: () => {},
    };
  }
  return ctx;
}
