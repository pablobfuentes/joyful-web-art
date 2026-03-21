import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("RegistryEditor", () => {
  it("wires dedicated image pickers for logo occurrences", () => {
    const source = readFileSync(resolve(process.cwd(), "src/pages/RegistryEditor.tsx"), "utf8");

    expect(source).toContain('"Logo image"');
    expect(source).toContain('"Brand logo image"');
    expect(source).toContain('updateContent([sectionKey, "logoImagePath"], path)');
    expect(source).toContain('updateContent([sectionKey, "brand", "imagePath"], path)');
    expect(source).toContain('new Set(["nav.logoImagePath", "comingSoon.brand.imagePath"])');
  });

  it("Past Editions uses dedicated carousel file pickers and filters edition URL fields from generic content rows", () => {
    const source = readFileSync(resolve(process.cwd(), "src/pages/RegistryEditor.tsx"), "utf8");

    expect(source).toContain("renderPastEditionsCarouselContent");
    expect(source).toContain('sectionKey === "pastEditions" && path[1] === "editions"');
    expect(source).toContain("resolvePastEditionImageUrl");
    expect(source).toContain("Elegir imagen");
  });
});
