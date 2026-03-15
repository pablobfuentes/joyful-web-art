# VMP Compliance Audit

## 2026-03-10 – Admin-only Export Users CSV

- **Feature:** Admin-only "Export Customer Data" button that downloads one CSV with one row per user (profiles, subscription, orders, notes, shipping); RLS restricts view to admins.
- **Status:** ✅ Compliant
- **Tests / verification:**
  - `src/lib/admin-export-csv.test.ts` — fetchAllExportRows (view + chunking), buildAndDownloadCsv (headers + filename pattern), runExportCustomerData (fetch + download), error when Supabase returns error.
  - `npm run test -- --run src/lib/admin-export-csv.test.ts` passes (5 tests).
- **Failure log references:** None (no implementation failures).
- **Changelog references:** `workflow/ChangeLog.md` — "Admin-only Export Users CSV"; `docs/CHANGELOG_AI.md` — "Admin-only Export Users CSV".
- **Notes:** Security: export uses existing Supabase client; only admins can read `admin_export_customers` (view security_invoker = on). No service role or Stripe keys in frontend. Button only in admin Customers page (AdminRoute).

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

## 2026-03-10 – Social sign-in with Google and Facebook

- **Feature:** Add Google and Facebook sign-in options to the existing Supabase-backed auth flow.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/contexts/AuthContext.test.tsx` – verifies `signInWithOAuth("google")` calls `supabase.auth.signInWithOAuth(...)`.
  - `src/pages/Login.test.tsx` – verifies Google/Facebook auth buttons render and dispatch the matching provider from the login page.
  - `src/pages/Register.test.tsx` – verifies Google/Facebook auth buttons render and dispatch the matching provider from the register page.
  - Verification run: `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx src/contexts/AuthContext.test.tsx` passes.
  - Build verification: `npm run build` passes.
  - Rendered-product verification: browser validation on `http://127.0.0.1:8081/login` and `/register` at `1280x800` and `390x844` found no layout issues; buttons render and stack correctly.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – sections “Social auth TDD mock hoisting failure”, “Social auth page-test mock return mismatch”, and “Social auth page-test async click sequencing”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Social sign-in: Google and Facebook via Supabase Auth”.
- **Notes:**
  - **Security review:** The implementation keeps Supabase Auth as the single auth system and uses the frontend-safe anon key only. No service-role key, provider secret, or admin credential is exposed in app code. OAuth redirect handling is constrained to an internal `?redirect=` path that must begin with `/`, preventing open redirects to external origins. Social users still land in Supabase `auth.users`; the existing `public.handle_new_user()` trigger remains the mechanism that creates `public.profiles` rows for new accounts.
  - **Performance review:** The UI adds one small shared component and two extra buttons per auth page. Runtime overhead is negligible, and the async path only issues an OAuth request when a provider button is clicked. No additional background fetches or persistent polling were introduced.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and `docs/workflow/VMP_v2.1_Enhanced.txt`, including plan approval, TDD, failure logging, changelog update, and audit evidence.

## 2026-03-10 – Temporary Google-only social-auth rollout

- **Feature:** Temporarily hide Facebook from the auth UI while validating the newly configured Google OAuth flow.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/Login.test.tsx` – verifies the login page shows Google, hides Facebook, and still dispatches `signInWithOAuth("google")`.
  - `src/pages/Register.test.tsx` – verifies the register page shows Google, hides Facebook, and still dispatches `signInWithOAuth("google")`.
  - `src/contexts/AuthContext.test.tsx` – verifies the Google OAuth path in the auth layer still calls Supabase correctly.
  - Verification run: `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx src/contexts/AuthContext.test.tsx` passes (7 tests).
  - Build verification: `npm run build` passes.
  - Rendered-product verification: browser validation on `http://127.0.0.1:8081/login` and `/register` confirmed only `Continuar con Google` is shown; no Facebook button/text appeared; clicking Google redirected to `https://accounts.google.com/...` with Supabase callback `https://rtnispswkyybiliynezz.supabase.co/auth/v1/callback`.
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Google-only rollout still rendered Facebook”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Temporary Google-only social-auth rollout”.
- **Notes:**
  - **Security review:** This rollout does not widen the auth surface area. It only hides the Facebook entry point in the UI while keeping the already-implemented OAuth provider dispatch inside `AuthContext`. Google still uses Supabase Auth and the existing safe redirect guard, so there is no new credential exposure or redirect risk introduced by this change.
  - **Performance review:** The change replaces a two-button layout with a single rendered provider button on the auth pages. Runtime cost is effectively unchanged or slightly lower, and there are no additional network requests until a user explicitly clicks Google.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and `docs/workflow/VMP_v2.1_Enhanced.txt`, including test-first execution, immediate failure logging, changelog update, and browser verification before completion.

