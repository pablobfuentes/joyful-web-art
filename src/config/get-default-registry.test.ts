import { describe, it, expect } from "vitest";
import { getDefaultRegistry } from "./get-default-registry";
import { CONTENT_MODIFIERS_DEFAULT } from "./content-modifiers";

describe("getDefaultRegistry", () => {
  it("should initialize contentModifiers from CONTENT_MODIFIERS_DEFAULT snapshot", () => {
    const snapshot = getDefaultRegistry();
    expect(snapshot.contentModifiers).toEqual(CONTENT_MODIFIERS_DEFAULT);
  });
});

