# Security Phase 1 — Discovery and Inventory Results

Completed per `docs/Security_Checklist.md`. Use this document for Phase 2 remediation decisions.

---

## 1. Secrets and Keys

### Scan results

- **No hardcoded API keys or secrets** found in `src/` or config. No `sk-`, literal Bearer tokens, or connection strings in source.
- **Supabase** (`src/lib/supabase.ts`): Uses `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`; fallback placeholder only when missing. **OK** — client anon key is intended to be public; no server secrets in app code.
- **Stripe** (`supabase/functions/create-checkout-session/index.ts`): Uses `Deno.env.get("STRIPE_SECRET_KEY")` and documents `STRIPE_PRICE_ID*` in comments. **OK** — secrets in env, not in source.
- **Checkout** (`src/lib/checkout.ts`): Uses `session?.access_token` and builds `Authorization: Bearer ${token}` at runtime. **OK** — no hardcoded token.
- **Auth** (Login/Register/ResetPassword): Passwords only in component state and passed to Supabase; not logged or stored in code. **OK.**

### .gitignore and env

- **`.gitignore`** includes `*.local` (covers `.env.local`) but **does not** explicitly list `.env` or `.env.example`. Risk: a plain `.env` with secrets could be committed.
- **Recommendation:** Add `.env` and `.env.local` (and optionally `.env.*.local`) to `.gitignore` in Phase 2.
- **`.env.example`** exists with placeholder keys only (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). **OK.**

### Summary

| Finding | Severity | Action |
|--------|-----------|--------|
| No hardcoded secrets in app or edge function | — | None |
| .gitignore missing explicit `.env` | Low | Add `.env`, `.env.local` in Phase 2 |

---

## 2. Security Headers

### How the app is served

- **Dev:** Vite dev server (`vite.config.ts`, port 8080), SPA fallback + dev-only plugins (sync-fonts, registry-save-source).
- **Production:** Static SPA (build output in `dist/`); served by host (Vercel/Netlify/other) or `vite preview`. No `vercel.json`, `netlify.toml`, or `_headers` found in repo.

### Current headers

- **None.** No CSP, HSTS, X-Frame-Options, X-Content-Type-Options, or Referrer-Policy in:
  - `vite.config.ts` (only `Content-Type: application/json` for dev API routes)
  - `index.html`
  - Any host config file in the repo

### Summary

| Finding | Severity | Action |
|--------|-----------|--------|
| No security headers (CSP, HSTS, X-Frame-Options, etc.) | High | Phase 2: add headers via host config or server |

---

## 3. Cookies

### App-set cookies

| Cookie | Where set | Secure | HttpOnly | SameSite |
|--------|-----------|--------|----------|----------|
| `sidebar:state` | `src/components/ui/sidebar.tsx` (line 68), `document.cookie` | No | No (JS-readable) | Not set |

- **Current:** `path=/; max-age=...` only. No `Secure`, `HttpOnly`, or `SameSite`.
- **Risk:** In production over HTTPS, missing `Secure` allows accidental send over HTTP; missing `SameSite` can affect CSRF. This cookie is UI state only (sidebar open/closed), not auth.

### Third-party / Supabase auth

- **Supabase Auth** sets session cookies via its client; cookie names and flags are controlled by Supabase (and optionally project settings). Not set by this repo’s code.
- **Recommendation:** Document Supabase auth cookie behavior and, if configurable, recommend Secure + HttpOnly + SameSite in Phase 2.

### Summary

| Finding | Severity | Action |
|--------|-----------|--------|
| `sidebar:state` without Secure / SameSite | Low | Phase 2: add Secure; SameSite=Lax (or Strict) when setting cookie in production |
| Supabase auth cookies | Info | Document; align with Secure/HttpOnly/SameSite if configurable |

---

## 4. Version and Debug Exposure

### Server / version headers

- No `X-Powered-By` or server version headers set in app or Vite config. Host may add them; not in repo.

### NODE_ENV / import.meta.env

- **Vite:** `import.meta.env.MODE`, `import.meta.env.DEV`, `import.meta.env.PROD` are standard; used for build/runtime mode. No sensitive or server-internal data exposed in responses.

