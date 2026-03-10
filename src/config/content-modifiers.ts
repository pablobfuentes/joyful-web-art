import type { ContentModifiers } from "@/config/get-default-registry";

/**
 * Versioned, git-tracked source of truth for per-element content modifiers.
 * Each key is a path used by RegistryEditor / getStyleForPath, e.g. "hero.heading".
 *
 * fontFamily: optional custom font family for this element
 * fontSize: optional font-size override (e.g. "3rem")
 * colorIndex: optional palette index to map to --palette-N for text color
 *
 * NOTE: Keep this in sync with RegistryEditor exports. LocalStorage preview
 * may layer temporary overrides on top, but this file is the committed baseline.
 */
export const CONTENT_MODIFIERS_DEFAULT: ContentModifiers = {
  "hero.description": {
    colorIndex: 3,
    fontFamily: "DM Sans",
    fontSize: "1.5rem",
  },
  "hero.rotatingQuotes.0": {
    fontSize: "2rem",
    colorIndex: 2,
    fontFamily: "Playfair Display",
  },
  "hero.rotatingQuotes.1": {
    fontSize: "2rem",
    colorIndex: 2,
  },
  "hero.rotatingQuotes.2": {
    fontSize: "2rem",
    colorIndex: 2,
  },
  "howItWorks.steps.0.label": {
    fontSize: "3rem",
    fontFamily: "Playfair Display",
  },
  "howItWorks.steps.1.label": {
    fontSize: "3rem",
  },
  "howItWorks.steps.2.label": {
    fontSize: "3rem",
  },
  "howItWorks.steps.3.label": {
    fontSize: "3rem",
  },
  "nav.logoText": {
    fontFamily: "LEMONMILK Regular",
  },
  "nav.links.0.label": {
    fontFamily: "Cocogoose Pro Regular trial",
  },
  "why.title": {
    fontFamily: "LEMONMILK Regular",
  },
  "howItWorks.title": {
    fontFamily: "LEMONMILK Regular",
    fontSize: "3rem",
  },
  "hero.footer": {
    fontSize: "1rem",
  },
  "howItWorks.steps.2.description": {
    colorIndex: 3,
  },
  "howItWorks.steps.0.description": {
    colorIndex: 3,
  },
  "howItWorks.steps.1.description": {
    colorIndex: 3,
  },
  "howItWorks.steps.3.description": {
    colorIndex: 3,
  },
  "howItWorks.steps.0.title": {
    fontSize: "2rem",
    fontFamily: "Playfair Display",
  },
};

