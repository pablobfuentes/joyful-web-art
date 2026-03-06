# Change Log

## [Unreleased] — Security Phase 3 verification

### Rationale
- Execute Phase 3 of the security checklist: re-scan and test after Phase 2 remediation; update logs.

### Changes
- **Secrets re-scan:** No hardcoded secrets in `src/`; only env-based VITE_SUPABASE_*; `.gitignore` confirms `.env`, `.env.local`, `.env.*.local`.
- **Dependency audit:** `npm audit` re-run; 5 vulnerabilities unchanged (documented accepted risk); no new vulns.
- **Headers:** `vercel.json` confirmed; local `vite preview` does not send these (expected); they apply on Vercel deploy.
- **Cookies:** Code verified (sidebar SameSite=Lax, Secure on HTTPS); manual check on live HTTPS recommended.
- **Version/debug:** Production build succeeds; RegistryEditor font logs guarded by devLog/devWarn (DEV-only).
- **`docs/Security_Phase1_Results.md`:** Added "Phase 3 — Verification (Executed)" with task 11–12 results and checklist status.
- **`docs/Security_Checklist.md`:** Phase 3 section marked executed; tasks 11–12 checkboxes and summary reference added.

### Verification
- Phase 3 tasks 11–12 completed. No FAIL_LOG entries. Security checklist Phases 1–3 complete.

---

## [Unreleased] — Security Phase 2 remediation

### Rationale
- Execute Phase 2 of the security checklist: apply remediations for secrets, headers, cookies, version/debug exposure, and dependencies per Phase 1 findings.

### Changes
- **`.gitignore`:** Added `.env`, `.env.local`, `.env.*.local` so env files with secrets are never committed.
- **`README.md`:** New section "Environment variables and security" (no committing secrets; use `.env.local` and host env; reference to security docs).
- **`vercel.json`:** Created. Security headers for all routes: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Strict-Transport-Security, Content-Security-Policy (self + Supabase connect/font/img). Documented as applying on Vercel; other hosts need equivalent config.
- **`src/components/ui/sidebar.tsx`:** When setting `sidebar:state` cookie, added `SameSite=Lax` and `Secure` when `window.location.protocol === "https:"`.
- **`src/pages/RegistryEditor.tsx`:** Added `devLog`/`devWarn` (run only when `import.meta.env.DEV`); replaced font-scanning `console.log`/`console.warn`/`console.error` in `scanAvailableFonts` and `handleRefreshFonts` with these helpers.
- **Dependencies:** Ran `npm audit fix --legacy-peer-deps` (fixes applied; 5 vulns remain—jsdom, vite/esbuild—documented as accepted risk for dev/test only).
- **`docs/Security_Phase1_Results.md`:** Added "Phase 2 — Remediation Applied" section describing all changes and remaining vulns.
- **`docs/Security_Checklist.md`:** Phase 2 heading set to "Remediation (Executed)"; tasks 6–10 updated with checkboxes and summary reference to Phase 1 results doc.

### Verification
- Build and tests: `npm run build` and test run (as applicable). Remaining 5 vulnerabilities documented in `Security_Phase1_Results.md`; production bundle not affected by dev-server CVE.

---

## [Unreleased] — Security checklist and Phase 1 discovery

### Rationale
- User requested security testing (secrets, headers, cookies, version/debug exposure, dependencies) and to follow workflow Prompt.md. Plan written as checklist; Phase 1 (discovery) executed.

### Changes
- **`docs/Security_Checklist.md`:** Created. Full security plan: Phase 1 (discovery), Phase 2 (remediation design), Phase 3 (verification and logs). Skills, risks, assumptions, improvements, things to consider.
- **`docs/Security_Phase1_Results.md`:** Created. Phase 1 inventory: (1) No hardcoded secrets; .gitignore missing explicit `.env`. (2) No security headers; app served by Vite dev/preview or host. (3) Cookie `sidebar:state` in `src/components/ui/sidebar.tsx` without Secure/SameSite; Supabase auth cookies documented. (4) RegistryEditor and supabase.ts console logging; vite.config dev-only logging. (5) `npm audit`: 10 vulnerabilities (4 high, 3 moderate, 3 low)—ajv, esbuild/vite, minimatch, rollup, tar/supabase, @tootallnate/once/jsdom—with fix options.
- **`docs/Security_Checklist.md`:** Phase 1 checklist items marked complete; results reference added.

