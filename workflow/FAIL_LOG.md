# Failure Log

## Entry 1: Registry list as object caused .map is not a function (initial report)
- **Date**: Session 1
- **Failure**: After save/refresh, console error `data.cards.map is not a function` (and later `data.steps.map is not a function`). Page broke.
- **Root cause**: Registry and/or localStorage overrides store some section lists as **objects** with string keys (e.g. `{ "0": item0, "1": item1 }`). Components assumed **arrays** and called `.map()` on the value. Objects do not have `.map()`, so the app threw.
- **Fix attempt 1**: Replaced with `Object.values(data.cards ?? {})` in ProblemSection. Page worked but **cards could appear in wrong order** because `Object.values()` order follows object key enumeration, which is not guaranteed to be 0,1,2 when keys were set in a different order (e.g. after merge: "1","2" then "0").
- **Result**: User reported "some cards were missing" — likely wrong order (first slot showing content from key "1", etc.) or perceived as missing.

## Entry 2: Normalize to array with sort — still "missing" cards (user did not accept)
- **Date**: Session 2
- **Failure**: User reported: "the third card from the Why section and the last 2 cards in How it works are missing". User did not accept changes.
- **Root cause (analysis)**:
  1. **Order**: When `deepMergeSection` merges base (object with keys "1","2") with override (object or array), the merged object’s key **insertion order** can be "1", "2", "0". `Object.values()` then returns [item1, item2, item0]. So the **first** rendered card shows content that belongs to index 1 (second card), and the **third** slot shows content for index 0 — so the user sees "third card" as wrong or "missing" (or the first card looks wrong).
  2. **No content change rule**: Previous attempts added or changed content in `app-registry.ts` (e.g. converting `why.cards` from object to array and adding a third card). User rule: **do not change any variable content**; only make the page resilient to array vs object so that **existing** data is displayed correctly.
  3. **Correct fix**: Normalize list to array by **numeric key order** (0,1,2,...) so that whatever is in the registry/merge is shown in the right order and nothing is dropped. Do not add/remove/edit any content in app-registry or elsewhere.
- **Fix to apply**: Add a single helper that converts value to array: if already array return as-is; if object, collect keys that match `^\d+$`, sort by `Number(key)`, and return `keys.map(k => value[k])`. Use this in every component that does `.map()` on a registry list. Do not change any content in app-registry or in any section copy.

## Entry 3: (This session) Full analysis and fix without content changes
- **Goal**: Page works as intended; any change in variables only changes values, not behavior. No content/variable changes without permission.
- **Implementation**: Add `registryListToArray` in `src/lib/utils.ts`; use it in all sections that read list-like registry data (why.cards, howItWorks.steps, testimonials.items, etc.). Ensure key for StepCard is stable when `step.label` is missing (use `index` or `step.label ?? index`). No edits to app-registry.ts or to any copy/variable values.
