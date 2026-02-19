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