## 2026-03-10 – Coming soon page at `/coming-soon`

- **Feature:** Port the committed coming-soon landing page into the current branch, keep the full site at `/`, and make the coming-soon content editable through the registry/editor flow.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/ComingSoon.test.tsx` – verifies the page renders registry-driven content and applies registry-driven metadata.
  - `src/components/AdminLayout.test.tsx` – verifies the admin shell includes a preview link to `/coming-soon`.
  - `src/App.test.tsx` – verifies `/` still renders the full site and `/coming-soon` renders the coming-soon page.
  - Verification runs:
    - `npm run test -- --run src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx src/App.test.tsx`
    - `npm run test`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – lines `117-125` (“Coming soon page split-text test matcher mismatch”).
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – lines `222-226` (“Coming soon page moved to `/coming-soon` with registry support”).
- **Notes:**
  - **Security review:** The new public route is static and registry-driven. It introduces no new inputs, auth changes, secrets, mutations, or network requests. Metadata updates are limited to `document.title` and the standard description meta tag. The admin preview shortcut is just an internal client-side link to the public route.
  - **Performance review:** The new page is a lightweight presentational route with a small countdown interval, one image, and Framer Motion animations already used elsewhere in the site. No data fetching or heavy computation was added. Routing the page to `/coming-soon` preserves the existing homepage path and keeps testing flows for `/` unchanged.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and `docs/workflow/VMP_v2.1_Enhanced.txt`, including TDD, verification, failure logging, changelog update, and audit documentation.

## 2026-03-11 – Google sign-in logo affordance

- **Feature:** Add a Google logo to the `Continuar con Google` button so the provider is easier to spot and understand on the auth pages.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/SocialAuthButtons.test.tsx` – verifies the shared Google button renders a logo and still dispatches the `google` provider on click.
  - `src/pages/Login.test.tsx` – verifies the login page still renders the Google action correctly.
  - `src/pages/Register.test.tsx` – verifies the register page still renders the Google action correctly.
  - Verification runs:
    - `npm run test -- --run src/components/SocialAuthButtons.test.tsx src/pages/Login.test.tsx src/pages/Register.test.tsx`
    - `npm run test`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Google sign-in button missing provider affordance”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Google sign-in: add provider logo affordance”.
- **Notes:**
  - **Security review:** This change is presentational only. It does not alter OAuth providers, callback URLs, token handling, redirect validation, or any Supabase auth configuration.
  - **Performance review:** The added inline SVG is negligible in size and removes the need for an extra image request. Runtime cost is effectively unchanged.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus the existing repo workflow/tests with TDD, immediate failure logging, changelog update, and audit documentation.

## 2026-03-11 – Coming soon countdown target moved to March 21 noon

- **Feature:** Update the coming-soon countdown so it counts down to March 21 at `12:00 PM`.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/ComingSoon.test.tsx` – verifies the coming-soon page still renders normally and now locks the registry launch date to `2026-03-21T12:00:00`.
  - Verification runs:
    - `npm run test -- --run src/pages/ComingSoon.test.tsx`
    - `npm run test`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Coming soon countdown target still pointed at old launch date”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Coming soon countdown target updated to March 21 at noon”.
- **Notes:**
  - **Security review:** This change only updates a registry timestamp used by a public countdown. It does not affect auth, routing, external integrations, or data handling.
  - **Performance review:** No runtime logic was added; the existing countdown already recalculates against the configured target date. The change is effectively zero-cost beyond the normal one-second interval already in place.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus the existing repo workflow/tests with TDD, immediate failure logging, changelog update, and audit documentation.

## 2026-03-11 – Brand logos switched to real image assets

- **Feature:** Replace the fox emoji with the real `Logo sin BG.png` asset everywhere the product logo appears, and make each logo occurrence editable as an image in `RegistryEditor`.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/Navbar.test.tsx` – verifies the navbar renders the configured brand logo image.
  - `src/pages/ComingSoon.test.tsx` – verifies the coming-soon page renders the configured brand logo image while keeping the existing registry-driven copy and metadata coverage.
  - `src/pages/RegistryEditor.test.tsx` – verifies the editor wiring contains dedicated image-picker controls for the navigation logo and the coming-soon brand logo.
  - Verification runs:
    - `npm run test -- --run src/components/Navbar.test.tsx src/pages/ComingSoon.test.tsx src/pages/RegistryEditor.test.tsx`
    - `npm run test`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Logo rendering still hardcoded to fox emoji”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Brand logo system: replace fox emoji with real image and make logo pickers editable in RegistryEditor”.
