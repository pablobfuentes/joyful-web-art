# Failure log

## Checkout pricing anchor changed route but still landed at hero

- **Date:** 2026-03-11
- **Context:** Re-checking the checkout `Volver a planes` fix after the link target was updated but the live app still returned to the top hero section.
- **Error:** The checkout link changed the URL back to `/#pricing`, but the app still landed at the top of the home page instead of scrolling to the pricing section.
- **Secondary test failure during implementation:** The first regression-test attempt failed with `Failed to resolve import "@testing-library/user-event"` because this repository does not include that helper package.
- **Root cause:** The React app had no router-aware hash-scroll behavior, so route changes with hashes updated the URL without triggering `scrollIntoView` for the target section. The test harness issue was separate and came from using a dependency that is not installed in this repo.
- **Reproduction:** `npm run test -- --run src/components/HashScrollHandler.test.tsx`
- **Fix attempt:** Add a global `HashScrollHandler` tied to `useLocation()` so `/#section` navigation scrolls to the matching element after route changes, and rewrite the regression test to use `fireEvent` instead of `@testing-library/user-event`.
- **Verification:** `npm run test -- --run src/components/HashScrollHandler.test.tsx src/pages/CheckoutNavigation.test.tsx` passed.

## Checkout pricing back-link used router navigation instead of a real anchor

- **Date:** 2026-03-11
- **Context:** Updating the checkout `Volver a planes` action so it reliably returns to the pricing section on the landing page.
- **Error:** The new red-phase regression test failed because both checkout screens exposed buttons that called `navigate("/#pricing")`, so Testing Library could not find pricing back actions as links and the hash jump remained dependent on router behavior.
- **Root cause:** Checkout-to-pricing navigation was implemented as imperative React Router navigation instead of real anchor links. That made hash-based section jumps less robust than the rest of the site’s pricing anchors and duplicated the same pattern in both `Checkout` and `CheckoutCancel`.
- **Reproduction:** `npm run test -- --run src/pages/CheckoutNavigation.test.tsx`
- **Fix attempt:** Replace both pricing return actions with real anchors pointing to `/#pricing` and add focused regression coverage for both pages.
- **Verification:** `npm run test -- --run src/pages/CheckoutNavigation.test.tsx` passed.

## Vite config test discovery mismatch

- **Date:** 2026-03-11
- **Context:** Adding a regression test for the intermittent local `npm run dev` 404 caused by a port conflict on `8080`.
- **Error:** `npm run test -- vite.config.test.ts` and then `npm run test -- src/vite.config.test.ts` both returned `No test files found, exiting with code 1`.
- **Root cause:** This repository's Vitest setup only discovers tests under `src/**/*.{test,spec}.{ts,tsx}` and also excludes filenames matching `vite.config.*`, so both the root-level file and the renamed-in-place `src/vite.config.test.ts` were ignored. A follow-up import-based test then failed with an esbuild `TextEncoder ... instanceof Uint8Array` invariant violation because importing `vite.config.ts` in this test environment pulled in tooling code that jsdom/Vitest did not handle correctly.
- **Fix:** Rename the regression test to a non-excluded filename under `src/` and assert against the `vite.config.ts` file contents directly instead of importing the config module.
- **Verification:** Re-run the focused Vitest command against the relocated test file and confirm it executes.

## Auth page test warnings cleanup

- **Date:** 2026-03-10
- **Context:** Removing auth-related React test warnings and finishing the Spanish sweep for customer-facing auth/loading states.
- **Error:** The first test setup reused `AuthProvider` inside page tests, which triggered async session resolution during render and produced noisy auth-related warnings. A follow-up login test refactor also failed with `ReferenceError: Cannot access 'signInWithPassword' before initialization` because the `vi.mock()` factory referenced a non-hoisted top-level mock.
- **Root cause:** The tests were mounting the live auth effect instead of supplying a fixed auth context value, so they inherited async provider behavior that the page assertions did not need. The login test then compounded this by using a hoisted module mock incorrectly.
- **Fix:** Added `src/test/render-with-auth.tsx` to wrap test renders in a static `AuthContext.Provider` plus `MemoryRouter` future flags, then migrated the affected page tests to use that helper instead of `AuthProvider` or Supabase auth mocks.
- **Verification:** `npm run test -- src/config/app-registry.localization.test.ts src/pages/Login.test.tsx src/pages/ResetPassword.test.tsx src/components/ProtectedRoute.test.tsx src/pages/Dashboard.test.tsx src/pages/Account.test.tsx src/pages/OrderHistory.test.tsx src/pages/SettingsPage.test.tsx src/pages/NotificationsPage.test.tsx src/pages/SubscriptionManagement.test.tsx` passed (`20` tests).

