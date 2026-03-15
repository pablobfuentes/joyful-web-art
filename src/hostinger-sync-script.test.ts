import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve(__dirname, "../scripts/sync-hostinger.ps1");
const PACKAGE_JSON_PATH = path.resolve(__dirname, "../package.json");
const tempRoots: string[] = [];

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hostinger-sync-"));
  tempRoots.push(root);
  return root;
}

function writeFile(targetPath: string, contents: string) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents, "utf8");
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("Hostinger sync script", () => {
  it("exposes a package command for the one-step refresh flow", () => {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.["hostinger:refresh"]).toBeTruthy();
  });

  it("archives generated deploy files and copies the latest dist output", () => {
    expect(fs.existsSync(SCRIPT_PATH)).toBe(true);

    const root = makeTempRoot();
    const hostingerDir = path.join(root, "Hostinger");
    const distDir = path.join(root, "dist");
    const historyDir = path.join(hostingerDir, "history", "test-stamp");

    writeFile(
      path.join(hostingerDir, "index.html"),
      "<script type=\"module\" src=\"/assets/index-old.js\"></script><link rel=\"stylesheet\" href=\"/assets/index-old.css\">",
    );
    writeFile(path.join(hostingerDir, "assets", "index-old.js"), "old-js");
    writeFile(path.join(hostingerDir, "assets", "index-old.css"), "old-css");
    writeFile(path.join(hostingerDir, "keep.txt"), "preserve-me");

    writeFile(
      path.join(distDir, "index.html"),
      "<script type=\"module\" src=\"/assets/index-new.js\"></script><link rel=\"stylesheet\" href=\"/assets/index-new.css\">",
    );
    writeFile(path.join(distDir, "assets", "index-new.js"), "new-js");
    writeFile(path.join(distDir, "assets", "index-new.css"), "new-css");

    const result = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        SCRIPT_PATH,
        "-HostingerDir",
        hostingerDir,
        "-DistDir",
        distDir,
        "-Timestamp",
        "test-stamp",
      ],
      { encoding: "utf8" },
    );

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(hostingerDir, "index.html"), "utf8")).toContain(
      "/assets/index-new.js",
    );
    expect(fs.readFileSync(path.join(hostingerDir, "assets", "index-new.js"), "utf8")).toBe(
      "new-js",
    );
    expect(fs.readFileSync(path.join(hostingerDir, "assets", "index-new.css"), "utf8")).toBe(
      "new-css",
    );
    expect(fs.readFileSync(path.join(hostingerDir, "keep.txt"), "utf8")).toBe("preserve-me");
    expect(fs.readFileSync(path.join(historyDir, "index.html"), "utf8")).toContain(
      "/assets/index-old.js",
    );
    expect(fs.readFileSync(path.join(historyDir, "assets", "index-old.js"), "utf8")).toBe(
      "old-js",
    );
  });
});