- **Notes:**
  - **Security review:** This change is limited to registry-configured image paths rendered through the existing image resolver. It introduces no new auth flow, no executable content, no new external requests beyond normal image loading, and no new user-controlled input outside the existing admin/editor workflow.
  - **Performance review:** The navbar and coming-soon page now render a small static image instead of a single emoji glyph. The added cost is negligible, and because the default asset lives in `/public`, the browser can cache it normally across both routes. The new shared `BrandLogo` component also centralizes logo resolution instead of duplicating logic.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus the existing repo workflow/tests with TDD, immediate failure logging, changelog update, and audit documentation.

## 2026-03-11 – Coming soon stale-override migration and brand alignment

- **Feature:** Fix the remaining coming-soon issues caused by stale saved registry overrides and align the title/logo lockup vertically.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/ComingSoon.test.tsx` – verifies the page renders the aligned brand lockup and migrates stale saved logo/countdown overrides so the live page still shows the current image logo and future countdown target.
  - Verification runs:
    - `npm run test -- --run src/pages/ComingSoon.test.tsx`
    - `npm run test`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Coming soon page still showed stale logo/countdown from saved overrides”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Coming soon follow-up: migrate stale saved overrides and align brand lockup”.
- **Notes:**
  - **Security review:** The migration step only normalizes known registry content keys already stored in localStorage. It does not expand privileges, execute arbitrary data, or introduce new external inputs. The logic is narrowly scoped to the known legacy logo/countdown fields for safe schema evolution.
  - **Performance review:** The normalization runs once during content override load and performs a tiny JSON clone/object cleanup. Runtime cost is negligible, and it reduces future drift/debugging cost by self-healing stale content instead of repeatedly rendering outdated values.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus the existing repo workflow/tests with TDD, immediate failure logging, changelog update, and audit documentation.

## 2026-03-11 – Hostinger deployment folder refresh

- **Feature:** Refresh the `Hostinger` upload folder with the newest production build and archive the prior export into `History`.
- **Status:** ✅ Compliant
- **Tests:**
  - Verification runs:
    - `npm run build`
    - Filesystem verification of `Hostinger` and `History` after sync
- **Failure log references:**
  - None. This deployment refresh completed without intermediate failures that required corrective implementation.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Hostinger deployment folder refreshed from the latest production build”.
- **Notes:**
  - **Evidence:** Previous deployable files were moved to `History/Hostinger-2026-03-11_171929`; `Hostinger` was repopulated from the new `dist` build; `.htaccess` was restored into `Hostinger` to preserve SPA routing behavior on Hostinger.
  - **Security review:** This change only updates static deployment artifacts and preserves the existing rewrite rule file. It introduces no new secrets, permissions, network endpoints, or executable backend logic.
  - **Performance review:** The refreshed folder now matches the current optimized Vite production build, removing drift between local source and upload artifacts. No additional runtime overhead was introduced beyond what is already bundled in the verified build output.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus build verification, artifact backup, changelog update, and audit documentation.

## 2026-03-11 – Remove how-it-works CTA and fix footer delivery anchor

- **Feature:** Remove the `Ve un ejemplo de rutina` CTA from `Como Funciona` and fix the live footer `Envíos` anchor by correcting the public registry snapshot used in production.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/HowItWorksSection.test.tsx` – verifies the sample-routine CTA no longer renders.
  - `src/config/get-default-registry.test.ts` – verifies the public registry snapshot stays aligned with the source defaults for the how-it-works CTA and the `Envíos -> #delivery-windows` footer link.
  - Verification runs:
    - `npm run test -- --run src/components/HowItWorksSection.test.tsx src/config/get-default-registry.test.ts`
    - `npm run build`
    - `npm run test`
    - Browser verification on `http://127.0.0.1:4173`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Footer delivery anchor and how-it-works CTA drift from stale public registry”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “How-it-works CTA removed and Hostinger footer delivery link fixed”.
