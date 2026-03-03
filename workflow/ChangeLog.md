# Change Log

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