### Console and debug logging

- **`src/lib/supabase.ts`:** `console.warn` when Supabase env vars are missing. **OK** — no secrets.
- **`src/pages/RegistryEditor.tsx`:** Multiple `console.log` / `console.warn` for font scanning (lines 243, 245, 247, 252, 255, 381, 384, 386, 391, 394, 401, 404, 406, 409). **Risk:** Only used on admin Registry Editor page; in production build these still run and can expose font paths and request details in browser console.
- **`vite.config.ts`:** Many `console.log` in `syncFontsPlugin` (dev-only). **OK** — plugin is `mode === "development" && syncFontsPlugin()`, so not in production build. Same for `registrySaveSourcePlugin`.

### Stack traces / error responses

- No custom error pages or API responses that expose stack traces. Vite dev overlay is dev-only.

### Summary

| Finding | Severity | Action |
|--------|-----------|--------|
| RegistryEditor console.log in production | Low | Phase 2: guard with `import.meta.env.DEV` or remove for production |
| Vite dev plugins logging | — | Dev-only; no change needed |
| No version/debug headers in repo | — | None; verify host does not add X-Powered-By in Phase 3 |

---

## 5. Dependencies (npm audit)

**Run:** `npm audit` (exit code 1 = vulnerabilities reported).

### Summary counts

- **10 vulnerabilities:** 3 low, 3 moderate, 4 high.
- **Fix:** `npm audit fix` for non-breaking; some high/moderate require `npm audit fix --force` (breaking).

### Per-package

| Package | Severity | Issue | Fix |
|---------|----------|--------|-----|
| **@tootallnate/once** (< 3.0.1) | — | Incorrect Control Flow Scoping (GHSA-vpq2-c234-7xj6) | Transitive (jsdom). `npm audit fix --force` → jsdom@28.1.0 (breaking). |
| **ajv** (< 6.14.0) | Moderate | ReDoS with `$data` (GHSA-2g4f-4pwh-qvx6) | `npm audit fix` |
| **esbuild** (≤ 0.24.2) | Moderate | Dev server request/response exposure (GHSA-67mh-4wv8-2f99) | Transitive (vite). `npm audit fix --force` → vite@7.3.1 (breaking). |
| **minimatch** (9.0.0–9.0.6, 10.0.0–10.2.2) | High | ReDoS (multiple GHSA) | `npm audit fix` |
| **rollup** (4.0.0–4.58.0) | High | Arbitrary File Write / Path Traversal (GHSA-mw96-cpmx-2vgc) | `npm audit fix` |
| **tar** (≤ 7.5.9) | High | Hardlink Path Traversal (GHSA-qffp-2rhf-9h96) | Transitive (supabase CLI). `npm audit fix` |

### Notes

- **jsdom / @tootallnate/once:** Likely from Vitest or similar test/tooling. Fix may upgrade jsdom (breaking).
- **vite / esbuild:** Dev-server issue; production build not necessarily affected. Upgrade path is major (vite 7).
- **supabase (CLI) / tar:** Dev dependency; fix with `npm audit fix` if available.

### Summary

| Finding | Severity | Action |
|--------|-----------|--------|
| 10 vulnerabilities (4 high, 3 moderate, 3 low) | High (for high/critical) | Phase 2: run `npm audit fix`; for remaining, decide upgrade vs accept and document |

---

## Recommendations from Phase 1 Audit

The following recommendations result from the Phase 1 inventory. Phase 2 execution addresses them.

### Secrets and keys
- **R1.** Add `.env`, `.env.local`, and `.env.*.local` to `.gitignore` so env files with secrets are never committed.
- **R2.** Keep using `.env.example` with placeholder keys only; document in README or setup docs that production secrets must be set in the host (e.g. Vercel env vars) and never committed.

### Security headers
- **R3.** Add security headers for production: **Content-Security-Policy** (start conservative; allow same origin + known CDNs if used), **Strict-Transport-Security** (HSTS), **X-Frame-Options: DENY** (or SAMEORIGIN if embedding needed), **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**.
- **R4.** Apply headers where the app is served in production: e.g. `vercel.json` (Vercel), `_headers` (Netlify), or server middleware. Document in the checklist or README so other hosts can replicate.