## 401 Unauthorized on create-checkout-session

- **Date:** 2026-02-19
- **Error:** Edge Function returned 401 Unauthorized. Network: `POST https://ADDRESS.supabase.co/functions/v1/create-checkout-session` → 401.
- **Root cause:** Supabase gateway rejects the request before it reaches the function (missing or invalid JWT in `Authorization` header).
- **Reproduction:** Checkout page → select plan → fill form → click "Confirmar pedido".
- **Environment:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`; anon key confirmed correct by user.
- **Fix attempt:**
  1. Explicit auth in `src/lib/checkout.ts`: send `Authorization: Bearer <session.access_token || anon_key>` so the header is always set.
  2. Add `verify_jwt = false` for `create-checkout-session` in `supabase/config.toml` and redeploy so the function accepts requests without JWT verification (function only creates Stripe Checkout session; payment happens on Stripe).
-- **Verification:** After changes, re-test checkout (gift and logged-in flows).

## 401 Unauthorized on create-order (Edge Function)

- **Date:** 2026-03-16
- **Context:** Wiring new `create-order` + `update-shipment-address` Supabase Edge Functions to create `orders` + `shipments` backed by `user_addresses` and `courier_settings`.
- **Error:** Browser network panel showed `POST https://rtnispswkyybiliynezz.supabase.co/functions/v1/create-order 401 (Unauthorized)` even when the user was logged in and Supabase function logs showed both anon and authenticated JWTs present.
- **Initial root cause hypothesis:** The Edge Function's use of `SUPABASE_SERVICE_ROLE_KEY` and `auth.getUser()` was incorrect for this environment; missing or mis-scoped secrets caused auth to fail before our logic ran.
- **Fix attempt 1:** Switch the function client to use `SUPABASE_ANON_KEY` and pass the Authorization header from the browser (`session.access_token || anonKey`) so the function sees the same JWT as PostgREST.
- **Fix attempt 2:** Remove `auth.getUser()` and all explicit user-id checks from the Edge Functions and rely on **RLS** instead:
  - `create-order`:
    - Uses an anon-key client.
    - Queries `user_addresses` without filtering by `user_id`; RLS ensures it only returns rows for the caller.
    - Inserts `orders.user_id` from `addr.user_id` on the selected address row.
    - Inserts a `shipments` snapshot based on that address plus `courier_settings` defaults.
  - `update-shipment-address`:
    - Loads `shipments` joined to `orders` by id; RLS enforces that only shipments belonging to the caller are visible.
    - Applies a cutoff computed from `orders.created_at`.
    - Loads the new address from `user_addresses` without an explicit `user_id` filter; RLS again restricts the result to the caller.
- **Additional instrumentation:** Added `[create-order]` debug logs in the function (request auth header presence, parsed `planId`, address lookup result, and insert errors) and `[checkout]` logs in `src/lib/checkout.ts` around `supabase.functions.invoke("create-order")` and `"create-checkout-session"`.
- **Fix attempt 3 (config.toml `verify_jwt = false`):**
  - Added `[functions.create-order] verify_jwt = false` to `supabase/config.toml`.
  - **Result:** Still 401. Supabase logs confirmed `execution_id: null` (function never ran) and same `deployment_id` suffix `_5`, proving `config.toml` change was NOT applied — user had not yet redeployed, OR `config.toml` is not propagated to the hosted project by a plain `supabase functions deploy`.
- **Root cause (confirmed):** Supabase Edge Function gateway is rejecting the request before the function executes (`execution_id: null`). The `config.toml` `verify_jwt` flag applies only to the **local** Supabase dev runtime; to disable JWT verification on the **hosted** project the function must be deployed with `--no-verify-jwt`.
- **Fix attempt 4 (deploy flag):** `supabase functions deploy create-order --no-verify-jwt`. This explicitly tells the Supabase cloud to skip gateway JWT verification for this function, mirroring the approach that fixed `create-checkout-session`. Data security is still enforced by RLS inside Postgres.
- **Verification:** After deploying with `--no-verify-jwt`, the `deployment_id` suffix should increment (e.g. `_6`), `execution_id` should be non-null in the next log entry, and the function should return 200.

