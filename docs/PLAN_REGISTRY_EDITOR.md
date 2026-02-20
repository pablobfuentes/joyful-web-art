# Proposed Plan: RegistryEditor Admin Page

**Date:** 2026-02-18  
**Updated:** 2026-02-18 (per user comments)  
**Source:** workflow/Prompt.md (strict adherence)  
**Scope:** RegistryEditor page for admin users to edit all style and text variables with tabs, previews, General (palette, fonts), and full sync with app-registry.

**Decisions:** Admin = Supabase role. Persistence = **localStorage** for now. Color palette = **position-based** (no semantic tokens). Wave divider = **owned by section above**. Failsafe = see §7.

---

## 1. Ordered checklist (tasks in sequence)

### Phase 1 – Registry & style inventory

- [x] **1.1** Audit all stylized elements across the app: list every component that uses colors, fonts, sizes, borders, radii, shadows, gradients, section backgrounds, divider props, images (path/size/border), and button styles. Produce `docs/STYLE_VARIABLES_INVENTORY.md` mapping each to a proposed registry path.
- [x] **1.2** Design the **app-registry style schema**: add a `styles` (or `theme`) top-level key alongside existing content keys. Structure: `general` (palette, fonts, radius/shadow defaults) + one key per section/page (e.g. `nav`, `hero`, `why`, `howItWorks`, `pricing`, `footer`, `login`, `register`, etc.) with nested entries per element (e.g. `hero.heading`, `hero.primaryButton`, `hero.image`). Every variable must be identified and placed in the registry with defaults matching current `index.css` and Tailwind.
- [x] **1.3** Define **General** tab data: **color palette as a position-based matrix** — no semantic token names (e.g. not "background" or "primary"). Each slot is identified only by its **index/position** in the matrix (e.g. row/col or flat index). Same color can be used as background or font elsewhere; naming is for display only (editable label in UI). Schema: e.g. `palette: { rows, cols, cells: { index: { hex, name?, comment? } } }` or 2D array. Font families and modifiers (display, body, weights, italic); global radius, shadow set, gradient presets. Document in the same schema.
- [x] **1.4** Define **section-owned divider** model: the divider below a section is **parented by that section**. Each section has a `divider` block: style (e.g. `wavy` | `sawtooth` | `straight` — map to current wave1/wave2/blob/zigzag or simplified set) and properties (e.g. topColor index, bottomColor index, amplitude/height if we support it). No global WaveDivider config; each section (hero, why, howItWorks, …) declares its own divider. Index.tsx passes section’s divider config into WaveDivider.
- [x] **1.5** Define **image** style model: asset path (or URL), size (width/height or aspect), border (width, color index, radius). Hero and any other images included.
- [x] **1.6** Implement **default style registry** in `app-registry.ts`: add `STYLE_REGISTRY` (or merge into `APP_REGISTRY.styles`) with defaults derived from current `index.css` and component usage. Keep TypeScript types (`AppRegistry` / `StyleRegistry`) for safety. _Done in `src/config/style-registry.ts`._

### Phase 2 – Runtime: registry → UI

- [x] **2.1** Add a **runtime bridge** from registry to DOM: either (a) inject CSS variables from `STYLE_REGISTRY` into `document.documentElement` (so existing Tailwind/utility classes keep working), or (b) provide a React context that exposes resolved style values and components read from it. Prefer (a) for minimal component changes where possible.
- [x] **2.2** Ensure **fonts** from registry: General tab will store font family names and optional import URLs; app loads them (e.g. link tag or @import) and sets `--font-display`, `--font-body` or equivalent so Tailwind `font-display` / `font-body` resolve correctly.
- [x] **2.3** Refactor **one pilot section** (e.g. Hero) to consume style values from registry (or from CSS vars set from registry). Confirm visual parity before rolling out.
- [x] **2.4** Roll out registry-driven styles to **all sections** and shared components (Navbar, WaveDivider, buttons, cards, etc.). Remove hardcoded Tailwind color/radius classes where they should be driven by registry (replace with registry-backed utility or inline style from context).
- [x] **2.5** Ensure **section-owned dividers** and **images** (e.g. hero image) read from registry: each section’s `divider` config (style, colors by palette index) drives the WaveDivider below it; image path, size, border from registry.

### Phase 3 – RegistryEditor UI

