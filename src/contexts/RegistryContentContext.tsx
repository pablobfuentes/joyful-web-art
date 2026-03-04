/**
 * Provides registry content and content modifiers.
 * When initialContent/initialContentModifiers are provided, uses them as the full source.
 * Otherwise uses localStorage overrides merged with APP_REGISTRY.
 * Listens to storage events so the other tab updates when the editor saves.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { APP_REGISTRY, type AppRegistry } from "@/config/app-registry";

export const CONTENT_STORAGE_KEY = "app_registry_content_overrides";
export const CONTENT_MODIFIERS_STORAGE_KEY = "app_registry_content_modifiers";
/** Bump when app-registry content structure or default copy changes so stale localStorage is ignored. */
export const CONTENT_STORAGE_VERSION = 2;
export const CONTENT_VERSION_KEY = "app_registry_content_version";

export type ContentModifiers = Record<
  string,
  { fontFamily?: string; fontSize?: string; colorIndex?: number }
>;

type RegistryContentProviderProps = {
  children: ReactNode;
  /** When provided, used as full content; no localStorage merge. */
  initialContent?: AppRegistry | Record<string, unknown>;
  initialContentModifiers?: ContentModifiers;
};

/** Build inline style from a content modifier so pill color and page text match. */
export function styleFromModifier(
  mod: { colorIndex?: number; fontFamily?: string; fontSize?: string } | undefined,
  defaultColorVar?: string
): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (mod?.colorIndex != null) {
    style.color = `hsl(var(--palette-${mod.colorIndex}))`;
  } else if (defaultColorVar) {
    style.color = `hsl(var(${defaultColorVar}))`;
  }
  if (mod?.fontFamily) style.fontFamily = mod.fontFamily;
  if (mod?.fontSize) style.fontSize = mod.fontSize;
  return style;
}

type RegistryContentState = {
  content: Record<string, unknown> | null;
  contentModifiers: ContentModifiers;
  /** True when content was loaded from registry.json (file); do not overwrite with localStorage. */
  fromFile: boolean;
  /** Full content for editor (merged when from localStorage). */
  fullContentForEditor: Record<string, unknown>;
  /** Merged section content (saved overrides + APP_REGISTRY). Use for all text in components. */
  getSectionContent: <K extends keyof AppRegistry>(sectionKey: K) => AppRegistry[K];
  /** Style for a content path (modifier + optional default color var). Use so pill and page text match. */
  getStyleForPath: (pathKey: string, defaultColorVar?: string) => React.CSSProperties;
  /** Re-read from localStorage (e.g. after storage event). No-op when fromFile. */
  refresh: () => void;
};

const RegistryContentContext = createContext<RegistryContentState | null>(null);

function readContentOverrides(): Record<string, unknown> | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const version = localStorage.getItem(CONTENT_VERSION_KEY);
    if (version !== String(CONTENT_STORAGE_VERSION)) return null;
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, unknown>;
  } catch (_) {}
  return null;
}

function readContentModifiers(): ContentModifiers {
  try {
    const raw =
      typeof localStorage !== "undefined" ? localStorage.getItem(CONTENT_MODIFIERS_STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw) as ContentModifiers;
  } catch (_) {}
  return {};
}

