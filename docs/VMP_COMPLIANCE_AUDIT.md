# VMP Compliance Audit

## 2026-03-11 – Local dev server port hardening

- **Feature:** Eliminate intermittent local `npm run dev` 404s caused by a port collision on the old Vite dev port.
- **Status:** ✅ Compliant
- **Tests / verification:**
  - `src/dev-server-config.test.ts` – verifies the checked-in Vite config uses the dedicated dev port and `strictPort: true`.
  - Focused verification command passed: `npm run test -- src/dev-server-config.test.ts`.
  - Runtime verification: the active Vite dev server returned `200` for `http://127.0.0.1:5180/` and `http://127.0.0.1:5180/login`.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Vite config test discovery mismatch”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Local dev server port hardening for intermittent localhost 404s”.
- **Notes:**
  - **Security review:** This change only affects local development server binding. It does not change production hosting, auth, routing logic, or any network trust boundary in the shipped application.
  - **Performance review:** There is no runtime cost in production. In development, the only impact is deterministic port binding and a fast explicit failure if the configured port is already occupied.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository during this implementation. Compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and `workflow/VMP_v2.1_Enhanced.txt`, with test-first verification plus failure-log, changelog, and audit updates completed.

## 2026-03-10 – Auth warning cleanup and final customer-facing Spanish sweep

- **Feature:** Remove auth-related test warnings from customer-facing page tests and finish the last visible English auth/loading strings while leaving admin pages unchanged.
- **Status:** ✅ Compliant
- **Tests / verification:**
  - `src/config/app-registry.localization.test.ts` – verifies Spanish registry content for loading/auth placeholders and related dashboard copy.
  - `src/pages/Login.test.tsx` – verifies login page registry copy and the Spanish submitting label.
  - `src/pages/ResetPassword.test.tsx` – verifies the reset-password loading state is rendered in Spanish.
  - `src/components/ProtectedRoute.test.tsx` – verifies the protected-route loading state is rendered in Spanish.
  - `src/pages/Dashboard.test.tsx` – verifies dashboard quick actions still render correctly after auth test setup migration.
  - `src/pages/Account.test.tsx` – verifies account page content still renders correctly after auth test setup migration.
  - `src/pages/OrderHistory.test.tsx` – verifies the protected order-history page still renders registry-driven copy.
  - `src/pages/SubscriptionManagement.test.tsx` – verifies the protected subscription page still renders registry-driven copy.
  - `src/pages/SettingsPage.test.tsx` – verifies the protected settings page still renders registry-driven copy.
  - `src/pages/NotificationsPage.test.tsx` – verifies the protected notifications page still renders registry-driven copy.
  - Focused verification command passed: `npm run test -- src/config/app-registry.localization.test.ts src/pages/Login.test.tsx src/pages/ResetPassword.test.tsx src/components/ProtectedRoute.test.tsx src/pages/Dashboard.test.tsx src/pages/Account.test.tsx src/pages/OrderHistory.test.tsx src/pages/SettingsPage.test.tsx src/pages/NotificationsPage.test.tsx src/pages/SubscriptionManagement.test.tsx` (`20` tests).
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Auth page test warnings cleanup”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Auth warning cleanup and final customer-facing Spanish sweep”.
- **Notes:**
  - **Security review:** The runtime changes are limited to customer-facing copy and registry-driven loading labels. The test-side auth cleanup replaces live auth effects with fixed context values in Vitest only; it does not alter production auth behavior, permissions, redirects, or Supabase access patterns.
  - **Performance review:** Runtime impact is negligible. The only production changes are string lookups from `APP_REGISTRY`, replacing previous hardcoded loading labels/placeholders; the shared test helper affects test execution only.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository during this implementation. Compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and `workflow/VMP_v2.1_Enhanced.txt`, with test-first verification plus changelog, failure-log, and audit updates completed.

## 2026-03-10 – Spanish localization sweep across customer-facing pages

- **Feature:** Translate the remaining customer-facing English copy to Spanish across auth pages, delivery windows, dashboard quick actions, dashboard destination pages, navigation fallbacks, and other visible UI labels.
- **Status:** ✅ Compliant
- **Tests / verification:**
  - `src/config/app-registry.localization.test.ts` – verifies translated Spanish copy in the registry for auth, dashboard, account, and past editions.
  - `src/lib/delivery-windows.test.ts` – verifies the delivery-window logic now returns `Primera quincena` / `Segunda quincena`.
  - `src/components/DeliveryWindowsSection.test.tsx` – verifies rendered delivery windows use Spanish labels and month names.
  - `src/pages/Dashboard.test.tsx` – verifies Spanish quick actions and logout UI.
  - `src/pages/OrderHistory.test.tsx` – verifies translated page copy and the Spanish back-link aria-label.
  - `src/pages/SubscriptionManagement.test.tsx` – verifies translated page copy and the Spanish back-link aria-label.
  - `src/pages/SettingsPage.test.tsx` – verifies translated page copy and the Spanish back-link aria-label.
  - `src/pages/NotificationsPage.test.tsx` – verifies translated page copy and the Spanish back-link aria-label.
  - Focused verification command passed: `npm run test -- src/config/app-registry.localization.test.ts src/lib/delivery-windows.test.ts src/components/DeliveryWindowsSection.test.tsx src/pages/Dashboard.test.tsx src/pages/OrderHistory.test.tsx src/pages/SubscriptionManagement.test.tsx src/pages/SettingsPage.test.tsx src/pages/NotificationsPage.test.tsx` (`22` tests).
  - Build: `npm run build` passed.
