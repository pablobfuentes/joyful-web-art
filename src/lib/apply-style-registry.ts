/**
 * Runtime bridge: apply style registry to DOM (inject CSS variables).
 * So Tailwind and existing utility classes keep working with registry-driven values.
 * See docs/STYLE_VARIABLES_INVENTORY.md for palette index → semantic var mapping.
 */

import type { StyleRegistry } from "@/config/style-registry";

/** Convert hex to HSL; return "H S% L%" for CSS var (Tailwind uses hsl(var(--x))). */
function hexToHslString(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 100%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const H = Math.round(360 * h);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `${H} ${S}% ${L}%`;
}

/** Get HSL string for a palette index (for section-specific vars). */
function getPaletteHsl(cells: { hex: string }[], index: number): string {
  const cell = cells[index];
  return cell ? hexToHslString(cell.hex) : "0 0% 100%";
}

/** Palette index → semantic CSS variable name (so Tailwind keeps working). */
const PALETTE_INDEX_TO_CSS_VAR: Record<number, string> = {
  0: "--background",
  1: "--foreground",
  2: "--primary",
  3: "--primary-foreground",
  4: "--secondary",
  5: "--secondary-foreground",
  6: "--muted",
  7: "--accent",
  8: "--peach",
  9: "--peach-strong",
  10: "--lavender",
  11: "--mint",
  12: "--sunshine",
  13: "--card",
  14: "--border",
  15: "--destructive",
  16: "--bubblegum",
};

/**
 * Apply style registry to document root. Injects palette as --palette-N (HSL string)
 * and semantic vars (--background, --primary, etc.) from palette so Tailwind works.
 */
export function applyStyleRegistry(registry: StyleRegistry): void {
  const root = document.documentElement;
  const cells = registry.general.palette.cells;

  cells.forEach((cell, index) => {
    const hsl = hexToHslString(cell.hex);
    root.style.setProperty(`--palette-${index}`, hsl);
    const semanticVar = PALETTE_INDEX_TO_CSS_VAR[index];
    if (semanticVar) {
      root.style.setProperty(semanticVar, hsl);
    }
  });

  root.style.setProperty("--radius", registry.general.radius.default);
  // Set default font (first in list) as both display and body
  const defaultFont = registry.general.fonts.find((f) => f.isDefault) || registry.general.fonts[0];
  if (defaultFont) {
    root.style.setProperty("--font-display", defaultFont.name);
    root.style.setProperty("--font-body", defaultFont.name);
  }
  root.style.setProperty("--shadow-soft", registry.general.shadow.soft);
  root.style.setProperty("--shadow-card", registry.general.shadow.card);
  root.style.setProperty("--shadow-card-hover", registry.general.shadow.cardHover);
  root.style.setProperty("--shadow-playful", registry.general.shadow.playful);
  root.style.setProperty("--gradient-warm", registry.general.gradient.warm);
  root.style.setProperty("--gradient-soft", registry.general.gradient.soft);
  root.style.setProperty("--gradient-candy", registry.general.gradient.candy);

  const h = registry.hero;
  root.style.setProperty("--hero-section-bg", getPaletteHsl(cells, h.section.backgroundIndex));
  root.style.setProperty("--hero-pattern-opacity", String(h.section.patternOpacity ?? 0.6));
  root.style.setProperty("--hero-badge-bg", getPaletteHsl(cells, h.badge.backgroundIndex));
  root.style.setProperty("--hero-badge-text", getPaletteHsl(cells, h.badge.textColorIndex));
  root.style.setProperty("--hero-quote-color", getPaletteHsl(cells, h.quote.textColorIndex));
  root.style.setProperty("--hero-heading-color", getPaletteHsl(cells, h.heading.textColorIndex));
  root.style.setProperty("--hero-description-color", getPaletteHsl(cells, h.description.textColorIndex));
  root.style.setProperty("--hero-footer-color", getPaletteHsl(cells, h.footer.textColorIndex));
  root.style.setProperty("--hero-secondary-border", getPaletteHsl(cells, h.secondaryButton.borderColorIndex));
  root.style.setProperty("--hero-secondary-bg", getPaletteHsl(cells, h.secondaryButton.backgroundIndex));
  root.style.setProperty("--hero-secondary-text", getPaletteHsl(cells, h.secondaryButton.textColorIndex));
  root.style.setProperty("--hero-image-height", h.image.height ?? "450px");
  root.style.setProperty("--hero-image-border-width", String(h.image.borderWidth ?? 4));
  root.style.setProperty("--hero-image-border-color", getPaletteHsl(cells, h.image.borderColorIndex ?? 0));
  root.style.setProperty("--hero-image-radius", h.image.borderRadius ?? "1.5rem");
  root.style.setProperty("--hero-badge-radius", h.badge.borderRadius);
  root.style.setProperty("--hero-primary-radius", h.primaryButton.borderRadius);
  root.style.setProperty("--hero-secondary-radius", h.secondaryButton.borderRadius);

  root.style.setProperty("--why-section-bg", getPaletteHsl(cells, registry.why.section.backgroundIndex));
  root.style.setProperty("--howItWorks-section-bg", getPaletteHsl(cells, registry.howItWorks.section.backgroundIndex));
  root.style.setProperty("--compatibilityTest-section-bg", getPaletteHsl(cells, registry.compatibilityTest.section.backgroundIndex));
  root.style.setProperty("--whatYouReceive-section-bg", getPaletteHsl(cells, registry.whatYouReceive.section.backgroundIndex));
  root.style.setProperty("--pastEditions-section-bg", getPaletteHsl(cells, registry.pastEditions.section.backgroundIndex));
  root.style.setProperty("--experience-section-bg", getPaletteHsl(cells, registry.experience.section.backgroundIndex));
  root.style.setProperty("--testimonials-section-bg", getPaletteHsl(cells, registry.testimonials.section.backgroundIndex));
  root.style.setProperty("--pricing-section-bg", getPaletteHsl(cells, registry.pricing.section.backgroundIndex));
  root.style.setProperty("--faq-section-bg", getPaletteHsl(cells, registry.faq.section.backgroundIndex));
  root.style.setProperty("--finalCta-section-bg", getPaletteHsl(cells, registry.finalCta.section.backgroundIndex));
  root.style.setProperty("--footer-section-bg", getPaletteHsl(cells, registry.footer.section.backgroundIndex));

  const nav = registry.nav;
  root.style.setProperty("--nav-link-color", getPaletteHsl(cells, nav.link.textColorIndex));
  root.style.setProperty("--nav-link-hover-bg", getPaletteHsl(cells, nav.link.hoverBackgroundIndex));
  root.style.setProperty("--nav-link-hover-text", getPaletteHsl(cells, nav.link.hoverTextIndex));
  root.style.setProperty("--nav-cta-radius", nav.cta.borderRadius);

  if (registry.general.fonts.importUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[data-style-registry-fonts="true"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-style-registry-fonts", "true");
      document.head.appendChild(link);
    }
    link.href = registry.general.fonts.importUrl;
  }
}