- [x] **3.1** Add **RegistryEditor** page route (e.g. `/admin/registry-editor`). Protect by **Supabase role**: only users with admin role can access; reject others (redirect or 403). Document how admin role is set (e.g. `profiles.role` or Supabase custom claim).
- [x] **3.2** Build **General** tab — **color palette as a matrix of squares**:
  - **Matrix**: grid of cells, each cell large enough for readable text inside. Per cell display: **color name** (editable via modal), **hex color**, **comment** (editable via modal).
  - **Click a cell** → open **modal**. Left side: **full color picker** (hex/hsl). Right side: **notes** field (the comment shown in the square) and a **pool of tags** listing which elements use that color (e.g. “Hero background”, “Nav hover”, “Button primary”). Tags are derived from STYLE_VARIABLES_INVENTORY / registry (each style entry that references this palette index gets a tag). Name and comment editable in this modal.
  - Also in General tab: font import URL(s) and family names + display/body modifiers; global radius, shadow/gradient presets. Live preview “style tile” (heading, body, button, card) using palette and fonts.
- [x] **3.3** Build **section/page tabs**: one tab per major section (Nav, Hero, Why, Compatibility Test, How It Works, What You Receive, Past Editions, Experience, Testimonials, Pricing, FAQ, Final CTA, Footer) plus pages (Login, Register, Forgot/Reset Password, Dashboard, Checkout). Each tab lists the section’s style and text variables with:
  - **Preview**: small iframe or isolated preview of that section (or a representative element) that updates as the user edits.
  - **Controls**: inputs per variable (text inputs for copy; number/select/color for style). Every stylized element must be editable (text size, color as palette index, font family; button fill, border, roundness; section background; **section’s divider**: style wavy/sawtooth/straight + properties; image path, size, border; etc.).
  - **Text variables**: All user-facing text from **APP_REGISTRY** is editable per tab via **Content** controls (headings, labels, CTAs, links, descriptions, etc.).
- [ ] **3.4** Implement **two-way sync**: editor reads from app-registry (or from a “live” store that initializes from registry); on change, update the in-memory store and persist to **localStorage** (see 4.1). Apply changes to the same runtime bridge used in Phase 2 so the rest of the app sees updates immediately (transparent integration).
- [ ] **3.5** Add **Save / Reset**: “Save” persists current editor state to **localStorage**; “Reset” restores last saved or default registry. Optional “Export / Import” JSON for backup and restore.

### Phase 4 – Persistence & wiring

- [x] **4.1** **Persistence = localStorage** (for now). Keys: `app_registry_style_overrides` (style), `app_registry_content_overrides` (text). RegistryEditor reads on mount and writes on **Save**; **Reset** restores defaults and clears stored overrides.
- [ ] **4.2** On app bootstrap: load saved overrides from localStorage (if any), merge with default registry, then apply to CSS vars (and any context). RegistryEditor reads and writes the same merged source. _Note:_ Main app still reads APP_REGISTRY directly; wiring a context to provide merged content so the site reflects saved text is pending.
- [x] **4.3** Ensure **text variables** remain editable in the same editor (existing APP_REGISTRY content). Either extend current registry with content in the same UI (tabs by section with text + style together) or keep content in app-registry and only add style tabs; requirement is “all style and text variables” so both must be editable in one place.

### Phase 5 – Testing & docs

- [ ] **5.1** **Visual + functional parity**: Before/after screenshots or Percy-style checks at key breakpoints (mobile, tablet, desktop). Confirm no regressions after registry-driven refactor.
- [ ] **5.2** **Responsive**: Test RegistryEditor and previews at multiple dimensions; ensure tabs and preview iframe behave correctly.
- [ ] **5.3** **Critical path**: Edit a color, font, button style, and divider in RegistryEditor → Save → reload main site → confirm changes persist and render correctly.
- [ ] **5.4** Update **FAIL_LOG** (or create `docs/FAIL_LOG.md` if missing) for any failure during implementation; update **CHANGELOG_AI.md** for every approved change with files touched and verification.
- [ ] **5.5** **Failsafe workflow**: Document in repo (e.g. CONTRIBUTING or docs) the registry-first rule: new variables go into app-registry and STYLE_VARIABLES_INVENTORY first; removed features get registry entries removed. Optionally add a small audit script (list registry keys vs code references) and run in CI or pre-commit; can be a follow-up task.

---

## 2. Risks

- **Registry size and complexity**: One big registry (content + styles) can become hard to maintain. Mitigation: strict schema, TypeScript types, and a single STYLE_VARIABLES_INVENTORY.md as source of truth.
- **Tailwind vs runtime CSS vars**: Tailwind classes are compile-time. If we drive everything from runtime CSS vars, we must ensure palette indices map to injected vars or components resolve palette[index] at runtime; no conflicting hardcoded Tailwind color names that bypass registry.
- **Admin access**: Restrict RegistryEditor to **Supabase role** (e.g. `profiles.role = 'admin'`); others get redirect or 403.
- **Preview accuracy**: In-editor preview might differ from production (fonts, viewport, data). Mitigation: use same theme context/CSS as main app and document limitations.

