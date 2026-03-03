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

