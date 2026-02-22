# Registry Editor – Failsafe (registry-first rule)

**Purpose:** Keep the Registry Editor, `app-registry`, and the live site in sync. See **docs/PLAN_REGISTRY_EDITOR.md** §6 for full detail.

---

## Registry-first rule

1. **New variables** (user-facing text or style) **must** be added to the registry and inventory **first**, then used in components.
   - Text: add to `src/config/app-registry.ts` (and any content inventory doc).
   - Style: add to `src/config/style-registry.ts` and to `docs/STYLE_VARIABLES_INVENTORY.md` (with “used by” / tags).
2. **Removing a feature:** Remove or update component usage first, then remove the corresponding entries from the registry and inventory.
3. **No hardcoding:** Components must not hardcode copy or style tokens; they read from the registry (or from CSS variables / context fed from the registry).

This makes the **registry the single source of truth** and keeps the editor and the app aligned.

---

## Convention for new work

- **New section or page:** First add the required text and style entries to `app-registry.ts` and (for style) `style-registry.ts` + STYLE_VARIABLES_INVENTORY; then implement the component that reads from those paths.
- **Removing a feature:** Remove component usage first, then remove registry entries and inventory lines.

Make this part of the definition of done (or PR checklist) for any change that adds or removes user-facing text or theme variables.

---

## Optional audit script (follow-up)

A small script (run locally or in CI) can:

- List all registry paths (from schema or by walking the default registry).
- Grep the codebase for references to those paths.
- Report: “in registry but never referenced” and “referenced in code but missing from registry.”

This catches orphaned keys and missing entries. Can be added in a later phase.