---

## 3. Assumptions

- **Admin** = Supabase role (e.g. stored in `profiles.role` or equivalent); no new auth system beyond role check.
- **Persistence** = **localStorage** for now; no backend theme table in this phase.
- **Existing app-registry** remains the single source of truth for text; we extend it (or add a sibling `STYLE_REGISTRY`) for styles so one editor can edit both.
- **Colors** are referenced by **palette position** (index) in the registry; display names are labels only and do not imply usage (same color can be background or font).
- **No removal of Tailwind**: we keep Tailwind; we feed it via CSS variables or runtime resolution from registry (e.g. palette index → hex → CSS var or inline style).
- **Font “import”** in General tab means URL (e.g. Google Fonts link or self-hosted) + family name; app injects link or @import and sets CSS var for font-family.

---

## 4. Potential improvements (all endorsed)

- **Undo/redo** in the editor.
- **Version history** for theme (e.g. last N saved states in localStorage or future Supabase).
- **A/B or per-tenant themes** later (same schema, different rows or files).
- **Validation** in editor: color contrast (a11y), font load check.
- **Export theme as JSON** for version control or backup.

---

## 5. Things to consider

- **Performance**: Injecting many CSS vars on every change might cause reflows; debounce or batch updates in the editor.
- **TypeScript**: Keep `AppRegistry` and style schema strictly typed so editor and app never drift.
- **Divider variants**: Map wavy/sawtooth/straight to existing SVG path variants (wave1, wave2, blob, zigzag) or simplify; section-owned divider config drives which variant and colors (by palette index).
- **Images**: Hero image is currently an imported asset. Registry can store path (e.g. `/hero-skincare.jpg` or URL); consider upload in admin or URL-only for MVP.
- **i18n**: If the site later supports multiple languages, text in registry may become per-locale; style registry can stay global.
- **VMP / workflow**: Maintain FAIL_LOG and CHANGELOG_AI per workflow/Prompt.md; run tests (including visual/responsive) before marking tasks done.

---

## 6. Failsafe: Keeping RegistryEditor and app-registry in sync

As features are added or removed, the registry and the editor must stay aligned with the actual variables used on the page. The following keeps drift to a minimum:

- **6.1 Single source of truth**: All user-facing text and all style values (colors by palette index, fonts, radii, etc.) **must** live in the app-registry (or STYLE_REGISTRY). Components **must not** hardcode copy or style tokens; they only read from the registry (or from CSS vars / context fed from the registry). Adding a variable = add to registry + use in component; removing a feature = remove usage then remove from registry. This makes “registry is the contract” enforceable.
- **6.2 TypeScript and schema**: The registry is fully typed (`AppRegistry`, `StyleRegistry`). Components that read from the registry use the same types. New keys require schema and type updates; removed keys cause type errors until cleaned up. No free-form keys.
- **6.3 Convention for new work**: When adding a new section or page, the developer (or AI) **first** adds the required text and style entries to `app-registry.ts` (and `STYLE_VARIABLES_INVENTORY.md`), **then** implements the component that reads from those paths. When removing a feature, remove component usage first, then remove the registry entries and inventory lines. Make this part of the definition of done (or PR checklist).
- **6.4 Optional audit script**: A small script (run locally or in CI) can (a) list all registry paths (from schema or by walking the default registry object) and (b) grep the codebase for references to those paths. Report “in registry but never referenced” and “referenced in code but missing from registry.” This catches orphaned keys and missing entries. Can be added in a later phase.
- **6.5 Documentation**: Keep `docs/STYLE_VARIABLES_INVENTORY.md` and `docs/WEBSITE_TEXT_CONTENT.md` (or a single combined inventory) updated whenever registry shape or usage changes. Link to them from the RegistryEditor (e.g. “Variables reference”) so admins and developers know the canonical list. The “tags” in the color modal (which elements use this color) are derived from this inventory so it stays relevant.

---

## 7. Skills to use

- **Frontend / UI**: Frontend design, UI/UX (tabs, previews, forms, color matrix and modal).
- **Architecture**: Keep app-registry and style schema clean, typed, and documented; enforce single source of truth.
- **Testing**: Responsive and visual parity tests as per Prompt.md.

---

**Next step:** Get explicit approval of this plan. After approval, execute strictly against it; any deviation will be proposed as a plan update before implementation.
