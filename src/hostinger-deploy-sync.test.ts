import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const HOSTINGER_DIR = path.resolve(__dirname, "../Hostinger");
const HOSTINGER_INDEX = path.join(HOSTINGER_DIR, "index.html");
const DIST_DIR = path.resolve(__dirname, "../dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");

function getAssetPath(html: string, extension: "js" | "css") {
  const pattern =
    extension === "js"
      ? /\/assets\/([^"'<>]+\.js)/i
      : /\/assets\/([^"'<>]+\.css)/i;
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Could not find a ${extension.toUpperCase()} asset reference.`);
  }

  return match[1];
}

describe("Hostinger deploy artifacts", () => {
  it("matches the latest built entry bundles", () => {
    const distHtml = fs.readFileSync(DIST_INDEX, "utf8");
    const hostingerHtml = fs.readFileSync(HOSTINGER_INDEX, "utf8");
    const expectedJs = getAssetPath(distHtml, "js");
    const expectedCss = getAssetPath(distHtml, "css");

    expect(hostingerHtml).toContain(`/assets/${expectedJs}`);
    expect(hostingerHtml).toContain(`/assets/${expectedCss}`);
    expect(fs.existsSync(path.join(HOSTINGER_DIR, "assets", expectedJs))).toBe(true);
    expect(fs.existsSync(path.join(HOSTINGER_DIR, "assets", expectedCss))).toBe(true);
  });
});
