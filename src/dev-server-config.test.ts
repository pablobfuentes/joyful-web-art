import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("vite dev server config", () => {
  it("uses a dedicated dev port with strict binding", () => {
    const filePath = path.resolve(__dirname, "../vite.config.ts");
    const viteConfig = fs.readFileSync(filePath, "utf8");

    expect(viteConfig).toContain("port: 5180");
    expect(viteConfig).toContain("strictPort: true");
  });
});
