/**
 * Returns the default registry (content + style + contentModifiers) when no registry.json exists.
 * Used at bootstrap when fetch(/registry.json) fails or returns 404.
 */

import { APP_REGISTRY, type AppRegistry } from "@/config/app-registry";
import { STYLE_REGISTRY, type StyleRegistry } from "@/config/style-registry";
import { CONTENT_MODIFIERS_DEFAULT } from "@/config/content-modifiers";

export type ContentModifiers = Record<
  string,
  { fontFamily?: string; fontSize?: string; colorIndex?: number }
>;

export type RegistrySnapshot = {
  content: AppRegistry;
  style: StyleRegistry;
  contentModifiers: ContentModifiers;
};

export function getDefaultRegistry(): RegistrySnapshot {
  return {
    content: JSON.parse(JSON.stringify(APP_REGISTRY)) as AppRegistry,
    style: JSON.parse(JSON.stringify(STYLE_REGISTRY)) as StyleRegistry,
    contentModifiers: JSON.parse(JSON.stringify(CONTENT_MODIFIERS_DEFAULT)) as ContentModifiers,
  };
}