## 502 Bad Gateway on create-checkout-session

- **Date:** 2026-02-19
- **Error:** Edge Function returned 502 Bad Gateway when Stripe API threw (e.g. invalid price ID or secret).
- **Root cause:** Function returns 502 in the `catch` block with a JSON body `{ error: "..." }`; client often cannot show it. Also, the function reads **Supabase Edge Function secrets** (Dashboard), not `.env.local` — so Price IDs must be set in the Dashboard as `price_...`, not in .env.local.
- **Reproduction:** Checkout → fill form → "Confirmar pedido".
- **Fix attempt:** (1) Edge Function now returns **200** with `{ url: null, error: "<message>" }` on Stripe errors so the client can show the message. (2) Setup doc updated with "If you get 502" and clarification that secrets are in Supabase only.
- **Verification:** Redeploy function; set correct Price IDs (`price_...`) in Supabase secrets; re-test checkout.

## 500 on profiles fetch (PostgREST error 42P17)

- **Date:** 2026-02-19
- **Error:** `GET .../rest/v1/profiles?...` returns 500. API body: `{"code":"42P17","message":"infinite recursion detected in policy for relation \"profiles\""}`.
- **Root cause:** The RLS policy **profiles_select_admin** does `EXISTS (SELECT 1 FROM public.profiles p WHERE ...)`. Evaluating that runs a SELECT on `profiles` again, which re-applies RLS and re-evaluates the same policy → infinite recursion.
- **Reproduction:** Log in, open `/admin/registry-editor`; app shows "Could not verify admin access" or redirects home; Network tab shows 500 on the profiles request.
- **Fix:** Run **docs/fix_profiles_rls_42p17.sql** in Supabase SQL Editor (drops `profiles_select_admin`, keeps `profiles_select_own` and `profiles_update_own`). See **docs/ADMIN_REGISTRY_EDITOR.md** §6. Old fix options for other 42P17 cases:
  1. **Table missing:** In **SQL Editor** run `SELECT * FROM public.profiles LIMIT 1;`. If you get "relation does not exist", run **docs/supabase_phase1_profiles_orders_rls.sql** (at least the PROFILES TABLE + RLS sections) to create `public.profiles` with columns `user_id`, `role`, etc.
  2. **Column names differ:** Table Editor may show `id` instead of `user_id`, or different names. The app selects only `user_id, role`. If your table has no `user_id` column, add it or rename to match (or recreate table from the Phase 1 script).
  3. **RLS policy references missing object:** A policy on `profiles` may call a function or reference a table that doesn’t exist (e.g. `get_user_email`, or another table). Create the missing object from the Phase 1 script, or temporarily disable RLS to confirm the 500 goes away, then fix the policy.
- **Verification:** After running the script, reload `/admin/registry-editor`; the profiles request should return 200 and the page should load for an admin user.

## Vitest missing @testing-library/dom

- **Date:** 2026-03-03
- **Context:** Running `npm test -- HeroSection.test.tsx` as part of TDD for the hero rotatingQuotes bug.
- **Error:** Vitest fails with `Cannot find module '@testing-library/dom'` required by `@testing-library/react`.
- **Root cause:** `@testing-library/dom` was not installed even though it is a peer dependency of `@testing-library/react`. A first attempt to install it with `npm install -D @testing-library/dom` failed with an `ERESOLVE` peer-dependency conflict on `eslint` / `eslint-plugin-react-hooks`.
- **Fix:** Install `@testing-library/dom` as a devDependency using `npm install -D @testing-library/dom --legacy-peer-deps` to bypass the peer-dependency conflict for this dev-only library.
- **Verification:** Re-run the relevant Vitest command and confirm the missing-module error is gone and tests execute.

## Delivery windows verification blockers

- **Date:** 2026-03-10
- **Context:** Implementing and verifying the new `When will I receive my Skincare?` landing-page section.
- **Error 1:** A targeted test command failed to spawn with `Command failed to spawn: Aborted`.
- **Root cause 1:** Transient shell/tooling spawn failure while invoking a single-test Vitest command.
- **Fix attempt 1:** Re-ran the tests with a fresh command invocation; the targeted Vitest run completed successfully.
- **Verification 1:** `npm run test -- --run src/components/DeliveryWindowsSection.test.tsx src/lib/delivery-windows.test.ts` passed.