### Verification
- Phase 1 tasks 1–5 completed; findings documented in `Security_Phase1_Results.md`. No code or config changed (discovery only). Phase 2 remediation executed and documented above.

---

## [Unreleased] — Registry/Editor parity and documentation

### Rationale
- User requested that every variable be present in the Registry Editor and in `app-registry.ts` / `style-registry.ts`, and that everything be documented according to workflow documents.

### Changes
- **Style registry (`src/config/style-registry.ts`):**
  - `compatibilityTest.questionCard` and `compatibilityTest.resultCard` added (backgroundIndex each) so the Compatibility Test panel colors are editable in Registry Editor and defined in the registry.
- **Documentation:**
  - **`docs/WEBSITE_TEXT_CONTENT.md`:** Regenerated as a full path inventory for all user-facing text. Every top-level section in `app-registry.ts` is listed with every registry path (string leaf). Notes added: single source of truth, Registry Editor usage, list normalization.
  - **`docs/STYLE_VARIABLES_INVENTORY.md`:** Updated last-updated date; added explicit note that every variable is editable in Registry Editor. Documented `compatibilityTest.questionCard` and `compatibilityTest.resultCard`. Added “Registry Editor coverage” section listing content vs style and section keys.
- **Registry Editor:** No code change. Content is discovered from `APP_REGISTRY` via `getContentEntries()`; style controls already cover all sections. `SECTION_DISPLAY_NAMES` already includes every app-registry section (nav, hero, why, … checkout, account).

### Verification
- All app-registry top-level keys (nav, hero, why, compatibilityTest, howItWorks, whatYouReceive, pastEditions, experience, testimonials, pricing, faq, finalCta, footer, login, register, forgotPassword, resetPassword, dashboard, checkout, account) are present in Registry Editor and in `WEBSITE_TEXT_CONTENT.md`.
- All style-registry section keys are present in Registry Editor; compatibilityTest now has question/result panel controls.

---

## [Unreleased] — Past Editions carousel: placeholder pictures and registry image URLs

### Rationale
- User requested pictures on the Past Editions carousel, with image URLs in the registry and editable in RegistryEditor.
- The carousel previously showed only text (category, name, month) on colored cards.

### Changes
- **App registry (`src/config/app-registry.ts`):**
  - `pastEditions.fallbackImage`: added (URL used when an edition has no image or load fails).
  - Each `pastEditions.editions[i]` now has an `image` field with a placeholder URL (picsum.photos seed per edition).
- **Past Editions component (`src/components/PastEditionsSection.tsx`):**
  - Each card renders an `<img>` with `src` from `edition.image` or `data.fallbackImage`; `onError` switches to `fallbackImage`.
  - Image fills the card (absolute, object-cover); active card is full color + scale, inactive cards are grayscale.
- **Tests:** New test "renders one image per edition card" in `PastEditionsSection.test.tsx`.
- **RegistryEditor:** No code change; `getContentEntries` already exposes all section content, so `pastEditions.fallbackImage` and `pastEditions.editions[i].image` appear as Content rows for Past Editions.

### Verification
- `npm test -- PastEditionsSection.test.tsx` passes (3 tests). In Registry Editor → Past Editions → Content, `fallbackImage` and each edition’s `image` are editable; Save and reload to see updated carousel images.

## [Unreleased] — Registry list normalization (no content changes)

### Rationale
- Registry and localStorage can provide list data as either arrays or objects with numeric keys. Components that call `.map()` on these values throw when the value is an object. Using `Object.values()` without key ordering can display items in the wrong order (e.g. first slot showing second item), which was reported as "missing" cards.
- Fix: normalize to an array in **numeric index order** (0,1,2,...) in the UI layer only. No changes to app-registry content or to any variable values.

