# Failure log

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
- **Verification:** After changes, re-test checkout (gift and logged-in flows).

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

## Coming soon page split-text test matcher mismatch

- **Date:** 2026-03-10
- **Context:** Verifying the new registry-driven `/coming-soon` page after porting the landing page from the other branch.
- **Error:** `src/pages/ComingSoon.test.tsx` failed even though the page rendered correctly because Testing Library could not find `KumiBox` as a single text node.
- **Root cause:** The page intentionally renders the brand name and social line across styled nested spans (`Kumi` + highlighted `Box`, plus separate handle styling), so an exact single-node text matcher was too strict for the real DOM structure.
- **Reproduction:** `npm run test -- --run src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx src/App.test.tsx`
- **Fix attempt:** Update the test to assert rendered text content for the split brand name and to verify the social handle directly instead of assuming one uninterrupted text node.
- **Verification:** `npm run test -- --run src/pages/ComingSoon.test.tsx src/components/AdminLayout.test.tsx src/App.test.tsx` passed, followed by a full `npm run test` pass.
