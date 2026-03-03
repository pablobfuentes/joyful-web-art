# Failure log

## 401 Unauthorized on create-checkout-session

- **Date:** 2026-02-19
- **Error:** Edge Function returned 401 Unauthorized. Network: `POST https://rtnispswkyybiliynezz.supabase.co/functions/v1/create-checkout-session` → 401.
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
