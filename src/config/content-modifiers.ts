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
export const CONTENT_MODIFIERS_DEFAULT: ContentModifiers = {};

