# Plan: Checkout → Stripe, User DB & Admin View

**Date:** 2026-02-18  
**Scope:** Review subscription/checkout, add user DB + admin view, connect "Confirmar pedido" to Stripe Checkout.  
**Constraints:** Workflow (VMP) — config-driven copy in `app-registry.ts`, files &lt;300 lines, TDD, security review, CHANGELOG_AI + FAILURE_LOG.

**Phase 1 (done):** Supabase tables + RLS + views only. See **`docs/ADMIN_AND_ORDERS_SETUP.md`** and **`docs/supabase_phase1_profiles_orders_rls.sql`**. Admin = `profiles.role` + RLS (no hidden route).

---

## 1. Current State (Review)

### 1.1 Subscription section (Dashboard)
- **Done:** Stats cards (Subscription: Active, Next Box: —), Quick Actions (Order history, Subscription, Settings, Notifications). All copy from `app-registry.ts`. Same card style as Account Information.
- **Gaps:** Quick Action links point to `#` (no routes). Next Box and Subscription are static (no data from DB). No connection to orders or Stripe subscription status yet.

### 1.2 Checkout page
- **Done:** Plan selection via `?plan=`, form (name, email, address, city, state, zip), order summary, "Confirmar pedido" button, success state (local only). All labels from `app-registry.checkout`. Style consistent with site.
- **Gaps:** "Confirmar pedido" only sets `setSubmitted(true)` — no API call, no Stripe, no persistence. No `/checkout/success` or `/checkout/cancel` routes. No Stripe.js in project (no `@stripe/stripe-js` in package.json).

### 1.3 User database & admin
- **Done:** Supabase Auth only (`auth.users`). Docs describe viewing users in Supabase Dashboard or via Admin API (service role).
- **Gaps:** No `orders` (or `subscriptions`) table. No in-app admin page for you to see users and orders. No RLS or tables for order/address data.

### 1.4 Stripe
- **Done:** `.env.local` has `VITE_STRIPE_PUBLIC_KEY` and `VITE_STRIPE_PRICE_ID` (single price).
- **Gaps:** No backend to create Checkout Sessions (secret key must not be in frontend). No Stripe SDK usage in code. Plans in registry (gift, monthly, premium) have no `stripePriceId` mapping.

---

## 2. What We Will Implement

### 2.1 Review and small fixes (no new backend)
- **Checkout:** Keep current form and success UX. Add optional prefill from `useAuth()` (email, name) when user is logged in.
- **Copy:** Any new strings (e.g. success/cancel page, Stripe loading/error) in `app-registry.ts`.
- **Subscription section:** Leave as-is for now or add registry keys for "Order history" / "Subscription" hrefs (e.g. `#order-history`, `/dashboard`); no backend yet for real data.

### 2.2 User database (Supabase) — Phase 1 done

- **Phase 1 (today):** Supabase Table Editor + saved SQL views only (zero app code for admin).
  - **Tables:** `public.profiles` (user_id PK, role, full_name, avatar_url, timestamps); `public.orders` (id, user_id, plan_id, stripe_session_id, status, shipping_*, timestamps). See `docs/supabase_phase1_profiles_orders_rls.sql`.
  - **Admin = real authorization + DB enforcement:** Admin privileges via `profiles.role` (`'user'` | `'admin'`). RLS policies: users read/update own profile; users insert/read/update own orders; only rows where current user has `profiles.role = 'admin'` can read all orders and all profiles. No hidden route — access enforced by RLS; later `/admin/*` routes will check role in app but RLS remains the control layer.
  - **Trigger:** On `auth.users` insert, auto-create `profiles` row with `role = 'user'`.
  - **Saved view:** `admin_orders_with_customer` (orders + customer name + email via SECURITY DEFINER helper). Use in SQL Editor or Table Editor.
  - **Setup:** Run migration in SQL Editor; backfill existing users; assign first admin with `update profiles set role = 'admin' where user_id = (select id from auth.users where email = '...')`. Full steps in `docs/ADMIN_AND_ORDERS_SETUP.md`.
- **Later (in-app admin):** Route `/admin/*` protected by checking `profiles.role` (e.g. from Supabase select). RLS still enforces so direct API access is blocked for non-admins.

### 2.3 Connect "Confirmar pedido" to Stripe Checkout
- **Backend required:** Create Stripe Checkout Session with secret key. Options:
  - **A) Supabase Edge Function:** `POST /functions/v1/create-checkout-session` with body `{ planId, successUrl, cancelUrl, shipping* }`. Uses Stripe SDK and `STRIPE_SECRET_KEY` (env in Supabase). Returns `{ url }`; frontend redirects to `url`.
  - **B) Separate backend (e.g. Node/Express):** As in `docs/PAYMENT_SETUP.md`: `POST /api/payment/checkout` that creates session and returns `url`. Backend runs elsewhere (e.g. Vercel serverless, or your server).
