# Registry Editor – Testing (Phase 5)

This doc describes how to verify **visual and functional parity**, **responsive behavior**, and the **critical path** (edit → Save → reload) for the Registry Editor and the main site after registry-driven refactors.

**Reference:** `docs/PLAN_REGISTRY_EDITOR.md` Phase 5.

---

## 1. Key breakpoints

Use these viewport widths for manual testing:

| Label   | Width (px) | Notes                    |
|--------|------------|--------------------------|
| Mobile | 375        | iPhone SE / narrow       |
| Tablet | 768        | iPad portrait            |
| Desktop| 1280       | Laptop / standard layout |

**How to test:** DevTools → Toggle device toolbar (or Responsive) → set width; reload if needed.

---

## 2. Visual and functional parity (5.1)

**Goal:** Confirm no regressions after registry-driven refactor. The main site and Registry Editor should look and behave as before when using default registry (no overrides).

### Main site (Index)

- **Pages/sections to check:** Home (Index) with Hero, Pricing, one other section (e.g. FAQ or Final CTA).
- **At each breakpoint (375, 768, 1280):**
  - Hero: heading, description, rotating quotes, primary/secondary buttons, footer line, hero image visible and correctly styled.
  - Pricing: title, subtitle, plan cards (name, price, features, CTA), shipping/commitment labels.
  - Navbar: logo, links, CTA; no overflow or clipped text.
  - Section backgrounds and dividers between sections render (no missing waves/blobs).
- **Pass criteria:** Layout intact, colors/fonts from registry (or CSS vars), no console errors, no broken images or missing text.

### Baseline

- **Before:** Use current `main` branch (or last known good build) as baseline.
- **After:** Run `npm run build` and `npm run preview`; repeat the same checks. Optionally capture screenshots at one breakpoint for Hero and Pricing for future comparison.

### Optional automated smoke test

A minimal E2E (e.g. Playwright) can:

1. Load the main page (`/`).
2. Assert key sections are visible: e.g. `#hero` or section with "Skincare" (or app-registry hero title), `#pricing`, and at least one plan card.
3. Optionally load `/admin/registry-editor` (with auth mocked or skipped if possible) and assert the General tab and at least one section tab are present.

This repo has Playwright as a dependency; add a script and a single spec if you want this in CI (follow-up).

---

## 3. Responsive: Registry Editor and previews (5.2)

**Goal:** Registry Editor and its previews are usable at all breakpoints.

### Registry Editor at 375, 768, 1280

- **General tab:** Color palette grid, font list, radius/shadows usable; no horizontal scroll on body; modal (color picker) opens and closes and is usable.
- **Section tabs:** Tabs scroll or wrap; Style and Content panels readable; inputs and dropdowns (font, size, color) work.
- **Preview:** Section preview (or representative block) visible; if implemented as inline preview, it resizes with layout; no overlap or hidden content that blocks editing.
- **Save / Reset:** Buttons remain accessible; toast or feedback visible after Save.

**Pass criteria:** No broken layout, no permanently hidden controls, modals fit viewport (or scroll).

### Known limitations

- In-editor preview may use a fixed width or simplified markup; production page may differ (fonts, viewport). Document any such limitation in this section when found.

---

## 4. Critical path: Edit → Save → Reload (5.3)

**Goal:** Changes made in the editor persist to localStorage and are reflected on the main site after reload (or in another tab via storage event).

### Steps (manual)

1. **Open Registry Editor** at `/admin/registry-editor` (logged in as admin).
2. **Edit a color:** General tab → click a palette cell → change hex (e.g. first row) → Save.
3. **Edit a font:** General tab → change display or body font (or a section’s font) → Save.
4. **Edit a button style:** e.g. Hero tab → Style → adjust button-related control if present; or change a section background → Save.
5. **Edit a divider:** e.g. Hero (or any section) tab → Style → divider style or top/bottom color → Save.
6. **Edit a content modifier:** e.g. Hero or Pricing tab → Content → change text color/font/size for one row → Save.
7. **Reload main site:** Open `/` in the same tab (or open in a new tab). Confirm:
   - Palette change is reflected (e.g. background or text using that index).
   - Font change is reflected where that font is used.
   - Button/section/divider changes are visible.
   - Content modifier (e.g. Hero heading or Pricing title color/font/size) matches the editor.

**Pass criteria:** All five edit types persist after Save and are visible after reload (or in the other tab without reload, via storage listener).

### Optional E2E for persistence

A single E2E test can:

1. Set a known override in localStorage (e.g. `app_registry_style_overrides` or `app_registry_content_modifiers` with a known value).
2. Load `/`.
3. Assert one expected style or content is present (e.g. a specific CSS variable applied, or a specific text/color).

This can be added as a follow-up; manual run of the steps above is sufficient for Phase 5 sign-off.

---

## 5. Verification checklist (summary)

- [ ] **5.1** Main site: Hero, Pricing, one other section checked at 375, 768, 1280; no regressions.
- [ ] **5.2** Registry Editor: General + one section tab checked at 375, 768, 1280; tabs and preview usable.
- [ ] **5.3** Critical path: All five edit types (color, font, button/section, divider, content modifier) → Save → reload → verify on main site.
- [ ] **Logs:** Any failure during testing recorded in `docs/FAILURE_LOG.md`; `docs/CHANGELOG_AI.md` updated for Phase 5.
