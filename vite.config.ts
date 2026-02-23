import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import history from "connect-history-api-fallback";
import { componentTagger } from "lovable-tagger";

/** SPA fallback: serve index.html for routes like /admin/registry-editor so client-side routing works. */
function spaFallbackPlugin() {
  return {
    name: "spa-fallback",
    configureServer(server: { middlewares: { stack: Array<{ route: string; handle: (req: unknown, res: unknown, next: () => void) => void }> } }) {
      return () => {
        const stack = server.middlewares.stack;
        if (Array.isArray(stack)) {
          stack.unshift({
            route: "",
            handle: history({
              index: "/",
              // Don't rewrite Vite internals (@vite/client, @react-refresh, @id/..., etc.)
              rewrites: [{ from: /^\/@/, to: (ctx: { parsedUrl: { pathname: string } }) => ctx.parsedUrl.pathname }],
            }),
          });
        }
      };
    },
  };
}

/** Dev-only: POST /__registry-save writes body to public/registry.json (Registry Editor Save). */
function registrySavePlugin() {
  return {
    name: "registry-save",
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || req.url !== "/__registry-save") return next();
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", () => {
          try {
            const body = Buffer.concat(chunks).toString("utf8");
            const outPath = path.resolve(process.cwd(), "public", "registry.json");
            const dir = path.dirname(outPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(outPath, body, "utf8");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            console.error("[registry-save]", e);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          }
        });
        req.on("error", () => next());
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    mode === "development" && registrySavePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