- **Error 2:** Live-page verification initially showed the delivery section was not actually between Experience and Testimonials because Testimonials was not rendering.
- **Root cause 2:** `src/components/TestimonialsSection.tsx` contained a hardcoded `SHOW_TESTIMONIALS = false`, so the section intentionally returned `null`.
- **Fix attempt 2:** Temporarily toggled the gate to `true` for live verification, confirmed placement and interaction behavior, then restored it to `false` per request. Updated the Testimonials test to match the intentional hidden-state final behavior.
- **Verification 2:** Temporary live verification passed with Testimonials enabled; final codebase verification passed with `npm run test -- --run` and `npm run build` after restoring `SHOW_TESTIMONIALS = false`.

## Social auth TDD mock hoisting failure

- **Date:** 2026-03-10
- **Context:** Starting TDD for Google/Facebook sign-in on `Login`, `Register`, and `AuthContext`.
- **Error:** `src/contexts/AuthContext.test.tsx` failed before the intended missing-feature assertion with `ReferenceError: Cannot access 'signInWithOAuth' before initialization`.
- **Root cause:** The Vitest module mock for `@/lib/supabase` was hoisted, but its factory referenced top-level mock bindings before those bindings were initialized.
- **Reproduction:** `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx src/contexts/AuthContext.test.tsx`
- **Fix attempt:** Move the mocked Supabase auth methods into a `vi.hoisted(...)` bag so the factory can safely reference them during mock hoisting.
- **Verification:** Re-run the focused auth/social tests and confirm the AuthContext test reaches the expected assertion path instead of failing on initialization.

## Social auth page-test mock return mismatch

- **Date:** 2026-03-10
- **Context:** Verifying the new Google/Facebook OAuth handlers on the `Login` and `Register` pages.
- **Error:** `Login.test.tsx` and `Register.test.tsx` raised unhandled rejections: `Cannot destructure property 'error' ... as it is undefined`.
- **Root cause:** The `signInWithOAuth` spies in the page tests were clicked successfully, but they did not return the `{ error: null }` shape expected by the new async `handleOAuth` code path.
- **Reproduction:** `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx src/contexts/AuthContext.test.tsx`
- **Fix attempt:** Update the page tests so `signInWithOAuth.mockResolvedValue({ error: null })` matches the real auth method contract.
- **Verification:** Re-run the focused auth/social tests and confirm the provider-click assertions pass without unhandled rejections.

## Social auth page-test async click sequencing

- **Date:** 2026-03-10
- **Context:** Re-running focused tests after adding the OAuth button handlers and fixing the mock return shape.
- **Error:** The page tests still failed because the second provider click was never recorded, and React emitted `act(...)` warnings during the async state updates.
- **Root cause:** The UI sets `socialSubmitting` while the first OAuth call resolves, temporarily disabling the provider buttons. The tests clicked Google and Facebook back-to-back without waiting for the first async state cycle to settle.
- **Reproduction:** `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx src/contexts/AuthContext.test.tsx`
- **Fix attempt:** Update the page tests to await each async OAuth click path before making the next assertion/click, or test one provider per async cycle.
- **Verification:** Re-run the focused auth/social tests and confirm the provider-click assertions pass without `act(...)` warnings.

## Google-only rollout still rendered Facebook

- **Date:** 2026-03-10
- **Context:** Starting the temporary Google-only rollout after Google credentials were added but Facebook credentials were still pending.
- **Error:** The new red-phase assertions in `src/pages/Login.test.tsx` and `src/pages/Register.test.tsx` failed because the Facebook button was still rendered.
- **Root cause:** `src/components/SocialAuthButtons.tsx` still rendered both providers unconditionally, so the approved rollout constraint had not yet been reflected in the UI layer.
- **Reproduction:** `npm run test -- src/pages/Login.test.tsx src/pages/Register.test.tsx`
- **Fix attempt:** Add conditional provider rendering so Google remains available while Facebook is hidden in the UI, keeping the auth-layer OAuth implementation intact for later re-enablement.
- **Verification:** Re-run the focused auth-page tests and confirm Google is visible, Facebook is absent, and the Google click path still reaches `signInWithOAuth("google")`.

