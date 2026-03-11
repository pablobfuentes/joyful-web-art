import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("index.html metadata", () => {
  it("does not contain Lovable branding", () => {
    const indexPath = path.resolve(__dirname, "../index.html");
    const html = fs.readFileSync(indexPath, "utf8");

    expect(html).not.toContain("Lovable App");
    expect(html).not.toContain("Lovable Generated Project");
    expect(html).not.toContain("https://lovable.dev/");
    expect(html).not.toContain("@Lovable");
  });
});
