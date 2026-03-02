import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import history from "connect-history-api-fallback";
import { componentTagger } from "lovable-tagger";
import type { Connect } from "vite";

/** SPA fallback: serve index.html for routes like /admin/registry-editor so client-side routing works. */
function spaFallbackPlugin() {
  const historyHandler = history({
    index: "/",
    // Don't rewrite Vite internals (@vite/client, @react-refresh, @id/..., etc.)
    rewrites: [{ from: /^\/@/, to: (ctx: { parsedUrl: { pathname: string } }) => ctx.parsedUrl.pathname }],
  });
  return {
    name: "spa-fallback",
    configureServer(server: { middlewares: Connect.Server }) {
      // Prepend so non-file requests are rewritten to / before Vite tries to serve files
      const stack = (server.middlewares as Connect.Server & { stack?: unknown[] }).stack;
      if (Array.isArray(stack)) {
        stack.unshift({
          route: "",
          handle: historyHandler,
        });
      } else {
        // Fallback: add at end (subroutes may still 404; open http://localhost:8080/ for home)
        server.middlewares.use(historyHandler);
      }
    },
  };
}

const FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

/** Dev-only: GET /api/sync-fonts lists public/fonts/, appends @font-face for any file not in custom-fonts.css, writes file, returns { added: string[] }. */
function syncFontsPlugin() {
  return {
    name: "sync-fonts",
    configureServer(server: { middlewares: Connect.Server & { stack?: Array<{ route: string; handle: (req: unknown, res: unknown, next: () => void) => void }> } }) {
      const handle = (req: Connect.IncomingMessage, res: Connect.ServerResponse, next: () => void) => {
        if (req.method !== "GET" || req.url !== "/api/sync-fonts") {
          next();
          return;
        }
        console.log("[sync-fonts] GET /api/sync-fonts requested");
        try {
          const projectRoot = path.resolve(__dirname);
          const fontsDir = path.join(projectRoot, "public", "fonts");
          const cssPath = path.join(fontsDir, "custom-fonts.css");
          console.log("[sync-fonts] fontsDir:", fontsDir);
          const fontsDirExists = fs.existsSync(fontsDir);
          console.log("[sync-fonts] fonts folder exists:", fontsDirExists);
          if (!fontsDirExists) {
            console.log("[sync-fonts] No fonts folder – returning added: []");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, added: [] }));
            return;
          }
          const allInDir = fs.readdirSync(fontsDir, { withFileTypes: true });
          console.log("[sync-fonts] All entries in fonts folder:", allInDir.map((e) => (e.isFile() ? `file: ${e.name}` : `dir: ${e.name}`)));
          const existingCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
          console.log("[sync-fonts] custom-fonts.css exists:", fs.existsSync(cssPath), "length:", existingCss.length);
          const declaredSrc = new Set(
            Array.from(existingCss.matchAll(/src:\s*url\s*\(\s*['"]?\/?fonts\/([^'")\s]+)['"]?\s*\)/gi), (m) => m[1].toLowerCase())
          );
          console.log("[sync-fonts] Already declared in CSS (filename):", Array.from(declaredSrc));
          const dirEntries = fs.readdirSync(fontsDir, { withFileTypes: true });
          const fontFiles = dirEntries
            .filter((e) => e.isFile() && FONT_EXTENSIONS.some((ext) => e.name.toLowerCase().endsWith(ext)))
            .map((e) => e.name);
          console.log("[sync-fonts] Font files found in folder:", fontFiles);
          const added: string[] = [];
          let newCss = existingCss.trimEnd();
          for (const file of fontFiles) {
            const key = file.toLowerCase();
            if (declaredSrc.has(key)) {
              console.log("[sync-fonts] Skip (already declared):", file);
              continue;
            }
            const fontFamily = path.basename(file, path.extname(file)).replace(/[-_\s]+/g, " ");
            const format = key.endsWith(".woff2") ? "woff2" : key.endsWith(".woff") ? "woff" : key.endsWith(".otf") ? "opentype" : "truetype";
            const block = `\n\n@font-face {\n  font-family: '${fontFamily}';\n  src: url('/fonts/${file}') format('${format}');\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}`;
            newCss += block;
            added.push(fontFamily);
            declaredSrc.add(key);
            console.log("[sync-fonts] Adding to custom-fonts.css:", file, "→ font-family:", fontFamily);
          }
          if (newCss !== existingCss) {
            if (!existingCss.trim()) {
              newCss =
                `/** Custom Font Declarations – updated by Refresh Fonts */\n` + (newCss.startsWith("@font-face") ? newCss : "\n" + newCss);
            }
            fs.writeFileSync(cssPath, newCss + "\n", "utf8");
            console.log("[sync-fonts] Wrote custom-fonts.css, added count:", added.length);
          } else {
            console.log("[sync-fonts] No changes to custom-fonts.css");
          }
          console.log("[sync-fonts] Response: ok: true, added:", added);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, added }));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("[sync-fonts] Error:", message);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: message }));
        }
      };
      // Register in a post-callback so we run after SPA fallback plugin; then unshift puts us first so /api/sync-fonts is not rewritten to index.html
      return () => {
        const stack = server.middlewares.stack;
        if (Array.isArray(stack)) {
          stack.unshift({ route: "", handle: handle as (req: unknown, res: unknown, next: () => void) => void });
        } else {
          server.middlewares.use(handle);
        }
      };
    },
  };
}