## Hostinger deploy mirror still pointed at stale bundles

- **Date:** 2026-03-10
- **Context:** Starting the approved sync of the `Hostinger` deployment folder to the latest page build.
- **Error:** The new regression test `src/hostinger-deploy-sync.test.ts` failed because `Hostinger/index.html` still referenced `/assets/index-Dmx6LUBb.js` and `/assets/index-CNNEYgXU.css` rather than the latest expected entry bundles.
- **Root cause:** The `Hostinger` mirror had not been updated after the most recent frontend changes, so the deployable HTML and entry assets were stale.
- **Reproduction:** `npm run test -- src/hostinger-deploy-sync.test.ts`
- **Fix attempt:** Build the current production output, archive the replaced `Hostinger` entry files into `Hostinger/history`, and copy the latest built files into `Hostinger`.
- **Verification:** Re-run the deploy-sync test and confirm `Hostinger/index.html` references the latest JS/CSS bundle names and those files exist in `Hostinger/assets`.

## Hostinger sync test hardcoded an outdated latest bundle name

- **Date:** 2026-03-10
- **Context:** Refining the new deploy-sync regression test after generating the fresh production build.
- **Error:** The first test version expected `index-DCegv0xG.js` / `index-eTEYPA51.css`, but the new build produced `index-Cm9BMrr-.js` / `index-CNNEYgXU.css`.
- **Root cause:** The test used previously observed bundle hashes instead of deriving the current expected asset references from the fresh `dist/index.html`.
- **Reproduction:** `npm run build` followed by `npm run test -- src/hostinger-deploy-sync.test.ts` with the hardcoded expected bundle names.
- **Fix attempt:** Make the test read `dist/index.html`, extract the current JS/CSS entry assets dynamically, and compare the `Hostinger` mirror against those values.
- **Verification:** Re-run the targeted test and confirm it now only fails when `Hostinger` differs from the latest freshly built `dist` output.

## PowerShell command chaining mismatch during Hostinger sync

- **Date:** 2026-03-10
- **Context:** Inspecting `Hostinger` and `dist` just before the archive/copy step.
- **Error:** A shell command failed with `The token '&&' is not a valid statement separator in this version.`
- **Root cause:** The workspace shell is PowerShell, so the bash-style `&&` separator was not valid in that command context.
- **Reproduction:** Use `Get-ChildItem ... && Get-ChildItem ...` in a `functions.Shell` call on this machine.
- **Fix attempt:** Re-run the inspection command using PowerShell-compatible sequencing such as `;`.
- **Verification:** Confirm the corrected directory-inspection command succeeds and the deployment sync continues normally.

## Hostinger refresh automation missing package shortcut

- **Date:** 2026-03-10
- **Context:** Starting TDD for a one-command Hostinger refresh workflow.
- **Error:** `src/hostinger-sync-script.test.ts` failed because `package.json` had no `hostinger:refresh` script.
- **Root cause:** The Hostinger refresh was still a manual sequence with no package-level command wrapper.
- **Reproduction:** `npm run test -- src/hostinger-sync-script.test.ts`
- **Fix attempt:** Add a package script that wraps the build + Hostinger sync flow into one command.
- **Verification:** Re-run the targeted automation test and confirm the package-script assertion passes.

## Hostinger refresh automation missing PowerShell script

- **Date:** 2026-03-10
- **Context:** The same TDD cycle for Hostinger refresh automation.
- **Error:** `src/hostinger-sync-script.test.ts` failed because `scripts/sync-hostinger.ps1` did not exist.
- **Root cause:** There was no reusable script implementing the timestamped archive + copy behavior for `Hostinger`.
- **Reproduction:** `npm run test -- src/hostinger-sync-script.test.ts`
- **Fix attempt:** Create `scripts/sync-hostinger.ps1` with parameterized `Hostinger`/`dist` paths and timestamped history snapshots.
- **Verification:** Re-run the targeted automation test and confirm the script existence/behavior assertions pass.

## Hostinger refresh PowerShell script param block was in the wrong place

