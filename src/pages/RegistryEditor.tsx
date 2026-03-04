import { useState, useCallback, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import Navbar from "@/components/Navbar";
import { STYLE_REGISTRY, type StyleRegistry, type PaletteCell } from "@/config/style-registry";
import { applyStyleRegistry } from "@/lib/apply-style-registry";
import { APP_REGISTRY } from "@/config/app-registry";
import { useRegistryContent, CONTENT_STORAGE_KEY, CONTENT_MODIFIERS_STORAGE_KEY } from "@/contexts/RegistryContentContext";
import { useStyleRegistry } from "@/contexts/StyleRegistryContext";
import { STYLE_STORAGE_KEY } from "@/lib/apply-style-registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

// Section display names
const SECTION_DISPLAY_NAMES: Record<string, string> = {
  general: "General",
  nav: "Navigation",
  hero: "Hero",
  why: "Why",
  howItWorks: "How It Works",
  compatibilityTest: "Compatibility Test",
  whatYouReceive: "What You Receive",
  pastEditions: "Past Editions",
  experience: "Experience",
  testimonials: "Testimonials",
  pricing: "Pricing",
  faq: "FAQ",
  finalCta: "Final CTA",
  footer: "Footer",
  login: "Login",
  register: "Register",
  forgotPassword: "Forgot Password",
  resetPassword: "Reset Password",
  dashboard: "Dashboard",
  checkout: "Checkout",
  account: "Account",
  page: "Page",
};

const SECTION_KEYS = Object.keys(SECTION_DISPLAY_NAMES);

const DIVIDER_STYLE_OPTIONS = [
  { value: "wavy", label: "Wavy" },
  { value: "wavy2", label: "Wavy 2" },
  { value: "sawtooth", label: "Sawtooth" },
  { value: "blob", label: "Blob" },
];

export type ContentModifiers = Record<
  string,
  { fontFamily?: string; fontSize?: string; colorIndex?: number }
>;

const FONT_SIZE_PRESETS = [
  "0.75rem",
  "0.875rem",
  "1rem",
  "1.125rem",
  "1.25rem",
  "1.5rem",
  "1.875rem",
  "2rem",
  "2.25rem",
  "3rem",
];

/** Deep-clone for mutable content state from APP_REGISTRY. */
function getDefaultContent(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(APP_REGISTRY)) as Record<string, unknown>;
}

/** Deep merge over onto base so sparse overrides (e.g. plans.0.name) apply; same logic as RegistryContentContext. */
function deepMergeSection(base: unknown, over: unknown): unknown {
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
}

function getMergedSectionContent(
  sectionKey: string,
  contentOverrides: Record<string, unknown>
): Record<string, unknown> {
  const base = (APP_REGISTRY as Record<string, unknown>)[sectionKey];
  const over = contentOverrides[sectionKey];
  const merged = deepMergeSection(base, over);
  return (merged && typeof merged === "object" && !Array.isArray(merged) ? merged : {}) as Record<string, unknown>;
}

/** Walk content tree and collect all string leaves as { path, label, value }. */
function getContentEntries(
  node: unknown,
  path: string[] = [],
  labelParts: string[] = []
): Array<{ path: string[]; label: string; value: string }> {
  if (node === null || node === undefined) return [];
  if (typeof node === "string") {
    const label = labelParts.length > 0 ? labelParts.join(" › ") : path[path.length - 1] ?? "Text";
    return [{ path, label, value: node }];
  }
  if (typeof node === "number") return [];
  if (Array.isArray(node)) {
    const entries: Array<{ path: string[]; label: string; value: string }> = [];
    node.forEach((item, i) => {
      entries.push(
        ...getContentEntries(item, [...path, String(i)], [...labelParts, `[${i}]`])
      );
    });
    return entries;
  }
  if (typeof node === "object") {
    const entries: Array<{ path: string[]; label: string; value: string }> = [];
    for (const [key, val] of Object.entries(node)) {
      const humanKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
      entries.push(...getContentEntries(val, [...path, key], [...labelParts, humanKey]));
    }
    return entries;
  }
  return [];
}

/** Deep set by path; returns new root (immutable update). Handles arrays by numeric path segments. */
function deepSetByPath(root: unknown, path: string[], value: string): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    if (typeof root === "object" && root !== null && !Array.isArray(root)) {
      return { ...(root as Record<string, unknown>), [head]: value };
    }
    return { [head]: value };
  }
  const current = root as Record<string, unknown>;
  const child = current[head];
  const index = parseInt(head, 10);
  const isArrayIndex = !Number.isNaN(index) && head === String(index);
  let nextChild: unknown;
  if (isArrayIndex && Array.isArray(child)) {
    const arr = [...child];
    if (rest.length === 1) {
      arr[index] = value;
    } else {
      arr[index] = deepSetByPath(arr[index], rest, value) as string;
    }
    nextChild = arr;
  } else {
    nextChild = deepSetByPath(child ?? {}, rest, value);
  }
  if (typeof root === "object" && root !== null && !Array.isArray(root)) {
    return { ...(root as Record<string, unknown>), [head]: nextChild };
  }
  return { [head]: nextChild };
}

