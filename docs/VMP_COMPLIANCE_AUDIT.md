# VMP Compliance Audit

## 2026-03-03 – Hero rotatingQuotes normalization and guardrail

- **Feature:** Fix hero `rotatingQuotes` so all phrases render correctly and add guardrails so they are not accidentally removed.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/HeroSection.test.tsx` (Vitest) – verifies `HeroSection` normalizes `rotatingQuotes` via `registryListToArray` and that the app registry yields at least three quotes.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Vitest missing @testing-library/dom” documents the initial missing-module error and resolution (including `ERESOLVE` and the `--legacy-peer-deps` installation).
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Hero rotatingQuotes regression: normalize list and add guardrail tests”.
- **Notes:**
  - Tests were written and run before changing `HeroSection` (TDD red-green cycle).
  - Security review: change is purely presentational/content-driven; no new inputs or network calls introduced.
  - Performance review: rotating quote interval remains at 3000ms; normalization uses a small helper on a fixed-size list (negligible impact).

## 2026-03-03 – Past Editions carousel layout

- **Feature:** Replace the `pastEditions` static grid with a carousel-style layout driven by the registry.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/PastEditionsSection.test.tsx` – asserts that there is one list item per `APP_REGISTRY.pastEditions.editions` entry, the middle edition is marked active by default via `aria-current="true"`, and clicking another item updates the active state.
  - Shared test setup: `src/test/setup.ts` now includes an `IntersectionObserver` polyfill so Framer Motion’s `useInView` works in jsdom.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – no new failures; test-only `IntersectionObserver is not defined` error was resolved immediately with the polyfill and does not affect runtime behavior.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Past Editions: carousel layout instead of static grid”.
- **Notes:**
  - Behavior remains registry-driven: titles, categories, and months still come from `app-registry.ts` via `useRegistryContent` and `registryListToArray`.
  - Security review: change is purely presentational; no new user inputs or external calls.
  - Performance review: carousel uses simple click handlers and CSS transitions; `useEffect` only touches a single DOM element to set/remove a `--transition` var when the active index changes (low overhead, no timers left dangling).