- **Frontend flow:**
  1. User fills form and clicks "Confirmar pedido".
  2. Optional: save order to Supabase `orders` with status `pending` (user_id from auth, shipping from form).
  3. Call backend to create Checkout Session (with `priceId` from plan mapping, `success_url`, `cancel_url`; optionally pass `client_reference_id` = order id).
  4. Redirect to Stripe hosted checkout (`window.location.href = url`).
  5. After payment: Stripe redirects to `success_url` (e.g. `/checkout/success?session_id={CHECKOUT_SESSION_ID}`). Success page can show confirmation and optionally update order status via backend/webhook.
  6. Cancel: redirect to `cancel_url` (e.g. `/checkout/cancel`).
- **Plan → Price ID:** In `app-registry.ts` extend `pricing.plans` with optional `stripePriceId` (or use a small map in code from plan id to env `VITE_STRIPE_PRICE_ID` for monthly; add more env vars for gift/premium if needed). Backend receives `planId` and resolves to Stripe Price ID.

### 2.4 Success / Cancel pages
- **Routes:** `/checkout/success`, `/checkout/cancel` (and optionally `/checkout/success?session_id=...`).
- **Success:** Copy from registry ("¡Pedido confirmado! Revisa tu email…"). Optional: fetch session or order by `session_id` to show plan/amount (requires backend).
- **Cancel:** Copy from registry ("Has cancelado. Puedes volver a intentar."), link back to `/checkout` or `/#pricing`.

### 2.5 VMP & workflow
- All new user-facing strings in `app-registry.ts` (checkout success/cancel, admin page titles, table headers, etc.).
- New files under 300 lines; extract hooks (e.g. `useCreateCheckoutSession`, `useOrders`) if needed.
- TDD: at least one test per new flow (e.g. Checkout redirects to Stripe when backend returns url; Admin shows table when user is admin; success page renders).
- Security: no secret key in frontend; admin route restricted; validate/sanitize inputs.
- Update `docs/CHANGELOG_AI.md` per feature; log failures in `docs/FAILURE_LOG.md`.

---

## 3. Suggested Order of Work

| Phase | Task | Depends on |
|-------|------|------------|
| 1 ✅ | Supabase: profiles + orders tables, RLS, trigger, saved view; admin via profiles.role (Table Editor + SQL only) | — |
| 2 | Backend: create Checkout Session (Edge Function or Node) | Stripe account, secret key |
| 3 | app-registry: new keys (success/cancel pages, admin, Stripe loading/error) | — |
| 4 | Checkout: call backend on "Confirmar pedido", redirect to Stripe; optional save order to DB before redirect | Phase 1, 2, 3 |
| 5 | Add `/checkout/success` and `/checkout/cancel` pages | Phase 3 |
| 6 | Admin page: list orders (and optionally users) from Supabase | Phase 1, 3 |
| 7 | Plan → Stripe Price ID mapping (registry or env) | Phase 2 |
| 8 | Tests + security review + CHANGELOG_AI | All |

---

## 4. Improvement Suggestions

1. **Single price today:** You have one `VITE_STRIPE_PRICE_ID`. Map `monthly` (and optionally `premium`/`gift`) to Stripe Price IDs (e.g. create 3 prices in Stripe, add to env or registry) so "Confirmar pedido" sends the correct price.
2. **Prefill checkout:** If user is logged in, prefill email and name from `useAuth()` to reduce friction.
3. **Admin protection:** ✅ Implemented via `profiles.role` + RLS (no hidden route, no env allowlist). See `docs/ADMIN_AND_ORDERS_SETUP.md`.
4. **Webhook later:** After Checkout Session is completed, Stripe can call your backend to update `orders.status` to `completed` and optionally attach `stripe_session_id`. That can be Phase 2 so success page or "Order history" can show real status.
5. **Order history link:** Point Quick Action "Order history" to a new route (e.g. `/dashboard/orders`) that lists the current user's orders from `orders` table (optional, after Phase 1).

---

## 5. What I Need From You (Before Implementation)

1. **Backend choice:** Prefer **Supabase Edge Function** (one place with Supabase) or **separate Node/Express** (or other) server? If Edge Function: confirm you can set secrets (e.g. `STRIPE_SECRET_KEY`) in Supabase project.
2. **Stripe:** Confirm you have (or will add) `STRIPE_SECRET_KEY` and, if multiple plans, separate Price IDs for gift / monthly / premium.
3. **Admin:** ✅ Done. Real authorization: `profiles.role` + RLS (no hidden route). See `docs/ADMIN_AND_ORDERS_SETUP.md`.
4. **Vibe check:** Approve this plan (or specify changes); then we proceed phase by phase with tests and VMP compliance.

---

*Next: After your approval and answers to §5, we implement in the order of §3 and follow the workflow (TDD, app-registry, &lt;300 lines, CHANGELOG_AI, FAILURE_LOG).*
