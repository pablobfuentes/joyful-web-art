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

## 2026-03-03 – Account page (profile, security, preferences)

- **Feature:** Implement a dedicated Account page that surfaces profile information, security actions, and a preferences placeholder, all driven from `app-registry.ts` and protected behind auth.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/Account.test.tsx` – verifies that the Account page renders the account title/subtitle from `APP_REGISTRY.account`, shows the authenticated user’s email and name from `useAuth()`, and that the Edit profile, Change password, and Back to Dashboard links resolve to the hrefs defined in `APP_REGISTRY.account`.
- **Failure log references:**
  - `workflow/FAIL_LOG.md` – No new entries; no feature-level failures occurred during this implementation.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Account page: registry-driven profile, security, and preferences”.
- **Notes:**
  - Security review: Account is a protected route that only reads the authenticated user from `useAuth()` and renders registry-driven content; it introduces no new user input fields, network calls, or stateful mutations (profile editing and password reset continue to be handled via existing Dashboard and Forgot Password flows).
  - Performance review: The page composes small, static cards with a single call to `useAuth()` and a lightweight `formatDate()` helper; this adds negligible overhead compared to Dashboard and reuses the existing layout shell and Navbar.

## 2026-03-06 – Dashboard Quick Actions & Account consolidation

- **Feature:** Wire Dashboard Quick Actions to dedicated, protected pages (`/orders`, `/subscription`, `/settings`, `/notifications`) and deprecate the standalone `/account` route so all account flows live under the Dashboard.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/Dashboard.test.tsx` – asserts that each Quick Action link renders with the correct non-`#` `href` (`/orders`, `/subscription`, `/settings`, `/notifications`) and that core dashboard copy still comes from `APP_REGISTRY.dashboard`.
  - `src/pages/OrderHistory.test.tsx` – verifies the Order History page renders its title, subtitle, and empty-state copy from `APP_REGISTRY.orderHistory` inside the shared shell.
  - `src/pages/SubscriptionManagement.test.tsx` – verifies the Subscription Management page renders its title, subtitle, and body from `APP_REGISTRY.subscriptionManagement`.
  - `src/pages/SettingsPage.test.tsx` – verifies the Settings page renders its title, subtitle, and body from `APP_REGISTRY.settings`.
  - `src/pages/NotificationsPage.test.tsx` – verifies the Notifications page renders its title, subtitle, and body from `APP_REGISTRY.notifications`.
  - `src/pages/Account.test.tsx` – still verifies the legacy Account page renders registry-driven title/subtitle and link targets, updated to tolerate the user’s name appearing in both Navbar and content.
  - Full suite: `npm test` passes (26 tests, 12 files), covering auth, dashboard, account, and new Quick Action destinations.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – No new entries. Temporary test failures were all expected TDD red phases (missing components, missing routes) and did not represent unexpected environmental or runtime failures.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Dashboard Quick Actions: dedicated pages and `/account` route deprecation”.
  - `workflow/ChangeLog.md` – section “Dashboard Quick Actions & Account consolidation”.
- **Notes:**
  - **Security review:**
    - All four new destinations (`/orders`, `/subscription`, `/settings`, `/notifications`) are wrapped in `ProtectedRoute` in `src/App.tsx`, reusing the same authentication guard as `/dashboard`.
    - The new pages are read-only views that:
      - Use `Navbar` (which internally reads from `useAuth()` and `useRegistryContent`) for layout and identity, and
      - Use `useRegistryContent().getSectionContent("<sectionKey>")` (`orderHistory`, `subscriptionManagement`, `settings`, `notifications`) for all user-facing copy.
    - No new forms, mutations, or external API calls were introduced; the only navigation change is wiring Quick Actions to the new routes and removing the `/account` route.
  - **Performance review:**
    - Each new page is a small, static component composed of a single registry lookup plus a couple of text nodes inside the existing layout shell; there are no loops over large collections or expensive calculations.
    - Routing changes re-use the existing `ProtectedRoute` and React Router setup and do not add additional providers or context layers.
    - Given the minimal rendering cost and absence of new network calls, the impact on bundle size and runtime performance is negligible compared to the existing Dashboard/auth flows.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository (glob search for `**/VMP_COMPLIANCE_CHECKLIST.*` returned no results). Compliance for this feature was validated against `docs/VMP_COMPLIANCE_REMINDER.md` and `docs/workflow/VMP_v2.1_Enhanced.txt`, including test-first discipline, security/performance review, and audit documentation.