export default function RegistryEditor() {
  const { fullContentForEditor, contentModifiers: ctxContentModifiers, refresh: refreshContent } = useRegistryContent();
  const { registry: ctxRegistry, refreshStyleRegistry } = useStyleRegistry();
  const syncedFromContext = useRef(false);

  const [registry, setRegistry] = useState<StyleRegistry>(() => ({ ...STYLE_REGISTRY }));
  const [content, setContent] = useState<Record<string, unknown>>(() => getDefaultContent());
  const [contentModifiers, setContentModifiers] = useState<ContentModifiers>(() => ({}));

  useEffect(() => {
    if (syncedFromContext.current) return;
    let did = false;
    if (ctxRegistry && Object.keys(ctxRegistry).length > 0) {
      setRegistry(JSON.parse(JSON.stringify(ctxRegistry)));
      did = true;
    }
    if (fullContentForEditor && Object.keys(fullContentForEditor).length > 0) {
      setContent(JSON.parse(JSON.stringify(fullContentForEditor)));
      setContentModifiers(JSON.parse(JSON.stringify(ctxContentModifiers ?? {})));
      did = true;
    }
    if (did) syncedFromContext.current = true;
  }, [ctxRegistry, fullContentForEditor, ctxContentModifiers]);
  const [selectedTab, setSelectedTab] = useState("general");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  /** When set, modal is in "pick color for content modifier" mode; right column shows matrix. */
  const [contentColorPathKey, setContentColorPathKey] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState("#000000");
  const [tempName, setTempName] = useState("");
  const [tempComment, setTempComment] = useState("");
  const [availableFonts, setAvailableFonts] = useState<string[]>([]);
  const [scanningFonts, setScanningFonts] = useState(false);
  const [fontToAdd, setFontToAdd] = useState<string>("");

  // Helper: Get contrast color (white or black) for text over a background
  const getContrastColor = useCallback((hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }, []);

  // Helper: Scan available fonts from fonts folder
  const scanAvailableFonts = useCallback(async () => {
    setScanningFonts(true);
    try {
      console.log("[Scan Fonts] Fetching /fonts/custom-fonts.css ...");
      const response = await fetch("/fonts/custom-fonts.css");
      console.log("[Scan Fonts] Response status:", response.status);
      if (!response.ok) {
        console.warn("[Scan Fonts] Failed to load CSS, status:", response.status);
        setAvailableFonts([]);
        return;
      }
      const css = await response.text();
      console.log("[Scan Fonts] CSS length:", css.length);
      const fontMatches = css.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]([^'"]+)['"]/gi);
      const fonts = Array.from(fontMatches, (m) => m[1]).filter((f, i, arr) => arr.indexOf(f) === i);
      console.log("[Scan Fonts] Fonts found in CSS:", fonts);
      setAvailableFonts(fonts);
    } catch (error) {
      console.error("[Scan Fonts] Failed to scan fonts:", error);
      setAvailableFonts([]);
    } finally {
      setScanningFonts(false);
    }
  }, []);

  useEffect(() => {
    scanAvailableFonts();
  }, []);

  // Two-way sync (plan 3.4): apply current registry to DOM so the rest of the app sees updates immediately
  useEffect(() => {
    applyStyleRegistry(registry);
  }, [registry]);

  // Helper: Get palette options for selects
  const getPaletteOptions = useCallback(() => {
    return registry.general.palette.cells.map((cell, index) => ({
      value: index.toString(),
      label: `${index}: ${cell.name || "Unnamed"}`,
      preview: cell.hex,
    }));
  }, [registry.general.palette.cells]);

  // Helper: Get font options
  const getFontOptions = useCallback(() => {
    const registryFonts = registry.general.fonts.map((f) => f.name);
    const allFonts = [...new Set([...registryFonts, ...availableFonts])];
    return allFonts.map((name) => ({ value: name, label: name }));
  }, [registry.general.fonts, availableFonts]);

  // Helper: Get gradient options
  const getGradientOptions = useCallback(() => {
    return Object.keys(registry.general.gradient).map((key) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [registry.general.gradient]);

  // Helper: Get shadow options
  const getShadowOptions = useCallback(() => {
    return Object.keys(registry.general.shadow).map((key) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [registry.general.shadow]);

  // Update palette cell
  const updatePaletteCell = useCallback((index: number, updates: Partial<PaletteCell>) => {
    setRegistry((prev) => {
      const newCells = [...prev.general.palette.cells];
      newCells[index] = { ...newCells[index], ...updates };
      return {
        ...prev,
        general: {
          ...prev.general,
          palette: {
            ...prev.general.palette,
            cells: newCells,
          },
        },
      };
    });
  }, []);

  // Handle color cell click
  const handleCellClick = useCallback((index: number) => {
    setContentColorPathKey(null);
    const cell = registry.general.palette.cells[index];
    setSelectedColorIndex(index);
    setTempColor(cell.hex);
    setTempName(cell.name || "");
    setTempComment(cell.comment || "");
    setColorPickerOpen(true);
  }, [registry.general.palette.cells]);

  /** Open color modal for a content row's color modifier; right column will show matrix to pick from. */
  const openContentColorModal = useCallback(
    (pathKey: string) => {
      const colorIndex = contentModifiers[pathKey]?.colorIndex ?? 0;
      const cell = registry.general.palette.cells[colorIndex];
      setContentColorPathKey(pathKey);
      setSelectedColorIndex(colorIndex);
      setTempColor(cell?.hex ?? "#000000");
      setTempName(cell?.name ?? "");
      setTempComment(cell?.comment ?? "");
      setColorPickerOpen(true);
    },
    [contentModifiers, registry.general.palette.cells]
  );

  const handleColorModalOpenChange = useCallback((open: boolean) => {
    if (!open) setContentColorPathKey(null);
    setColorPickerOpen(open);
  }, []);

  // Handle color change in picker
  const handleColorChange = useCallback((color: string) => {
    setTempColor(color);
    if (selectedColorIndex !== null) {
      updatePaletteCell(selectedColorIndex, { hex: color });
    }
  }, [selectedColorIndex, updatePaletteCell]);

  // Handle name change
  const handleNameChange = useCallback((name: string) => {
    setTempName(name);
    if (selectedColorIndex !== null) {
      updatePaletteCell(selectedColorIndex, { name });
    }
  }, [selectedColorIndex, updatePaletteCell]);

  // Handle comment change
  const handleCommentChange = useCallback((comment: string) => {
    setTempComment(comment);
    if (selectedColorIndex !== null) {
      updatePaletteCell(selectedColorIndex, { comment });
    }
  }, [selectedColorIndex, updatePaletteCell]);

  // Handle refresh fonts: sync undeclared font files into custom-fonts.css, then re-scan so dropdown has all fonts
  const handleRefreshFonts = useCallback(async () => {
    console.log("[Refresh Fonts] Clicked – syncing then scanning");
    setScanningFonts(true);
    try {
      console.log("[Refresh Fonts] Fetching /api/sync-fonts ...");
      const syncRes = await fetch("/api/sync-fonts");
      console.log("[Refresh Fonts] Sync response status:", syncRes.status, syncRes.statusText);
      if (syncRes.ok) {
        const contentType = syncRes.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          const text = await syncRes.text();
          console.warn("[Refresh Fonts] Sync returned non-JSON (e.g. SPA fallback). Content-Type:", contentType, "body preview:", text.slice(0, 80));
        } else {
          const _data = (await syncRes.json()) as { ok?: boolean; added?: string[]; error?: string };
          console.log("[Refresh Fonts] Sync response body:", _data);
          if (_data.added?.length) {
            toast.success(`Added ${_data.added.length} font(s) to custom-fonts.css`);
          }
        }
      } else {
        const text = await syncRes.text();
        console.warn("[Refresh Fonts] Sync failed:", syncRes.status, text);
      }
    } catch (e) {
      console.warn("[Refresh Fonts] Sync request failed (e.g. no dev server):", e);
    } finally {
      console.log("[Refresh Fonts] Scanning custom-fonts.css for font list ...");
      await scanAvailableFonts();
      setScanningFonts(false);
      console.log("[Refresh Fonts] Done");
    }
  }, [scanAvailableFonts]);

  // Update section helper (for nested updates)
  const updateSection = useCallback((path: string[], value: unknown) => {
    setRegistry((prev) => {
      const newRegistry = { ...prev };
      let current: Record<string, unknown> = newRegistry as Record<string, unknown>;
      
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
      }
      
      current[path[path.length - 1]] = value;
      return newRegistry as StyleRegistry;
    });
  }, []);

  // Update content (APP_REGISTRY text) by path
  const updateContent = useCallback((path: string[], value: string) => {
    setContent((prev) => deepSetByPath(prev, path, value) as Record<string, unknown>);
  }, []);

  // Update a single content modifier (font/size/color) for a content path
  const updateContentModifier = useCallback(
    (pathKey: string, key: "fontFamily" | "fontSize" | "colorIndex", value: string | number) => {
      setContentModifiers((prev) => ({
        ...prev,
        [pathKey]: {
          ...prev[pathKey],
          [key]: value,
        },
      }));
    },
    []
  );

  // Apply in browser only (localStorage). Does not reload the editor so tab and scroll are preserved.
  const handlePreview = useCallback(() => {
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(registry));
      localStorage.setItem(CONTENT_MODIFIERS_STORAGE_KEY, JSON.stringify(contentModifiers));
      refreshStyleRegistry();
      refreshContent();
      toast.success("Preview applied. Open or refresh the main site to see changes.");
    } catch (e) {
      console.error("Failed to preview registry", e);
      toast.error("Failed to apply preview.");
    }
  }, [registry, content, contentModifiers, refreshStyleRegistry, refreshContent]);

  // Write to app-registry.ts and style-registry.ts (dev only, with date-stamped backups). Also persists to localStorage and reloads.
  const handleSave = useCallback(async () => {
    try {
      const res = await fetch("/__registry-save-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, style: registry }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Could not save to source files. Try Preview to apply in browser only.");
        return;
      }
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(registry));
      localStorage.setItem(CONTENT_MODIFIERS_STORAGE_KEY, JSON.stringify(contentModifiers));
      toast.success("Saved to app-registry.ts and style-registry.ts. Reloading.");
      window.location.reload();
    } catch (e) {
      console.error("Failed to save registry to source", e);
      toast.error("Could not save to source files. Try Preview to apply in browser only.");
    }
  }, [registry, content, contentModifiers]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setRegistry(JSON.parse(JSON.stringify(STYLE_REGISTRY)));
    setContent(getDefaultContent());
    setContentModifiers({});
  }, []);

  const importInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const backup = {
      style: registry,
      content,
      contentModifiers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registry-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded. Use Import + Save to restore on another browser or after clearing data.");
  }, [registry, content, contentModifiers]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = reader.result as string;
          const data = JSON.parse(raw) as {
            style?: StyleRegistry;
            content?: Record<string, unknown>;
            contentModifiers?: ContentModifiers;
          };
          if (data.style) setRegistry(data.style);
          if (data.content) setContent(data.content);
          if (data.contentModifiers) setContentModifiers(data.contentModifiers ?? {});
          toast.success("Imported. Click Save to persist to this browser.");
        } catch (err) {
          console.error("Import failed", err);
          toast.error("Invalid backup file.");
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    },
    []
  );

  // Render palette select (optional custom onChange for e.g. array items)
  const renderPaletteSelect = (
    label: string,
    path: string[],
    value: number,
    onValueChange?: (value: number) => void
  ) => {
    const paletteOptions = getPaletteOptions();
    const handleChange = onValueChange ?? ((val: number) => updateSection(path, val));
    return (
      <div key={path.join(".")}>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <Select
          value={value.toString()}
          onValueChange={(val) => handleChange(parseInt(val, 10))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paletteOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: opt.preview }}
                  />
                  <span>{opt.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Render text input
  const renderTextInput = (label: string, path: string[], value: string, placeholder?: string) => {
    return (
      <div key={path.join(".")}>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <Input
          value={value}
          onChange={(e) => updateSection(path, e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };

  // Render image path with file picker (pick from /public or type path)
  const renderImagePathInput = (
    label: string,
    value: string,
    onValueChange: (path: string) => void,
    placeholder: string,
    inputId?: string
  ) => {
    const id = inputId ?? `img-path-${label.replace(/\s/g, "-")}`;
    return (
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <div className="flex gap-2">
          <Input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onValueChange(file.name);
                e.target.value = "";
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(id)?.click()}
          >
            Browse…
          </Button>
          <Input
            className="flex-1"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Browse to pick a file (use filename in /public) or type path e.g. hero-skincare.jpg
        </p>
      </div>
    );
  };

  // Render font select
  const renderFontSelect = (label: string, path: string[], value: string) => {
    const fontOptions = getFontOptions();
    return (
      <div key={path.join(".")}>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <Select
          value={value}
          onValueChange={(val) => updateSection(path, val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Render key select (for gradients, shadows, etc.)
  const renderKeySelect = (label: string, path: string[], value: string, options: Array<{ value: string; label: string }>) => {
    return (
      <div key={path.join(".")}>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <Select
          value={value}
          onValueChange={(val) => updateSection(path, val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Render divider controls
  const renderDividerControls = (sectionKey: string, divider: Record<string, unknown>) => {
    const gradientOptions = getGradientOptions();
    return (
      <Card key={`${sectionKey}-divider`}>
        <CardHeader>
          <CardTitle className="text-lg">Divider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderKeySelect("Style", [sectionKey, "divider", "style"], divider.style as string, DIVIDER_STYLE_OPTIONS)}
          {renderPaletteSelect("Top Color", [sectionKey, "divider", "topColorIndex"], divider.topColorIndex as number)}
          {renderPaletteSelect("Bottom Color", [sectionKey, "divider", "bottomColorIndex"], divider.bottomColorIndex as number)}
        </CardContent>
      </Card>
    );
  };

  // Render section preview
  const renderSectionPreview = (sectionKey: string) => {
    const sectionData = registry[sectionKey as keyof StyleRegistry] as Record<string, unknown>;
    if (!sectionData) return null;

    // Try section.backgroundIndex first, then page.backgroundIndex
    const section = sectionData.section as Record<string, unknown> | undefined;
    const page = sectionData.page as Record<string, unknown> | undefined;
    const bgIndex = (section?.backgroundIndex ?? page?.backgroundIndex) as number | undefined;
    const bgColor = bgIndex !== undefined ? registry.general.palette.cells[bgIndex]?.hex : "#ffffff";

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg border"
            style={{ backgroundColor: bgColor }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{SECTION_DISPLAY_NAMES[sectionKey]}</h3>
              <p className="text-sm text-muted-foreground">Style preview for {sectionKey}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render section controls
  const renderSectionControls = (sectionKey: string) => {
    const sectionData = registry[sectionKey as keyof StyleRegistry] as Record<string, unknown>;
    if (!sectionData) return null;

    const controls: JSX.Element[] = [];
    const paletteOptions = getPaletteOptions();
    const gradientOptions = getGradientOptions();
    const shadowOptions = getShadowOptions();
    const fontOptions = getFontOptions();

    // Section-specific controls
    if (sectionKey === "nav") {
      const bar = sectionData.bar as Record<string, unknown> | undefined;
      const logo = sectionData.logo as Record<string, unknown> | undefined;
      const link = sectionData.link as Record<string, unknown> | undefined;
      
      if (bar) {
        controls.push(
          <Card key="nav-bar">
            <CardHeader>
              <CardTitle className="text-lg">Nav Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderKeySelect("Gradient", [sectionKey, "bar", "gradientKey"], (bar.gradientKey as string) || "", gradientOptions)}
              {renderPaletteSelect("Text Color", [sectionKey, "bar", "textColorIndex"], (bar.textColorIndex as number) || 0)}
            </CardContent>
          </Card>
        );
      }
      if (logo) {
        controls.push(
          <Card key="nav-logo">
            <CardHeader>
              <CardTitle className="text-lg">Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderFontSelect("Font Family", [sectionKey, "logo", "fontFamily"], (logo.fontFamily as string) || "")}
            </CardContent>
          </Card>
        );
      }
      if (link) {
        controls.push(
          <Card key="nav-link">
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Text Color", [sectionKey, "link", "textColorIndex"], (link.textColorIndex as number) || 0)}
              {renderPaletteSelect("Hover Background", [sectionKey, "link", "hoverBackgroundIndex"], (link.hoverBackgroundIndex as number) || 0)}
              {renderPaletteSelect("Hover Text", [sectionKey, "link", "hoverTextIndex"], (link.hoverTextIndex as number) || 0)}
            </CardContent>
          </Card>
        );
      }
    } else if (sectionKey === "hero") {
      const section = sectionData.section as Record<string, unknown> | undefined;
      const heading = sectionData.heading as Record<string, unknown> | undefined;
      
      if (section && typeof section.backgroundIndex === "number") {
        controls.push(
          <Card key="hero-section">
            <CardHeader>
              <CardTitle className="text-lg">Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "section", "backgroundIndex"], section.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
      if (heading) {
        controls.push(
          <Card key="hero-heading">
            <CardHeader>
              <CardTitle className="text-lg">Heading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTextInput("Font Size", [sectionKey, "heading", "fontSize"], (heading.fontSize as string) || "")}
              {renderFontSelect("Font Family", [sectionKey, "heading", "fontFamily"], (heading.fontFamily as string) || "")}
              {renderPaletteSelect("Text Color", [sectionKey, "heading", "textColorIndex"], (heading.textColorIndex as number) || 0)}
            </CardContent>
          </Card>
        );
      }
      const image = sectionData.image as Record<string, unknown> | undefined;
      if (image) {
        controls.push(
          <Card key="hero-image">
            <CardHeader>
              <CardTitle className="text-lg">Hero Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderImagePathInput(
                "Image path",
                (image.path as string) || "",
                (path) => updateSection([sectionKey, "image", "path"], path),
                "e.g. hero-skincare.jpg",
                "hero-image-path"
              )}
              {renderTextInput("Height", [sectionKey, "image", "height"], (image.height as string) || "")}
              {renderTextInput("Border radius", [sectionKey, "image", "borderRadius"], (image.borderRadius as string) || "")}
              {renderPaletteSelect("Border color", [sectionKey, "image", "borderColorIndex"], (image.borderColorIndex as number) ?? 0)}
              <div key="hero-image-borderWidth">
                <Label className="text-sm font-medium text-foreground mb-2 block">Border width (px)</Label>
                <Input
                  type="number"
                  min={0}
                  value={(image.borderWidth as number) ?? 0}
                  onChange={(e) => updateSection([sectionKey, "image", "borderWidth"], parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        );
      }
      if (sectionData.divider) {
        controls.push(renderDividerControls(sectionKey, sectionData.divider as Record<string, unknown>));
      }
    } else if (sectionKey === "why") {
      const section = sectionData.section as Record<string, unknown> | undefined;
      if (section && typeof section.backgroundIndex === "number") {
        controls.push(
          <Card key={`${sectionKey}-section`}>
            <CardHeader>
              <CardTitle className="text-lg">Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "section", "backgroundIndex"], section.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
      const whyCards = (sectionData.card ?? STYLE_REGISTRY.why.card) as Array<{ backgroundIndex: number; accentColorIndex: number }>;
      if (whyCards?.length) {
        controls.push(
          <Card key="why-cards">
            <CardHeader>
              <CardTitle className="text-lg">Card colors</CardTitle>
              <p className="text-sm text-muted-foreground">Background and accent for each problem card.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {whyCards.map((card, i) => (
                <div key={`why-card-${i}`} className="space-y-2 rounded-lg border p-3">
                  <span className="text-sm font-medium">Card {i + 1}</span>
                  <div className="grid grid-cols-2 gap-3">
                    {renderPaletteSelect(
                      "Background",
                      [sectionKey, "card", String(i), "backgroundIndex"],
                      card.backgroundIndex ?? 8,
                      (val) => {
                        setRegistry((prev) => ({
                          ...prev,
                          why: {
                            ...prev.why,
                            card: prev.why.card.map((c, j) =>
                              j === i ? { ...c, backgroundIndex: val } : c
                            ),
                          },
                        }));
                      }
                    )}
                    {renderPaletteSelect(
                      "Accent",
                      [sectionKey, "card", String(i), "accentColorIndex"],
                      card.accentColorIndex ?? 2,
                      (val) => {
                        setRegistry((prev) => ({
                          ...prev,
                          why: {
                            ...prev.why,
                            card: prev.why.card.map((c, j) =>
                              j === i ? { ...c, accentColorIndex: val } : c
                            ),
                          },
                        }));
                      }
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      }
      const images = sectionData.images as Array<{ path?: string }> | undefined;
      if (images?.length) {
        controls.push(
          <Card key="why-images">
            <CardHeader>
              <CardTitle className="text-lg">Why / Problem images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.map((img, i) => (
                <div key={`why-img-${i}`}>
                  {renderImagePathInput(
                    `Image ${i + 1} path`,
                    (img.path as string) ?? "",
                    (path) => {
                      const next = [...images];
                      next[i] = { ...next[i], path };
                      setRegistry((prev) => ({ ...prev, why: { ...prev.why, images: next } } as StyleRegistry));
                    },
                    "e.g. problem-1.jpg",
                    `why-image-${i}`
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      }
      if (sectionData.divider) {
        controls.push(renderDividerControls(sectionKey, sectionData.divider as Record<string, unknown>));
      }
    } else if (sectionKey === "howItWorks") {
      const section = sectionData.section as Record<string, unknown> | undefined;
      if (section && typeof section.backgroundIndex === "number") {
        controls.push(
          <Card key={`${sectionKey}-section`}>
            <CardHeader>
              <CardTitle className="text-lg">Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "section", "backgroundIndex"], section.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
      const images = sectionData.images as Array<{ path?: string }> | undefined;
      if (images?.length) {
        controls.push(
          <Card key="howItWorks-images">
            <CardHeader>
              <CardTitle className="text-lg">How it works step images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.map((img, i) => (
                <div key={`how-img-${i}`}>
                  {renderImagePathInput(
                    `Step ${i + 1} image path`,
                    (img.path as string) ?? "",
                    (path) => {
                      const next = [...images];
                      next[i] = { ...next[i], path };
                      setRegistry((prev) => ({ ...prev, howItWorks: { ...prev.howItWorks, images: next } } as StyleRegistry));
                    },
                    "e.g. step-1.jpg",
                    `how-image-${i}`
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      }
      const stepCards = (sectionData.stepCard ?? STYLE_REGISTRY.howItWorks.stepCard) as Array<{ circleBackgroundIndex: number }>;
      if (stepCards?.length) {
        controls.push(
          <Card key="howItWorks-stepCards">
            <CardHeader>
              <CardTitle className="text-lg">Step card circle colors</CardTitle>
              <p className="text-sm text-muted-foreground">Palette index for each step circle background.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {stepCards.map((card, i) => (
                <div key={`step-card-${i}`}>
                  {renderPaletteSelect(
                    `Step ${i + 1} circle`,
                    [sectionKey, "stepCard", String(i), "circleBackgroundIndex"],
                    card.circleBackgroundIndex ?? 8,
                    (val) => {
                      setRegistry((prev) => ({
                        ...prev,
                        howItWorks: {
                          ...prev.howItWorks,
                          stepCard: prev.howItWorks.stepCard.map((c, j) =>
                            j === i ? { ...c, circleBackgroundIndex: val } : c
                          ),
                        },
                      }));
                    }
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      }
      if (sectionData.divider) {
        controls.push(renderDividerControls(sectionKey, sectionData.divider as Record<string, unknown>));
      }
    } else if (sectionKey === "compatibilityTest" || sectionKey === "pricing" || sectionKey === "finalCta" || sectionKey === "faq" || sectionKey === "whatYouReceive" || sectionKey === "pastEditions" || sectionKey === "experience" || sectionKey === "testimonials") {
      const section = sectionData.section as Record<string, unknown> | undefined;
      if (section && typeof section.backgroundIndex === "number") {
        controls.push(
          <Card key={`${sectionKey}-section`}>
            <CardHeader>
              <CardTitle className="text-lg">Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "section", "backgroundIndex"], section.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
      if (sectionKey === "compatibilityTest") {
        const questionCard = (sectionData.questionCard ?? (STYLE_REGISTRY.compatibilityTest as { questionCard?: { backgroundIndex: number } }).questionCard) as { backgroundIndex: number } | undefined;
        const resultCard = (sectionData.resultCard ?? (STYLE_REGISTRY.compatibilityTest as { resultCard?: { backgroundIndex: number } }).resultCard) as { backgroundIndex: number } | undefined;
        if (questionCard || resultCard) {
          controls.push(
            <Card key="compatibilityTest-cards">
              <CardHeader>
                <CardTitle className="text-lg">Panel colors</CardTitle>
                <p className="text-sm text-muted-foreground">Question panel and result panel backgrounds.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {questionCard && renderPaletteSelect("Question panel", [sectionKey, "questionCard", "backgroundIndex"], questionCard.backgroundIndex ?? 0, (val) => {
                  setRegistry((prev) => ({ ...prev, compatibilityTest: { ...prev.compatibilityTest, questionCard: { backgroundIndex: val } } }));
                })}
                {resultCard && renderPaletteSelect("Result panel", [sectionKey, "resultCard", "backgroundIndex"], resultCard.backgroundIndex ?? 11, (val) => {
                  setRegistry((prev) => ({ ...prev, compatibilityTest: { ...prev.compatibilityTest, resultCard: { backgroundIndex: val } } }));
                })}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "pricing") {
        const pricingCard = (sectionData.card ?? STYLE_REGISTRY.pricing.card) as { backgroundIndex: number; borderRadius?: string; shadow?: string };
        const cardBorderByAccent = (sectionData.cardBorderByAccent ?? STYLE_REGISTRY.pricing.cardBorderByAccent) as Record<string, number>;
        const bottomBadges = (sectionData.bottomBadges ?? STYLE_REGISTRY.pricing.bottomBadges) as Array<{ backgroundIndex: number }> | undefined;
        if (pricingCard) {
          controls.push(
            <Card key="pricing-card">
              <CardHeader>
                <CardTitle className="text-lg">Pricing card colors</CardTitle>
                <p className="text-sm text-muted-foreground">Card background and border color by plan accent.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderPaletteSelect("Card background", [sectionKey, "card", "backgroundIndex"], pricingCard.backgroundIndex ?? 13, (val) => {
                  setRegistry((prev) => ({
                    ...prev,
                    pricing: { ...prev.pricing, card: { ...prev.pricing.card, backgroundIndex: val } },
                  }));
                })}
                <div className="space-y-2 pt-2">
                  <span className="text-sm font-medium">Card border by accent</span>
                  {(["lavender", "peach", "mint"] as const).map((key) => (
                    <div key={key}>
                      {renderPaletteSelect(
                        key.charAt(0).toUpperCase() + key.slice(1),
                        [sectionKey, "cardBorderByAccent", key],
                        typeof cardBorderByAccent[key] === "number" ? cardBorderByAccent[key] : (key === "lavender" ? 10 : key === "peach" ? 2 : 11),
                        (val) => {
                          setRegistry((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              cardBorderByAccent: { ...prev.pricing.cardBorderByAccent, [key]: val },
                            },
                          }));
                        }
                      )}
                    </div>
                  ))}
                </div>
                {bottomBadges?.length ? (
                  <div className="space-y-2 pt-4 border-t">
                    <span className="text-sm font-medium">Bottom badges (shipping, commitment)</span>
                    {bottomBadges.map((badge, i) => (
                      <div key={i}>
                        {renderPaletteSelect(`Badge ${i + 1}`, [sectionKey, "bottomBadges", String(i), "backgroundIndex"], badge.backgroundIndex ?? 11, (val) => {
                          setRegistry((prev) => {
                            const badges = prev.pricing.bottomBadges ?? STYLE_REGISTRY.pricing.bottomBadges;
                            return {
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                bottomBadges: badges.map((b, j) => (j === i ? { ...b, backgroundIndex: val } : b)),
                              },
                            };
                          });
                        })}
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "whatYouReceive") {
        const cards = (sectionData.cards ?? STYLE_REGISTRY.whatYouReceive.cards) as Array<{ backgroundIndex: number }>;
        if (cards?.length) {
          controls.push(
            <Card key="whatYouReceive-cards">
              <CardHeader>
                <CardTitle className="text-lg">Product card fill colors</CardTitle>
                <p className="text-sm text-muted-foreground">Palette index for each product card background.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card, i) => (
                  <div key={`wyr-card-${i}`}>
                    {renderPaletteSelect(
                      `Card ${i + 1} background`,
                      [sectionKey, "cards", String(i), "backgroundIndex"],
                      card.backgroundIndex ?? 8,
                      (val) => {
                        setRegistry((prev) => ({
                          ...prev,
                          whatYouReceive: {
                            ...prev.whatYouReceive,
                            cards: prev.whatYouReceive.cards.map((c, j) =>
                              j === i ? { ...c, backgroundIndex: val } : c
                            ),
                          },
                        }));
                      }
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "pastEditions") {
        const cards = (sectionData.cards ?? (STYLE_REGISTRY.pastEditions as { cards?: Array<{ backgroundIndex: number }> }).cards) as Array<{ backgroundIndex: number }>;
        if (cards?.length) {
          controls.push(
            <Card key="pastEditions-cards">
              <CardHeader>
                <CardTitle className="text-lg">Edition card colors</CardTitle>
                <p className="text-sm text-muted-foreground">Palette index per edition card (cycle of 4).</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card, i) => (
                  <div key={`pe-card-${i}`}>
                    {renderPaletteSelect(`Card ${i + 1}`, [sectionKey, "cards", String(i), "backgroundIndex"], card.backgroundIndex ?? 8, (val) => {
                      setRegistry((prev) => ({
                        ...prev,
                        pastEditions: {
                          ...prev.pastEditions,
                          cards: prev.pastEditions.cards.map((c, j) => (j === i ? { ...c, backgroundIndex: val } : c)),
                        },
                      }));
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "experience") {
        const cards = (sectionData.cards ?? (STYLE_REGISTRY.experience as { cards?: Array<{ backgroundIndex: number }> }).cards) as Array<{ backgroundIndex: number }>;
        if (cards?.length) {
          controls.push(
            <Card key="experience-cards">
              <CardHeader>
                <CardTitle className="text-lg">Step card colors</CardTitle>
                <p className="text-sm text-muted-foreground">Palette index per experience step card.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card, i) => (
                  <div key={`exp-card-${i}`}>
                    {renderPaletteSelect(`Card ${i + 1}`, [sectionKey, "cards", String(i), "backgroundIndex"], card.backgroundIndex ?? 8, (val) => {
                      setRegistry((prev) => ({
                        ...prev,
                        experience: {
                          ...prev.experience,
                          cards: prev.experience.cards.map((c, j) => (j === i ? { ...c, backgroundIndex: val } : c)),
                        },
                      }));
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "testimonials") {
        const cards = (sectionData.cards ?? (STYLE_REGISTRY.testimonials as { cards?: Array<{ backgroundIndex: number }> }).cards) as Array<{ backgroundIndex: number }>;
        if (cards?.length) {
          controls.push(
            <Card key="testimonials-cards">
              <CardHeader>
                <CardTitle className="text-lg">Testimonial card colors</CardTitle>
                <p className="text-sm text-muted-foreground">Palette index per testimonial card.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card, i) => (
                  <div key={`test-card-${i}`}>
                    {renderPaletteSelect(`Card ${i + 1}`, [sectionKey, "cards", String(i), "backgroundIndex"], card.backgroundIndex ?? 8, (val) => {
                      setRegistry((prev) => ({
                        ...prev,
                        testimonials: {
                          ...prev.testimonials,
                          cards: prev.testimonials.cards.map((c, j) => (j === i ? { ...c, backgroundIndex: val } : c)),
                        },
                      }));
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionKey === "faq") {
        const item = (sectionData.item ?? (STYLE_REGISTRY.faq as { item?: { backgroundIndex: number } }).item) as { backgroundIndex: number } | undefined;
        if (item) {
          controls.push(
            <Card key="faq-item">
              <CardHeader>
                <CardTitle className="text-lg">Accordion item</CardTitle>
                <p className="text-sm text-muted-foreground">Background for FAQ accordion panels.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderPaletteSelect("Panel background", [sectionKey, "item", "backgroundIndex"], item.backgroundIndex ?? 0, (val) => {
                  setRegistry((prev) => ({ ...prev, faq: { ...prev.faq, item: { backgroundIndex: val } } }));
                })}
              </CardContent>
            </Card>
          );
        }
      }
      if (sectionData.divider) {
        controls.push(renderDividerControls(sectionKey, sectionData.divider as Record<string, unknown>));
      }
    } else if (sectionKey === "login" || sectionKey === "register" || sectionKey === "resetPassword" || sectionKey === "forgotPassword" || sectionKey === "dashboard" || sectionKey === "checkout" || sectionKey === "account" || sectionKey === "page") {
      const page = sectionData.page as Record<string, unknown> | undefined;
      if (page && typeof page.backgroundIndex === "number") {
        controls.push(
          <Card key={`${sectionKey}-page`}>
            <CardHeader>
              <CardTitle className="text-lg">Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "page", "backgroundIndex"], page.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
    } else if (sectionKey === "footer") {
      const section = sectionData.section as Record<string, unknown> | undefined;
      if (section && typeof section.backgroundIndex === "number") {
        controls.push(
          <Card key="footer-section">
            <CardHeader>
              <CardTitle className="text-lg">Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderPaletteSelect("Background", [sectionKey, "section", "backgroundIndex"], section.backgroundIndex)}
            </CardContent>
          </Card>
        );
      }
    }

    return controls.length > 0 ? <div className="space-y-4">{controls}</div> : null;
  };

  // Render content (text) controls for a section: merged base (APP_REGISTRY) + overrides so all variables (e.g. all 3 pricing plans) appear
  const renderContentControls = (sectionKey: string) => {
    const sectionContent = getMergedSectionContent(sectionKey, content);
    if (!sectionContent || typeof sectionContent !== "object" || Array.isArray(sectionContent)) return null;
    const entries = getContentEntries(sectionContent, [sectionKey], [SECTION_DISPLAY_NAMES[sectionKey] ?? sectionKey]);
    if (entries.length === 0) return null;
    const fontOptions = getFontOptions();
    const paletteOptions = getPaletteOptions();
    return (
      <Card key={`${sectionKey}-content`}>
        <CardHeader>
          <CardTitle className="text-lg">Content (text)</CardTitle>
          <p className="text-sm text-muted-foreground">All user-facing strings. Each row: text, font family, size, color.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map(({ path, label, value }) => {
            const pathKey = path.join(".");
            const mod = contentModifiers[pathKey] ?? {};
            const fontFamily = mod.fontFamily ?? registry.general.fonts[0]?.name ?? "";
            const fontSize = mod.fontSize ?? "1rem";
            const colorIndex = mod.colorIndex ?? 0;
            return (
              <div key={pathKey} className="space-y-2">
                <Label className="text-sm font-medium text-foreground">{label}</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    className="flex-1 min-w-[140px]"
                    value={value}
                    onChange={(e) => updateContent(path, e.target.value)}
                    placeholder={label}
                  />
                  <Select
                    value={fontFamily}
                    onValueChange={(v) => updateContentModifier(pathKey, "fontFamily", v)}
                  >
                    <SelectTrigger className="w-[140px] shrink-0">
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={fontSize}
                    onValueChange={(v) => updateContentModifier(pathKey, "fontSize", v)}
                  >
                    <SelectTrigger className="w-[100px] shrink-0">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_SIZE_PRESETS.map((preset) => (
                        <SelectItem key={preset} value={preset}>
                          {preset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => openContentColorModal(pathKey)}
                    className="shrink-0 inline-flex items-center justify-center min-w-[4rem] px-3 py-1.5 rounded-full text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{
                      backgroundColor: registry.general.palette.cells[colorIndex]?.hex ?? "#000000",
                      color: getContrastColor(registry.general.palette.cells[colorIndex]?.hex ?? "#000000"),
                    }}
                  >
                    {colorIndex}
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  // Render section tab
  const renderSectionTab = (sectionKey: string) => {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Style</h2>
          {renderSectionControls(sectionKey)}
        </div>
        {(APP_REGISTRY as Record<string, unknown>)[sectionKey] !== undefined && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            {renderContentControls(sectionKey)}
          </div>
        )}
        <div>
          {renderSectionPreview(sectionKey)}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      {/* Sticky header: title + Save/Reset */}
      <header className="shrink-0 border-b bg-background z-10">
        <div className="container mx-auto pt-24 pb-4 px-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Registry Editor
              </h1>
              <p className="text-muted-foreground">
                Edit style and text variables for the entire application.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleExport}>
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => importInputRef.current?.click()}
              >
                Import
              </Button>
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImport}
              />
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main: left nav (fixed) + scrollable content */}
      <main className="flex-1 min-h-0 flex overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-1 min-h-0 min-w-0">
          <div className="shrink-0 border-r bg-muted/50 py-4 pl-4 pr-2">
            <TabsList className="flex flex-col h-fit w-52 bg-muted p-1.5 rounded-lg">
              {SECTION_KEYS.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {SECTION_DISPLAY_NAMES[key]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto py-6 pr-6 pl-6 max-w-4xl">
          {/* General Tab */}
          <TabsContent value="general" className="mt-0">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
                <div
                  className="grid gap-3 border rounded-lg p-4"
                  style={{
                    gridTemplateColumns: `repeat(${registry.general.palette.cols}, minmax(7.5rem, 1fr))`,
                  }}
                >
                  {registry.general.palette.cells.map((cell, index) => {
                    const contrastColor = getContrastColor(cell.hex);
                    return (
                      <div
                        key={index}
                        className="relative min-w-[7.5rem] min-h-[7.5rem] aspect-square rounded border border-border cursor-pointer hover:ring-2 hover:ring-ring transition-all"
                        style={{ backgroundColor: cell.hex }}
                        onClick={() => handleCellClick(index)}
                      >
                        {/* Index ID - Top Right */}
                        <div
                          className="absolute top-1 right-1 text-xs font-bold px-1 rounded"
                          style={{ color: contrastColor }}
                        >
                          {index}
                        </div>
                        {/* Hex, Name, Comment - Bottom Left */}
                        <div
                          className="absolute bottom-0 left-0 right-0 pb-3 px-2 space-y-0.5"
                          style={{ color: contrastColor }}
                        >
                          <div className="text-xs font-mono">{cell.hex}</div>
                          {cell.name && <div className="text-xs font-medium">{cell.name}</div>}
                          {cell.comment && <div className="text-xs opacity-90">{cell.comment}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Fonts</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {registry.general.fonts.map((font, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Select
                            value={font.name}
                            onValueChange={(val) => {
                              const newFonts = [...registry.general.fonts];
                              newFonts[index] = { ...newFonts[index], name: val };
                              setRegistry((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  fonts: newFonts,
                                },
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getFontOptions().map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {index === 0 && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        {registry.general.fonts.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newFonts = registry.general.fonts.filter((_, i) => i !== index);
                              setRegistry((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  fonts: newFonts,
                                },
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <div
                          className="text-sm"
                          style={{ fontFamily: font.name }}
                        >
                          Kumi box shows the font grady
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const currentNames = new Set(registry.general.fonts.map((f) => f.name));
                        const availableToAdd = availableFonts.filter((f) => !currentNames.has(f));
                        const effectiveFontToAdd =
                          fontToAdd && availableToAdd.includes(fontToAdd)
                            ? fontToAdd
                            : availableToAdd[0] || availableFonts[0] || "Arial";
                        return (
                          <>
                            <Select
                              value={availableToAdd.length ? effectiveFontToAdd : ""}
                              onValueChange={(v) => setFontToAdd(v)}
                              disabled={!availableToAdd.length}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Font to add" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableToAdd.map((name) => (
                                  <SelectItem key={name} value={name}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const pick = availableToAdd.length ? effectiveFontToAdd : availableFonts[0] || "Arial";
                                const newFonts = [...registry.general.fonts, { name: pick }];
                                setRegistry((prev) => ({
                                  ...prev,
                                  general: {
                                    ...prev.general,
                                    fonts: newFonts,
                                  },
                                }));
                              }}
                              disabled={!availableFonts.length}
                            >
                              Add Font
                            </Button>
                          </>
                        );
                      })()}
                      <Button
                        variant="outline"
                        onClick={handleRefreshFonts}
                        disabled={scanningFonts}
                      >
                        {scanningFonts ? "Scanning..." : "Refresh Fonts"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <h2 className="text-xl font-semibold mb-4 mt-6">Radius</h2>
                <Card>
                  <CardContent className="pt-6">
                    {renderTextInput("Default Radius", ["general", "radius", "default"], registry.general.radius.default)}
                  </CardContent>
                </Card>

                <h2 className="text-xl font-semibold mb-4 mt-6">Shadows</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {Object.entries(registry.general.shadow).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm font-medium text-foreground mb-2 block capitalize">{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) => updateSection(["general", "shadow", key], e.target.value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <h2 className="text-xl font-semibold mb-4 mt-6">Gradients</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {Object.entries(registry.general.gradient).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm font-medium text-foreground mb-2 block capitalize">{key}</Label>
                        <Input
                          value={value}
                          onChange={(e) => updateSection(["general", "gradient", key], e.target.value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Section/Page Tabs */}
          {SECTION_KEYS.filter((key) => key !== "general").map((sectionKey) => (
            <TabsContent key={sectionKey} value={sectionKey} className="mt-0">
              {renderSectionTab(sectionKey)}
            </TabsContent>
          ))}
          </div>
        </Tabs>
      </main>

      {/* Color Picker Modal (palette edit from General matrix, or pick color for content from pill) */}
      <Dialog open={colorPickerOpen} onOpenChange={handleColorModalOpenChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{contentColorPathKey ? "Pick color for text" : "Edit Color"}</DialogTitle>
              <DialogDescription>
                {contentColorPathKey
                  ? "Choose a palette color below or use the picker on the left for a specific color."
                  : `Edit color, name, and comment for palette index ${selectedColorIndex}`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Color Picker</Label>
                <HexColorPicker color={tempColor} onChange={handleColorChange} />
                <div className="mt-2">
                  <Label className="text-sm font-medium mb-1 block">Hex Value</Label>
                  <Input
                    value={tempColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                </div>
              </div>
              {contentColorPathKey ? (
                <div>
                  <Label className="text-sm font-medium mb-2 block">General color matrix</Label>
                  <p className="text-muted-foreground text-sm mb-2">Click a cell to use that color for this text.</p>
                  <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-auto">
                    {registry.general.palette.cells.map((cell, index) => {
                      const contrastColor = getContrastColor(cell.hex);
                      return (
                        <button
                          key={index}
                          type="button"
                          className="relative min-w-[4rem] min-h-[4rem] rounded-lg border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                          style={{ backgroundColor: cell.hex }}
                          onClick={() => {
                            updateContentModifier(contentColorPathKey, "colorIndex", index);
                            setColorPickerOpen(false);
                            setContentColorPathKey(null);
                          }}
                        >
                          <span className="absolute bottom-0.5 left-0.5 text-xs font-bold px-1 rounded" style={{ color: contrastColor }}>
                            {index}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Name</Label>
                    <Input
                      value={tempName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Color name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Comment</Label>
                    <Input
                      value={tempComment}
                      onChange={(e) => handleCommentChange(e.target.value)}
                      placeholder="Usage notes"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