- **Date:** 2026-03-10
- **Context:** Re-running the focused Hostinger automation test after adding the first version of `scripts/sync-hostinger.ps1`.
- **Error:** The script exited non-zero with `StrictModeFunctionCallWithParens` at the `param(` line.
- **Root cause:** PowerShell requires the `param(...)` block to appear before executable statements. The initial script set strict mode and error preference before `param`, so the parser treated `param(` as an invalid function-style call.
- **Reproduction:** `powershell -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\sync-hostinger.ps1 ...`
- **Fix attempt:** Move `param(...)` to the top of the script and apply strict-mode/error settings after parameter declaration.
- **Verification:** Re-run the direct script command and `npm run test -- src/hostinger-sync-script.test.ts` and confirm the script exits cleanly and performs the expected sync.

## Coming soon page split-text test matcher mismatch

- **Date:** 2026-03-10
- **Context:** Verifying the new registry-driven `/coming-soon` page after porting the landing page from the other branch.
- **Error:** `src/pages/ComingSoon.test.tsx` failed even though the page rendered correctly because Testing Library could not find `KumiBox` as a single text node.
- **Root cause:** The page intentionally renders the brand name and social line across styled nested spans (`Kumi` + highlighted `Box`, plus separate handle styling), so an exact single-node text matcher was too strict for the real DOM structure.
- **Reproduction:** `npm run test -- --run src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx src/App.test.tsx`
- **Fix attempt:** Update the test to assert rendered text content for the split brand name and to verify the social handle directly instead of assuming one uninterrupted text node.
- **Verification:** `npm run test -- --run src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx src/App.test.tsx` passed, followed by a full `npm run test` pass.

## Merge conflict broke app startup and blocked commits

- **Date:** 2026-03-10
- **Context:** Investigating why the app would not load locally and why commit/push was blocked after the coming-soon merge work.
- **Error:** Vite and Vitest both failed to parse `src/App.tsx` because merge markers were still present; Git also reported unresolved conflicts (`UU src/App.tsx`, `AA src/pages/ComingSoon.tsx`).
- **Root cause:** The branch was left in a partially merged state. `src/App.tsx` still contained conflict markers for the `/` vs `/coming-soon` routing decision, and `src/pages/ComingSoon.tsx` had an unresolved add/add conflict between the hardcoded imported page and the registry-driven version.
- **Reproduction:** `git status --short --branch` and `npm run test -- --run src/App.test.tsx`
- **Fix attempt:** Resolve both conflicted files by keeping the approved behavior: full site at `/`, coming soon at `/coming-soon`, and the registry-driven `ComingSoon` implementation.
- **Verification:** Re-run `npm run test -- --run src/App.test.tsx src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx` and then the full `npm run test` suite; confirm `git status` no longer reports unmerged files.

## Google sign-in button missing provider affordance

- **Date:** 2026-03-11
- **Context:** Improving the Google-only social sign-in UX so users can recognize the provider more quickly on the auth pages.
- **Error:** The new red-phase test in `src/components/SocialAuthButtons.test.tsx` failed with `Unable to find an element by: [data-testid="google-logo"]`.
- **Root cause:** `src/components/SocialAuthButtons.tsx` rendered the Google action as text-only, so there was no provider icon inside the shared button component used by both `Login` and `Register`.
- **Reproduction:** `npm run test -- --run src/components/SocialAuthButtons.test.tsx`
- **Fix attempt:** Add a shared inline Google SVG logo to `SocialAuthButtons` so every rendered Google button includes a visual provider cue without changing the auth logic.
- **Verification:** `npm run test -- --run src/components/SocialAuthButtons.test.tsx src/pages/Login.test.tsx src/pages/Register.test.tsx` passed.

## Coming soon countdown target still pointed at old launch date

- **Date:** 2026-03-11
- **Context:** Updating the coming-soon countdown to target March 21 at 12:00 PM.
- **Error:** The new red-phase regression test failed because `APP_REGISTRY.comingSoon.launchDateIso` was still `2026-03-01T10:08:00`.
- **Root cause:** The countdown target is registry-driven, but the launch timestamp in `src/config/app-registry.ts` had not been updated to the new requested date/time.
- **Reproduction:** `npm run test -- --run src/pages/ComingSoon.test.tsx`
- **Fix attempt:** Change `APP_REGISTRY.comingSoon.launchDateIso` to `2026-03-21T12:00:00` and re-run the focused test.
- **Verification:** `npm run test -- --run src/pages/ComingSoon.test.tsx` passed.