export function RegistryContentProvider({
  children,
  initialContent,
  initialContentModifiers,
}: RegistryContentProviderProps) {
  const fromFile = initialContent != null;
  const [content, setContent] = useState<Record<string, unknown> | null>(() =>
    fromFile ? (initialContent as Record<string, unknown>) : readContentOverrides()
  );
  const [contentModifiers, setContentModifiers] = useState<ContentModifiers>(() =>
    fromFile ? (initialContentModifiers ?? {}) : readContentModifiers()
  );

  const refresh = useCallback(() => {
    if (fromFile) return;
    setContent(readContentOverrides());
    setContentModifiers(readContentModifiers());
  }, [fromFile]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONTENT_STORAGE_KEY) setContent(readContentOverrides());
      if (e.key === CONTENT_MODIFIERS_STORAGE_KEY) setContentModifiers(readContentModifiers());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /** Deep merge over onto base so sparse overrides (e.g. plans.0.name) apply. */
  const deepMergeSection = useCallback((base: unknown, over: unknown): unknown => {
    if (over == null || over === undefined) return base;
    if (Array.isArray(base) && typeof over === "object" && over !== null && !Array.isArray(over)) {
      const o = over as Record<string, unknown>;
      return (base as unknown[]).map((item, i) =>
        deepMergeSection(item, o[i] ?? o[String(i)])
      );
    }
    if (Array.isArray(base) && Array.isArray(over)) {
      const len = Math.max((base as unknown[]).length, over.length);
      return Array.from({ length: len }, (_, i) =>
        deepMergeSection((base as unknown[])[i], over[i])
      );
    }
    if (
      typeof base === "object" &&
      base !== null &&
      !Array.isArray(base) &&
      typeof over === "object" &&
      over !== null &&
      !Array.isArray(over)
    ) {
      const b = base as Record<string, unknown>;
      const o = over as Record<string, unknown>;
      const merged = { ...b };
      for (const [k, v] of Object.entries(o)) {
        if (v === undefined) continue;
        const baseVal = b[k];
        if (Array.isArray(baseVal) && !Array.isArray(v)) {
          merged[k] = (baseVal as unknown[]).map((item, i) =>
            deepMergeSection(item, (v as Record<string, unknown>)[i] ?? (v as Record<string, unknown>)[String(i)])
          );
          continue;
        }
        merged[k] = deepMergeSection(baseVal, v) as unknown;
      }
      return merged;
    }
    return over !== undefined ? over : base;
  }, []);

  const getSectionContent = useCallback(
    <K extends keyof AppRegistry>(sectionKey: K): AppRegistry[K] => {
      const base = APP_REGISTRY[sectionKey];
      const over = content?.[sectionKey];
      return deepMergeSection(base, over) as AppRegistry[K];
    },
    [content, deepMergeSection]
  );

  const fullContentForEditor = useMemo<Record<string, unknown>>(() => {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(APP_REGISTRY) as (keyof AppRegistry)[]) {
      out[k] = getSectionContent(k);
    }
    return out;
  }, [getSectionContent]);

  const getStyleForPath = useCallback(
    (pathKey: string, defaultColorVar?: string) =>
      styleFromModifier(contentModifiers[pathKey], defaultColorVar),
    [contentModifiers]
  );

  const value = useMemo<RegistryContentState>(
    () => ({
      content,
      contentModifiers,
      fromFile,
      fullContentForEditor,
      getSectionContent,
      getStyleForPath,
      refresh,
    }),
    [content, contentModifiers, fromFile, fullContentForEditor, getSectionContent, getStyleForPath, refresh]
  );

  return (
    <RegistryContentContext.Provider value={value}>
      {children}
    </RegistryContentContext.Provider>
  );
}

export function useRegistryContent() {
  const ctx = useContext(RegistryContentContext);
  if (!ctx)
    return {
      content: null,
      contentModifiers: {},
      fromFile: false,
      fullContentForEditor: JSON.parse(JSON.stringify(APP_REGISTRY)) as Record<string, unknown>,
      getSectionContent: <K extends keyof AppRegistry>(sectionKey: K) => APP_REGISTRY[sectionKey],
      getModifier: () => undefined,
      getStyleForPath: (_pathKey: string, _defaultColorVar?: string) => ({}),
      refresh: () => {},
    };
  return {
    content: ctx.content,
    contentModifiers: ctx.contentModifiers,
    fromFile: ctx.fromFile,
    fullContentForEditor: ctx.fullContentForEditor,
    getSectionContent: ctx.getSectionContent,
    getModifier: useCallback(
      (pathKey: string) => ctx.contentModifiers[pathKey],
      [ctx.contentModifiers]
    ),
    getStyleForPath: ctx.getStyleForPath,
    refresh: ctx.refresh,
  };
}