### Cookies
- **R5.** When setting `sidebar:state`, add **Secure** (when running over HTTPS) and **SameSite=Lax** (or Strict) so the cookie is not sent on cross-site requests and is only sent over secure connections in production.
- **R6.** Document that Supabase Auth sets its own session cookies; recommend configuring Secure, HttpOnly, and SameSite in Supabase project settings if available.

### Version and debug
- **R7.** Guard or remove verbose `console.log`/`console.warn` in RegistryEditor (font scanning) so they do not run in production builds (e.g. wrap in `import.meta.env.DEV` or remove).
- **R8.** Keep the single `console.warn` in `supabase.ts` for missing env vars; it does not expose secrets.

### Dependencies
- **R9.** Run `npm audit fix` to resolve vulnerabilities that have non-breaking fixes (e.g. ajv, minimatch, rollup, tar).
- **R10.** For issues that require `npm audit fix --force` (e.g. jsdom, vite/esbuild): evaluate impact; if dev-only or test-only, document accepted risk in FAIL_LOG or this doc; if upgrading, run tests and document.

### General
- **R11.** Add a short **Security** or **Environment variables** section to the README describing where secrets live (env, host config) and that `.env` must not be committed.
- **R12.** In Phase 3, re-run the secrets scan and `npm audit` after remediation and verify headers/cookies in a production-like build.

---

## Phase 1 Checklist Status

- [x] 1. Secrets and keys — scanned; .gitignore gap noted.
- [x] 2. Security headers — none present; hosting model noted.
- [x] 3. Cookies — sidebar cookie and Supabase auth noted.
- [x] 4. Version and debug — console usage and dev-only plugins documented.
- [x] 5. Dependencies — `npm audit` run; 10 vulnerabilities listed.

**Next:** Phase 2 remediation (see `docs/Security_Checklist.md`). Log failures in `workflow/FAIL_LOG.md` and changes in `workflow/ChangeLog.md`.

---

## Phase 2 — Remediation Applied (post-execution)

- **Secrets:** `.gitignore` updated with `.env`, `.env.local`, `.env.*.local`. README section "Environment variables and security" added.
- **Security headers:** `vercel.json` created with X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, CSP. Applies when deployed on Vercel; other hosts need equivalent config.
- **Cookies:** `src/components/ui/sidebar.tsx` — `sidebar:state` now sets `SameSite=Lax` and `Secure` when `location.protocol === "https:"`.
- **Version/Debug:** `src/pages/RegistryEditor.tsx` — font-scanning logs use `devLog`/`devWarn` (only run when `import.meta.env.DEV`).
- **Dependencies:** `npm audit fix --legacy-peer-deps` run. Fixed: ajv, minimatch, rollup, tar (and related). **Remaining 5 vulnerabilities** (3 low, 2 moderate): jsdom/@tootallnate/once (fix requires breaking jsdom upgrade), vite/esbuild (dev-server issue; fix requires vite 7). Accepted as documented risk: dev/test tooling only; production bundle not affected by esbuild dev-server CVE; jsdom is test-only.

---

## Phase 3 — Verification (Executed)

### 11. Re-scan and Test

- **Secrets re-scan:** No hardcoded API keys, tokens, or secrets in `src/`. Only `import.meta.env.VITE_SUPABASE_*` usage (intended). `.gitignore` confirms `.env`, `.env.local`, `.env.*.local` are ignored.
- **Dependency audit:** `npm audit` re-run. **5 vulnerabilities** unchanged (jsdom/@tootallnate/once, vite/esbuild); all documented as accepted risk. No new vulns introduced.
- **Response headers:** `vercel.json` is present with X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, Content-Security-Policy. These apply when the app is deployed to **Vercel**. Local `vite preview` does not send these headers (Vite preview does not read vercel.json); verified via request to http://localhost:4173/ — only standard Vite headers (Content-Type, Cache-Control, etc.). **Production (Vercel) deploy will serve the security headers** per vercel.json.
- **Cookies:** Code verified: `src/components/ui/sidebar.tsx` sets `sidebar:state` with `SameSite=Lax` and `Secure` when `window.location.protocol === "https:"`. Manual check in DevTools on a production HTTPS deploy: confirm cookie shows Secure and SameSite=Lax.
- **Version/debug leak:** Production build (`npm run build`) completes successfully. RegistryEditor font-scanning uses `devLog`/`devWarn` (run only when `import.meta.env.DEV`), so no font-scan logs in production. Remaining `console.error` in RegistryEditor are for user-facing errors (preview/save/import failures); they do not expose version or server internals.