- **Notes:**
  - **Evidence:** The rebuilt `dist/registry.json` now contains `howItWorks.ctaButton = { label: \"\", href: \"\" }` and the footer navigate link `Envíos -> #delivery-windows`; the refreshed `Hostinger` folder was archived to `History/Hostinger-2026-03-11_180844` before copying the fixed build.
  - **Security review:** This change only affects static registry-driven content and anchor targets. It adds no new permissions, network calls, auth paths, or user-controlled execution surfaces.
  - **Performance review:** The component change removes a rendered CTA and the registry refresh only updates static JSON/config payloads. Runtime impact is negligible, and correcting the registry snapshot prevents future production drift between the bundle and file-backed content.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus TDD verification, failure logging, changelog update, build verification, and browser confirmation.

## 2026-03-11 – Fix checkout return-to-pricing navigation

- **Feature:** Make the checkout `Volver a planes` action and the cancel-screen `Ver planes` action return to the landing-page pricing section through real anchor links.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/pages/CheckoutNavigation.test.tsx` – verifies both checkout screens render pricing return actions as `/#pricing` links.
  - Verification runs:
    - `npm run test -- --run src/pages/CheckoutNavigation.test.tsx`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Checkout pricing back-link used router navigation instead of a real anchor”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Checkout pricing return links switched to real anchors”.
- **Notes:**
  - **Evidence:** `src/pages/Checkout.tsx` and `src/pages/CheckoutCancel.tsx` now use direct `href="/#pricing"` links instead of imperative `navigate("/#pricing")` button handlers, and the focused regression test covers both occurrences so the pattern cannot drift back.
  - **Security review:** This change only alters client-side navigation targets to an existing in-page pricing anchor. It introduces no new permissions, secrets, backend calls, or user-input handling paths.
  - **Performance review:** Replacing router-triggered button clicks with static anchor links removes a small amount of client-side routing work and keeps the behavior aligned with the rest of the site’s lightweight section links. Runtime impact is negligible and slightly simpler.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus TDD verification, failure logging, changelog update, and diagnostics review.

## 2026-03-11 – Add global hash-scroll handling for route transitions

- **Feature:** Ensure route transitions that include hashes like `/#pricing` actually scroll to the target section instead of only updating the URL.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/components/HashScrollHandler.test.tsx` – verifies a checkout-to-home navigation with `#pricing` triggers scrolling to the pricing section.
  - `src/pages/CheckoutNavigation.test.tsx` – verifies the checkout entry points still render `/#pricing` links.
  - Verification runs:
    - `npm run test -- --run src/components/HashScrollHandler.test.tsx src/pages/CheckoutNavigation.test.tsx`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – section “Checkout pricing anchor changed route but still landed at hero”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Hash-based landing-page navigation now scrolls after route changes”.
- **Notes:**
  - **Evidence:** `src/components/HashScrollHandler.tsx` is mounted in `src/App.tsx` and watches `location.hash` to call `scrollIntoView({ behavior: "smooth", block: "start" })` on the matching section, which closes the gap between URL updates and visible scroll position.
  - **Security review:** This change only reads the current route hash and scrolls to an existing DOM element by id. It introduces no new API calls, storage access, secrets, or user-controlled code execution.
  - **Performance review:** The handler runs only when the route hash changes, performs a simple DOM lookup, and exits immediately when there is no hash. Runtime impact is negligible while improving navigation reliability.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` and `docs/workflow/VMP_v2.1_Enhanced.txt` were not present in the repository during this implementation cycle, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md` plus TDD verification, failure logging, changelog update, and diagnostics review.

## 2026-03-10 – Hostinger deploy folder refreshed with in-place history snapshot

