# Security Checklist

Security testing and hardening plan for the project. Execute in order; log failures in `workflow/FAIL_LOG.md` and changes in `workflow/ChangeLog.md`.

## Skill(s) to Use

- **cc-skill-security-review** â€” secrets, headers, cookies, secure patterns
- **security-scanning-security-dependencies** â€” dependency vulnerabilities
- **vulnerability-scanner** â€” OWASP, supply chain, risk prioritization (as needed)

---

## Phase 1 â€” Discovery and Inventory

**Results:** See **`docs/Security_Phase1_Results.md`** for full inventory. Phase 1 complete.

### 1. Secrets and Keys

- [x] Scan repo (`src`, config files, `vite.config`, env examples) for: API keys, tokens, passwords, connection strings, `sk-`, `Bearer`, `secret`, `password`, `api_key`, `apikey`, base64-looking strings.
- [x] Confirm `.env*` usage and that no real secrets are committed; verify `.gitignore` includes `.env`, `.env.local`, `.env.*.local`.
- [x] List any finding (file, line, type) for remediation or confirmation as false positive.

### 2. Security Headers

- [x] Identify how the app is served (Vite dev, preview, production server, or hosting: Vercel/Netlify/other).
- [x] Check for any existing security headers (e.g. in `vite.config`, server middleware, `vercel.json`, `_headers`, or host config).
- [x] Document current state: which headers (if any) are set and where.

### 3. Cookies

- [x] Search for cookie usage: `document.cookie`, `setCookie`, `Cookies.`, auth/session libraries (e.g. Supabase, Firebase, custom).
- [x] List each cookieâ€™s name, where itâ€™s set, and whether `Secure`, `HttpOnly`, and `SameSite` are configured.

### 4. Version and Debug Exposure

- [x] Search for `X-Powered-By`, server version headers, `NODE_ENV`/`import.meta.env` usage, debug flags, stack traces in error responses, and any `console.log`/`console.debug` of sensitive or server info.
- [x] Note where build/runtime mode is used and whether debug/error details are shown in production.

### 5. Dependencies

- [x] Run `npm audit` (and, if available, `pnpm audit` / `yarn audit`) and capture full output.
- [x] List packages with known vulnerabilities (name, severity, issue, fix range).
- [x] Check for outdated major/minor versions that might have security fixes.

---

## Phase 2 â€” Remediation (Executed)

**Summary:** See `docs/Security_Phase1_Results.md` Â§ "Phase 2 â€” Remediation Applied".

### 6. Secrets

- [x] `.env`, `.env.local`, `.env.*.local` added to `.gitignore`.
- [x] `.env.example` already present with placeholder keys only.
- [x] README section "Environment variables and security" added.

### 7. Security Headers

- [x] `vercel.json` created with: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Strict-Transport-Security, Content-Security-Policy (self + Supabase). Applies on Vercel deploy; other hosts need equivalent config.

### 8. Cookies

- [x] `sidebar:state` in `src/components/ui/sidebar.tsx`: added `SameSite=Lax` and `Secure` when on HTTPS.
- [x] Supabase auth cookies: documented in Phase 1 results; configure in Supabase project if available.

### 9. Version/Debug

- [x] RegistryEditor font-scanning logs guarded with `devLog`/`devWarn` (run only when `import.meta.env.DEV`).


### 10. Dependencies

- [x] `npm audit fix --legacy-peer-deps` run; fixed ajv, minimatch, rollup, tar (and related). Remaining 5 (jsdom, vite/esbuild) documented as accepted risk (dev/test only).

---

## Phase 3 — â€” Verification and Logs (Executed)

**Summary:** See `docs/Security_Phase1_Results.md` § "Phase 3 — Verification (Executed)".

### 11. Re-scan and Test

- [x] Re-run secrets scan and dependency audit after changes.
- [x] Check response headers: vercel.json confirmed; preview does not send them (expected); production headers apply on Vercel deploy.
- [x] Cookies: code verified (SameSite=Lax, Secure on HTTPS); manual DevTools check recommended on live HTTPS deploy.
- [x] No version/debug leak in production build; devLog/devWarn guard RegistryEditor font logs.

### 12. Logs

- [x] **FAIL_LOG:** No new entries (no failed fixes in Phase 3).
- [x] **ChangeLog:** Phase 3 verification entry added.

---

## Risks

- **CSP**: Too strict can break inline scripts, styles, or third-party embeds; may require nonce or hash.
- **HSTS**: Once enabled, the host must serve HTTPS for the max-age period.
- **Cookie changes**: HttpOnly/SameSite can break client-side auth or cross-site flows if not aligned with auth design.
- **Dependency upgrades**: May introduce breaking changes or new bugs; needs regression checks.
- **Env-based secrets**: Build-time `VITE_*` are visible in client bundle; only non-sensitive config should use `VITE_*`.

---

## Assumptions

- The app is primarily client-side (Vite/React); any backend or server is separate or minimal (e.g. Vite preview / host server).
- Production is served over HTTPS (required for HSTS and Secure cookies).
- No backend API in this repo holds secrets; if it does, they are out of scope or we only document and hand off.
- Approval to add/change config files (e.g. `vercel.json`, `_headers`, server config) and dependency versions.

---

## Potential Improvements

- Add a minimal security section to README (how secrets and env are handled, where headers are set).
- Add `npm run audit` (or equivalent) to CI if not already present.
- Consider CSP report-only first, then enforce.
- Add `.env.example` and document required variables.

---

## Things to Consider

- Supabase/Firebase (or other) auth: their cookies may be set by their SDK; document and, if possible, align with Secure/HttpOnly/SameSite.
- Vite: dev server vs. production build vs. preview; headers may need to be set in different places (e.g. only in production server or host).
- Registry Editor or admin routes: ensure they are protected and not leaking debug info.
- Any server-side save (e.g. registry save endpoint): ensure itâ€™s dev-only or properly authenticated and not exposing internals.
