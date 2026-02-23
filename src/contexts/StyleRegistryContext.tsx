/**
 * Provides the style registry. When initialStyle is provided (e.g. from registry.json), uses it.
 * Otherwise uses merged default + localStorage overrides. Updates on storage event and refreshStyleRegistry().
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

type StyleRegistryProviderProps = {
  children: ReactNode;
  /** When provided (e.g. from registry.json), used as initial registry instead of localStorage merge. */
  initialStyle?: StyleRegistry;
};

export function StyleRegistryProvider({ children, initialStyle }: StyleRegistryProviderProps) {
  const fromFile = initialStyle != null;
  const [registry, setRegistry] = useState<StyleRegistry>(() =>
    initialStyle ?? getMergedStyleRegistry()
  );

  const refreshStyleRegistry = useCallback(() => {
    if (fromFile) return;
    setRegistry(getMergedStyleRegistry());
  }, [fromFile]);

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
