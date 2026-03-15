import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDefaultRegistry } from "./get-default-registry";
import { CONTENT_MODIFIERS_DEFAULT } from "./content-modifiers";
import { APP_REGISTRY } from "./app-registry";

describe("getDefaultRegistry", () => {
  it("should initialize contentModifiers from CONTENT_MODIFIERS_DEFAULT snapshot", () => {
    const snapshot = getDefaultRegistry();
    expect(snapshot.contentModifiers).toEqual(CONTENT_MODIFIERS_DEFAULT);
  });

  it("keeps the public registry aligned for the how-it-works CTA and delivery anchor", () => {
    const registryPath = resolve(process.cwd(), "public/registry.json");
    const publicRegistry = JSON.parse(readFileSync(registryPath, "utf8")) as {
      content: {
        howItWorks?: { ctaButton?: { label?: string; href?: string } };
        footer?: {
          navigate?: {
            links?: Array<{ label?: string; href?: string }>;
          };
        };
      };
    };

    expect(publicRegistry.content.howItWorks?.ctaButton).toEqual(APP_REGISTRY.howItWorks.ctaButton);

    const deliveryLink = publicRegistry.content.footer?.navigate?.links?.find(
      (link) => link.label === "Envíos",
    );
    expect(deliveryLink?.href).toBe("#delivery-windows");
  });
});