- **Failure log references:**
  - No new `docs/FAILURE_LOG.md` entry was required. The only failures encountered were expected TDD red-phase localization failures before implementation.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Spanish localization sweep for auth, dashboard, delivery windows, and visible UI copy”.
- **Notes:**
  - **Security review:** This is a content-and-formatting localization pass. It adds no new APIs, auth flows, persistence paths, or trust boundaries. Changes were limited to registry content, formatting locale, and a few existing UI labels/aria-labels.
  - **Performance review:** Runtime impact is negligible. The only logic-level localization change is switching date/month formatting to `es-MX` and changing delivery-window labels, which does not materially affect bundle size or rendering cost.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository during this implementation. Compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and `workflow/VMP_v2.1_Enhanced.txt`, with test-first verification plus changelog and audit updates completed.

## 2026-03-10 – Hostinger deployment package preparation

- **Feature:** Prepare a ready-to-upload Hostinger package from the current production build and include the required Apache SPA fallback plus a manual upload checklist.
- **Status:** ✅ Compliant
- **Tests / verification:**
  - No new runtime product logic was introduced, so no new automated test file was added for this packaging-only task.
  - `npm run build` passed immediately before packaging.
  - `Hostinger/index.html` was verified after packaging to reference the latest hashed CSS and JS assets.
  - `Hostinger/.htaccess` and `Hostinger/UPLOAD_CHECKLIST.md` were created and verified in the package.
- **Failure log references:**
  - No new `docs/FAILURE_LOG.md` entry was required; no unexpected implementation failures occurred during this packaging task.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Hostinger deployment package and upload checklist”.
- **Notes:**
  - **Security review:** This change only prepares static deployment artifacts and documentation. It adds no new secrets, endpoints, authentication flows, or runtime code paths. The checklist explicitly reminds the user to keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as local build-time inputs and to configure production redirect URLs in Supabase instead of exposing secrets in Hostinger.
  - **Performance review:** No application runtime logic was changed. The deployment package reflects the existing production build, so runtime performance characteristics are unchanged by this task.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository during this implementation. Compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and `workflow/VMP_v2.1_Enhanced.txt`, with fresh build verification plus changelog and audit updates completed.

## 2026-03-10 – Delivery windows preview section

- **Feature:** Add the landing-page section `When will I receive my Skincare?` with an interactive subscription-date picker and the next 6 delivery windows by half-month period.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/lib/delivery-windows.test.ts` – verifies First Half / Second Half grouping, next-month first delivery, bi-monthly cadence, and year rollover.
  - `src/components/DeliveryWindowsSection.test.tsx` – verifies registry-driven rendering, date-picker label presence, and six delivery-window list items.
  - Full suite: `npm run test -- --run` passed (`36` tests).
  - Build: `npm run build` passed.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Delivery windows verification blockers” documents the transient shell spawn failure and the temporary Testimonials visibility blocker during live verification.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Delivery windows preview section ("When will I receive my Skincare?")”.
- **Notes:**
  - **TDD / verification evidence:** The pure delivery logic was tested directly before final verification; component tests and live browser verification were then used to confirm layout and interaction behavior.
  - **Live verification:** With Testimonials temporarily enabled, the section was confirmed between `ExperienceSection` and `TestimonialsSection`; date changes updated results immediately; First Half and Second Half examples matched the expected month sequence; the mobile sticky-header overlap was fixed. Per request, Testimonials was restored to hidden (`SHOW_TESTIMONIALS = false`) after verification.
  - **Security review:** The feature is fully client-side and registry-driven. It adds no new network requests, persistence, authentication paths, or user-submitted data beyond local in-memory date selection, so it does not materially increase attack surface.
  - **Performance review:** The computation is O(6) over a fixed-size list and uses lightweight React state plus a memoized result. Rendering adds one small section and a native calendar popover, with negligible runtime cost relative to the rest of the landing page.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` could not be found in the repository during this implementation. Compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and `workflow/VMP_v2.1_Enhanced.txt`, with required tests, failure logging, changelog, and audit documentation completed.

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

## 2026-03-10 – Remove Lovable page branding from HTML metadata

- **Feature:** Replace leftover `Lovable App` metadata in the page shell with `KumiBox` branding.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/index-metadata.test.ts` – verifies the root `index.html` no longer contains `Lovable App`, `Lovable Generated Project`, `https://lovable.dev/`, or `@Lovable`.
  - Verification run: `npm run test -- src/index-metadata.test.ts` passes.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – No new entries. The initial failing test was the expected TDD red phase and not an unexpected implementation or environment failure.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Remove Lovable page branding from HTML metadata”.
- **Notes:**
  - **Security review:** The change is limited to static HTML metadata in `index.html` and mirrored packaged HTML copies. It introduces no new scripts, inputs, endpoints, auth changes, or data flows.
  - **Performance review:** The update only changes static `<head>` tags and adds a tiny file-content regression test. There is no runtime performance impact on the application.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` and the existing audit workflow requirements, including test-first execution, changelog update, and audit documentation.

