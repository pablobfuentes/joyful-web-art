import { describe, expect, it } from "vitest";
import { validatePastEditionImageFile, PAST_EDITION_IMAGE_MAX_BYTES } from "./past-edition-image-upload";

describe("validatePastEditionImageFile", () => {
  it("rejects non-image types", () => {
    const f = new File([""], "x.txt", { type: "text/plain" });
    expect(validatePastEditionImageFile(f)).toMatch(/imagen/i);
  });

  it("rejects oversize files", () => {
    const buf = new Uint8Array(PAST_EDITION_IMAGE_MAX_BYTES + 1);
    const f = new File([buf], "huge.jpg", { type: "image/jpeg" });
    expect(validatePastEditionImageFile(f)).toMatch(/5/);
  });

  it("accepts small image files", () => {
    const f = new File([new Uint8Array(100)], "a.png", { type: "image/png" });
    expect(validatePastEditionImageFile(f)).toBeNull();
  });
});