## Logo rendering still hardcoded to fox emoji

- **Date:** 2026-03-11
- **Context:** Replacing the fox emoji with the real `Logo sin BG.png` asset everywhere the brand logo appears and making those logo instances image-driven in the Registry Editor.
- **Error:** New red-phase tests failed because both `Navbar` and `ComingSoon` still rendered `🦊` instead of an actual logo image, and `RegistryEditor` had no image-picker controls for those logo occurrences.
- **Secondary test failures during implementation:** After the production fix, the original `ComingSoon` text matcher became ambiguous because the container and nested span both resolved to `KumiBox`, and the first `RegistryEditor` test approach depended on Radix tab activation that was unreliable in jsdom for this screen. The tests were tightened to assert the rendered logo image and the editor wiring directly instead of relying on ambiguous text or tab-state behavior.
- **Root cause:** The registry modeled brand logos as text emoji fields (`nav.logoEmoji`, `comingSoon.brand.emoji`) and the UI rendered those fields directly. The editor therefore treated them as generic text content instead of branded image selections.
- **Reproduction:** `npm run test -- --run src/components/Navbar.test.tsx src/pages/ComingSoon.test.tsx src/pages/RegistryEditor.test.tsx`
- **Fix attempt:** Replace emoji-based logo registry fields with image-path fields, render logos through the registry image resolver, and add dedicated image-picker controls for each logo occurrence in `RegistryEditor`.
- **Verification:** `npm run test -- --run src/components/Navbar.test.tsx src/pages/ComingSoon.test.tsx src/pages/RegistryEditor.test.tsx` passed; final `npm run test` passed for the full suite (28 files, 60 tests).

## Coming soon page still showed stale logo/countdown from saved overrides

- **Date:** 2026-03-11
- **Context:** After switching the brand logo to `Logo sin BG.png`, the live coming-soon page still showed a misaligned logo, a `00-00-00-00` countdown, and the editor still surfaced the legacy fox icon path in saved content.
- **Error:** New page-level regression tests showed two failures: the coming-soon brand lockup had no enforced vertical alignment hook, and stale saved content overrides could still carry `comingSoon.brand.emoji`, `nav.logoEmoji`, and the old `2026-03-01T10:08:00` launch date, which overrode the updated defaults.
- **Root cause:** The registry loader accepted version-matching localStorage overrides without schema normalization. That let legacy fields survive after the registry shape changed, so the page and editor could drift from the current code until the user manually reset storage.
- **Reproduction:** `npm run test -- --run src/pages/ComingSoon.test.tsx`
- **Fix attempt:** Add a load-time normalization step in `RegistryContentContext` that migrates legacy logo/countdown overrides to the current schema and persists the cleaned result back to localStorage; update the coming-soon brand lockup to a flex-based centered row.
- **Verification:** `npm run test -- --run src/pages/ComingSoon.test.tsx` passed (5 tests); final `npm run test` passed for the full suite (28 files, 62 tests).

## Footer delivery anchor and how-it-works CTA drift from stale public registry

- **Date:** 2026-03-11
- **Context:** Removing the `Ve un ejemplo de rutina` CTA and fixing the footer `Envíos` link after the live Hostinger build still rendered `href="#"`.
- **Error:** The new red-phase tests failed because `HowItWorksSection` still rendered the sample-routine CTA, and `public/registry.json` still did not expose `Envíos -> #delivery-windows`. A follow-up regeneration attempt using `node --experimental-strip-types` failed immediately with `bad option: --experimental-strip-types`.
- **Root cause:** Two separate sources of truth had drifted: `src/config/app-registry.ts` still defined the CTA, and the deployed/public file-backed registry still contained stale footer/navigation content. The first regeneration attempt also assumed Node could execute TypeScript directly, which this environment does not support.
- **Reproduction:** `npm run test -- --run src/components/HowItWorksSection.test.tsx src/config/get-default-registry.test.ts`; `node --experimental-strip-types --input-type=module -e "..."`.
- **Fix attempt:** Hide the CTA at the source registry level, guard the component so empty CTA data does not render, and regenerate `public/registry.json` from the current TS registry sources using a source-text parsing approach instead of direct TS execution.
- **Verification:** Re-run the focused Vitest command plus `npm run build` after regenerating the public registry.