### Files touched
- `src/lib/utils.ts` — add `registryListToArray<T>(value)` (array or object with numeric keys → array in index order).
- `src/components/ProblemSection.tsx` — `cards = registryListToArray(data.cards)`.
- `src/components/HowItWorksSection.tsx` — `steps = registryListToArray(data.steps)`; key `step?.label ?? step-${index}`; StepCard type allows optional `label`.
- `src/components/ExperienceSection.tsx` — `registryListToArray(data.steps).map(...)`; key `step?.number ?? index`.
- `src/components/TestimonialsSection.tsx` — `registryListToArray(data.items).map(...)`; key `item?.author ?? index`.
- `src/components/WhatYouReceiveSection.tsx` — `registryListToArray(data.products).map(...)`; key `product?.number ?? index`.
- `src/components/FAQSection.tsx` — `registryListToArray(data.items).map(...)`.
- `src/components/PastEditionsSection.tsx` — `registryListToArray(data.editions).map(...)`; key `edition?.name ?? index`.
- `src/components/CompatibilityTestSection.tsx` — `questions = registryListToArray(data.questions)`; use `questions` for length, indexing, reset, progress.
- `src/components/PricingSection.tsx` — `registryListToArray(data.plans).map(...)`; key `plan?.id ?? index`; `registryListToArray(plan.features).map(...)` for features.

### Verification
- With app-registry as-is (e.g. why.cards object with "1","2"; howItWorks.steps object with "0","1"): page must render without error and show those cards/steps in order (card at index 0 = key "0" if present, else key "1" first, etc.).
- With localStorage overrides that store lists as objects: same behavior, correct order.
- No edits to `src/config/app-registry.ts` or to any copy/text.

## [Unreleased] — Orbit testimonials & Past Editions registry coverage

### Rationale
- User requested that **all variables** (text, images, colors) used by the Testimonials and Past Editions sections be fully editable via `RegistryEditor` and defined in `app-registry.ts` / `style-registry.ts`.
- Recent UI updates introduced:
  - A **testimonial orbit carousel** with scientist avatars.
  - A **Past Editions expanding carousel** with center-focused edition cards.
- Some literals (emoji prefixes, fallback avatar URL, generic card backgrounds) still lived directly in components instead of the registries, and section-specific card colors in `style-registry.ts` were not yet consumed by the components.

### Changes
- **App registry (`src/config/app-registry.ts`):**
  - `pastEditions.subtitleEmoji`: added so the header chip emoji (`📚`) is registry-driven.
  - `testimonials.subtitleEmoji`: added so the subtitle prefix star (`⭐`) is registry-driven.
  - `testimonials.fallbackAvatar`: added so the orbit carousel’s fallback avatar URL is configurable.
  - `testimonials.people[*].quote`: added a `quote` field for each scientist so the central card shows a registry-driven quote instead of hardcoded contact info.
- **Past Editions component (`src/components/PastEditionsSection.tsx`):**
  - Uses `data.subtitleEmoji` from the registry instead of a hardcoded `📚`.
  - Imports `useStyleRegistry()` and uses `registry.pastEditions.cards` length to map each edition card to the corresponding CSS variable `--pastEditions-card-{i}-bg` (set by `apply-style-registry.ts`), making card fill colors fully controlled by `STYLE_REGISTRY.pastEditions.cards` and editable from `RegistryEditor`.
- **Testimonials component (`src/components/TestimonialsSection.tsx`):**
  - Uses `data.subtitleEmoji` from the registry instead of a hardcoded `⭐`.
  - Reads `data.fallbackAvatar` and passes it to a factory `makeSafeImage()` so fallback image behavior is registry-driven.
  - Imports `useStyleRegistry()` and uses `registry.testimonials.cards` length to choose a card background index based on `activeIndex`, applying `backgroundColor: hsl(var(--testimonials-card-{i}-bg))` to the central card so testimonial backgrounds are driven by `STYLE_REGISTRY.testimonials.cards`.

### Verification
- Tests:
  - `npm test -- HeroSection.test.tsx PastEditionsSection.test.tsx TestimonialsSection.test.tsx`
  - All 6 tests pass (no regressions in hero guardrails; Past Editions and Testimonials carousel tests still green).
- Visual:
  - **Testimonials:** Subtitle line shows configured emoji + text; orbiting avatars still animate; central card shows registry quotes and uses per-section card colors; fallback avatar comes from the new registry key.
  - **Past Editions:** Subtitle chip shows emoji from registry; edition cards use per-card background colors defined in `STYLE_REGISTRY.pastEditions.cards` and exposed in `RegistryEditor`.
