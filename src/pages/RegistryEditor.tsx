import { useState, useCallback, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Navbar from "@/components/Navbar";
import { STYLE_REGISTRY, type StyleRegistry, type PaletteCell } from "@/config/style-registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

export default function RegistryEditor() {
  const [registry, setRegistry] = useState<StyleRegistry>(STYLE_REGISTRY);
  const [selectedTab, setSelectedTab] = useState("general");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [tempColor, setTempColor] = useState("#000000");
  const [tempName, setTempName] = useState("");
  const [tempComment, setTempComment] = useState("");
  const [availableFonts, setAvailableFonts] = useState<string[]>([]);
  const [scanningFonts, setScanningFonts] = useState(false);

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
      const response = await fetch("/fonts/custom-fonts.css");
      if (!response.ok) {
        setAvailableFonts([]);
        return;
      }
      const css = await response.text();
      const fontMatches = css.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]([^'"]+)['"]/gi);
      const fonts = Array.from(fontMatches, (m) => m[1]).filter((f, i, arr) => arr.indexOf(f) === i);
      setAvailableFonts(fonts);
    } catch (error) {
      console.error("Failed to scan fonts:", error);
      setAvailableFonts([]);
    } finally {
      setScanningFonts(false);
    }
  }, []);

  useEffect(() => {
    scanAvailableFonts();
  }, []);

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
    const cell = registry.general.palette.cells[index];
    setSelectedColorIndex(index);
    setTempColor(cell.hex);
    setTempName(cell.name || "");
    setTempComment(cell.comment || "");
    setColorPickerOpen(true);
  }, [registry.general.palette.cells]);

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

  // Handle refresh fonts
  const handleRefreshFonts = useCallback(() => {
    scanAvailableFonts();
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

  // Render palette select
  const renderPaletteSelect = (label: string, path: string[], value: number) => {
    const paletteOptions = getPaletteOptions();
    return (
      <div key={path.join(".")}>
        <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
        <Select
          value={value.toString()}
          onValueChange={(val) => updateSection(path, parseInt(val, 10))}
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
      if (sectionData.divider) {
        controls.push(renderDividerControls(sectionKey, sectionData.divider as Record<string, unknown>));
      }
    } else if (sectionKey === "why" || sectionKey === "howItWorks" || sectionKey === "compatibilityTest" || sectionKey === "pricing" || sectionKey === "finalCta" || sectionKey === "faq" || sectionKey === "whatYouReceive" || sectionKey === "pastEditions" || sectionKey === "experience" || sectionKey === "testimonials") {
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

  // Render section tab
  const renderSectionTab = (sectionKey: string) => {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          {renderSectionControls(sectionKey)}
        </div>
        <div>
          {renderSectionPreview(sectionKey)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-12 px-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Registry Editor
          </h1>
          <p className="text-muted-foreground">
            Edit style and text variables for the entire application.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col sm:flex-row gap-6">
          <TabsList className="flex flex-col h-fit w-full sm:w-52 shrink-0 bg-muted p-1.5 rounded-lg">
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

          <div className="flex-1 min-w-0">
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newFonts = [...registry.general.fonts, { name: availableFonts[0] || "Arial" }];
                          setRegistry((prev) => ({
                            ...prev,
                            general: {
                              ...prev.general,
                              fonts: newFonts,
                            },
                          }));
                        }}
                      >
                        Add Font
                      </Button>
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

        {/* Color Picker Modal */}
        <Dialog open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Color</DialogTitle>
              <DialogDescription>
                Edit color, name, and comment for palette index {selectedColorIndex}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Color Picker</Label>
                <HexColorPicker color={tempColor} onChange={handleColorChange} />
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hex Value</Label>
                  <Input
                    value={tempColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                </div>
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
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