### 12. Logs

- **FAIL_LOG:** No new entries required (no failed fixes in Phase 3).
- **ChangeLog:** Phase 3 verification entry added.

### Phase 3 Checklist Status

- [x] 11. Re-scan and test — secrets scan, npm audit, headers (preview vs Vercel), cookies (code + manual note), no version/debug leak (build + dev guards).
- [x] 12. Logs — ChangeLog updated; FAIL_LOG N/A.

---

## Perimeter Hardening (post-scan remediation)

Addresses scan findings: **Missing recommended security headers**, **CSP overly permissive**, **External assets without SRI**.

### 1. Missing recommended security headers — FIXED

- **Finding:** Public response missing one or more important browser hardening headers.
- **Fix:** In `vercel.json` added:
  - **Permissions-Policy:** `camera=(), microphone=(), geolocation=(), interest-cohort=()` to restrict browser features and FLoC.
  - **X-DNS-Prefetch-Control:** `off` to avoid unintended DNS prefetch leakage.
- **Verification:** After deploy, run: `curl -sI https://<your-domain>/ | grep -iE 'Permissions-Policy|X-DNS-Prefetch-Control'`. Expect both headers present.

### 2. Content-Security-Policy overly permissive — REDUCED

- **Finding:** CSP included permissive directives `'unsafe-inline'` or `'unsafe-eval'`.
- **Fix:**
  - **Removed `'unsafe-eval'`** from `script-src`. Production build does not require it; verified with `npm run build`.
  - **Retained `'unsafe-inline'`** for `script-src` and `style-src` because Vite’s production bootstrap and many React/Tailwind setups rely on inline scripts/styles unless nonces or hashes are added. Tightening further would require a nonce-based CSP (e.g. via plugin) and is left as a future improvement.
- **Residual risk (documented):** `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'` remain. This is a known trade-off for Vite/React without nonce support. Future scans will remain deterministic: same CSP string until nonce/hash implementation.

### 3. External assets without Subresource Integrity — FIXED

- **Finding:** At least one third-party script or stylesheet missing an SRI hash (supply-chain tampering risk).
- **Root cause:** `src/index.css` loaded Google Fonts via `@import url('https://fonts.googleapis.com/...')`, i.e. external CSS (and indirectly woff2 from fonts.gstatic.com). SRI for that URL is impractical (Google can change the response).
- **Fix:** Removed external font request. Fonts are now **self-hosted** via npm packages `@fontsource/playfair-display` and `@fontsource/dm-sans`. Same families and weights (Playfair 400/600/700 + italic 400/600; DM Sans 300/400/500/600/700 + italic 400). Font files are bundled and served same-origin; no third-party CSS or font URLs, so SRI is not required for these assets.
- **Verification:** Build outputs font assets under `dist/assets/*.woff2` (and .woff). No request to `fonts.googleapis.com` or `fonts.gstatic.com` in production. Re-scan should report no external script/stylesheet without SRI for this app origin.

### Evidence-driven verification (for future scans)

- **Headers:** Exact header list and values are in `vercel.json`. Scan the production origin; expectations are documented above.
- **CSP:** Single policy in `vercel.json`; no `'unsafe-eval'`; `'unsafe-inline'` retained and justified in this section.
- **SRI:** No external scripts or stylesheets; fonts are first-party. If new external resources are added later, add `integrity=` and `crossorigin="anonymous"` or self-host and document here.