/** Dev-only: POST /__registry-save-source writes content → app-registry.ts, style → style-registry.ts, with date-stamped backups. */
function registrySaveSourcePlugin() {
  const APP_HEADER = `/**
 * App Registry – single source of truth for all user-facing text.
 * See docs/WEBSITE_TEXT_CONTENT.md for inventory.
 * No hardcoded strings in components; components receive data from here.
 */

`;
  const STYLE_MARKER = "export const STYLE_REGISTRY = ";
  function escapeStr(s: string) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
  }
  function isValidId(k: string) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k);
  }
  function serialize(val: unknown, indent = 0): string {
    const pad = "  ".repeat(indent);
    const padI = "  ".repeat(indent + 1);
    if (val === null) return "null";
    if (typeof val === "number") return String(val);
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "string") return '"' + escapeStr(val) + '"';
    if (Array.isArray(val)) {
      if (val.length === 0) return "[]";
      return "[\n" + val.map((item) => padI + serialize(item, indent + 1)).join(",\n") + "\n" + pad + "]";
    }
    if (typeof val === "object") {
      const entries = Object.entries(val);
      if (entries.length === 0) return "{}";
      const parts = entries.map(([k, v]) => padI + (isValidId(k) ? k : '"' + escapeStr(k) + '"') + ": " + serialize(v, indent + 1));
      return "{\n" + parts.join(",\n") + "\n" + pad + "}";
    }
    return "null";
  }
  function toAppRegistryTS(content: Record<string, unknown>) {
    return APP_HEADER + "export const APP_REGISTRY = " + serialize(content) + " as const;\n\nexport type AppRegistry = typeof APP_REGISTRY;\n";
  }
  function toStyleRegistryTS(style: Record<string, unknown>, fileContent: string) {
    const idx = fileContent.indexOf(STYLE_MARKER);
    if (idx === -1) throw new Error("Could not find STYLE_REGISTRY in style-registry.ts");
    const preamble = fileContent.slice(0, idx);
    return preamble + "export const STYLE_REGISTRY = " + serialize(style) + " as const;\n\nexport type StyleRegistry = typeof STYLE_REGISTRY;\n";
  }
  function getDateStamp() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function ensureBackup(projectRoot: string, dateStamp: string) {
    const configDir = path.join(projectRoot, "src", "config");
    const backupsDir = path.join(configDir, "backups");
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
    const appBackup = path.join(backupsDir, `app-registry.${dateStamp}.ts`);
    const styleBackup = path.join(backupsDir, `style-registry.${dateStamp}.ts`);
    const appPath = path.join(configDir, "app-registry.ts");
    const stylePath = path.join(configDir, "style-registry.ts");
    if (!fs.existsSync(appBackup) && fs.existsSync(appPath)) fs.copyFileSync(appPath, appBackup);
    if (!fs.existsSync(styleBackup) && fs.existsSync(stylePath)) fs.copyFileSync(stylePath, styleBackup);
  }
  function writeRegistrySource(projectRoot: string, content: Record<string, unknown>, style: Record<string, unknown>) {
    const configDir = path.join(projectRoot, "src", "config");
    const appPath = path.join(configDir, "app-registry.ts");
    const stylePath = path.join(configDir, "style-registry.ts");
    ensureBackup(projectRoot, getDateStamp());
    fs.writeFileSync(appPath, toAppRegistryTS(content), "utf8");
    const styleFileContent = fs.readFileSync(stylePath, "utf8");
    fs.writeFileSync(stylePath, toStyleRegistryTS(style, styleFileContent), "utf8");
  }
  return {
    name: "registry-save-source",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use((req: Connect.IncomingMessage, res: Connect.ServerResponse, next: () => void) => {
        if (req.method !== "POST" || req.url !== "/__registry-save-source") {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            const content = body?.content;
            const style = body?.style;
            if (!content || typeof content !== "object" || !style || typeof style !== "object") {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: false, error: "Missing or invalid content/style" }));
              return;
            }
            const projectRoot = path.resolve(__dirname);
            writeRegistrySource(projectRoot, content, style);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: message }));
          }
        });
        req.on("error", () => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Request error" }));
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  appType: "spa",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    spaFallbackPlugin(),
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && syncFontsPlugin(),
    mode === "development" && registrySaveSourcePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