- **Feature:** Update the `Hostinger` upload folder to the latest generated build and move the replaced generated deploy surface into `Hostinger/history`.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/hostinger-deploy-sync.test.ts` – verifies `Hostinger/index.html` and `Hostinger/assets` match the current entry asset references extracted from `dist/index.html`.
  - Verification runs:
    - `npm run build`
    - `npm run test -- src/hostinger-deploy-sync.test.ts`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – sections “Hostinger deploy mirror still pointed at stale bundles”, “Hostinger sync test hardcoded an outdated latest bundle name”, and “PowerShell command chaining mismatch during Hostinger sync”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Hostinger deploy folder refreshed from the latest build with in-place history backup”.
- **Notes:**
  - **Evidence:** The previous generated deploy surface was archived to `Hostinger/history/20260311-224505/`; `Hostinger/index.html` now references `/assets/index-Cm9BMrr-.js` and `/assets/index-CNNEYgXU.css`; the focused regression test passes against the refreshed folder.
  - **Security review:** This change is limited to static deployment artifacts and a local history snapshot. It introduces no new secrets, permissions, network paths, or runtime auth/data behavior.
  - **Performance review:** The upload folder now matches the already-optimized latest build, so runtime behavior only benefits from serving the newest generated assets. The archive/copy step is a one-time local filesystem operation with no deployed overhead.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and the available workflow evidence with TDD, immediate failure logging, changelog update, and fresh verification before completion.

## 2026-03-10 – One-command Hostinger refresh automation

- **Feature:** Add a single-command automation flow for refreshing `Hostinger` from the latest build while preserving timestamped rollback snapshots.
- **Status:** ✅ Compliant
- **Tests:**
  - `src/hostinger-sync-script.test.ts` – verifies `package.json` exposes the `hostinger:refresh` command and executes the PowerShell script against temp directories to confirm archive/copy behavior.
  - `src/hostinger-deploy-sync.test.ts` – verifies the real `Hostinger` folder matches the latest built entry asset references from `dist/index.html`.
  - Verification runs:
    - `npm run test -- src/hostinger-sync-script.test.ts`
    - `npm run hostinger:refresh`
    - `npm run test -- src/hostinger-sync-script.test.ts src/hostinger-deploy-sync.test.ts`
- **Failure log references:**
  - `docs/FAILURE_LOG.md` – sections “Hostinger refresh automation missing package shortcut”, “Hostinger refresh automation missing PowerShell script”, and “Hostinger refresh PowerShell script param block was in the wrong place”.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “One-command Hostinger refresh automation”.
- **Notes:**
  - **Evidence:** `scripts/sync-hostinger.ps1` now exists; `package.json` exposes `hostinger:sync` and `hostinger:refresh`; the end-to-end command created a real snapshot at `Hostinger/history/20260312-095329/`; `Hostinger/index.html` now references `/assets/index-MQghwU3t.js` and `/assets/index-CQTMGJSs.css`.
  - **Security review:** This automation only manipulates local static deployment artifacts. It does not introduce secrets, remote deployment credentials, auth changes, or new runtime attack surface.
  - **Performance review:** The script adds no runtime cost to the site itself. It reduces operational friction and helps keep `Hostinger` aligned with the already-optimized Vite build, which lowers the risk of serving stale assets.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and the available workflow evidence with TDD, immediate failure logging, changelog update, and fresh command verification before completion.

## 2026-03-12 – Homepage SEO copy comparison document

- **Feature:** Prepare a review-only Markdown document with side-by-side current vs proposed homepage SEO copy before any implementation.
- **Status:** ✅ Compliant
- **Tests:**
  - Document verification only:
    - confirmed `docs/HOMEPAGE_SEO_COPY_COMPARISON.md` exists
    - confirmed the request produced no page, component, or registry-content changes
- **Failure log references:**
  - None. No implementation failures occurred during this document-only request.
- **Changelog references:**
  - `docs/CHANGELOG_AI.md` – section “Homepage SEO copy comparison document prepared for side-by-side review”
  - `workflow/ChangeLog.md` – section “Homepage SEO copy comparison document”
- **Notes:**
  - **Evidence:** The new document includes current vs proposed copy for metadata, hero, pricing intro, selected FAQ entries, trust copy, final CTA refinements, and an approval matrix so the user can approve items selectively before implementation.
  - **Security review:** This request only created documentation. It introduced no runtime behavior, no secrets, no network calls, and no user-facing code changes.
  - **Performance review:** This request only created a static Markdown review artifact. It has no performance impact on the site.
  - **Checklist note:** `docs/VMP_COMPLIANCE_CHECKLIST.md` was not present in the repository, so compliance was validated against `.cursor/VMP_COMPLIANCE_REMINDER.md`, `workflow/Prompt.md`, and the available workflow requirements for approval-first planning, logging, and no-code-change execution.

