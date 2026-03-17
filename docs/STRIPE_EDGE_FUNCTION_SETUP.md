# Stripe Edge Function: Setup & Deploy Guide

This guide walks you through setting up the **create-checkout-session** Supabase Edge Function and configuring Stripe secrets.

---

## Quick start: First-time setup (follow in order)

1. **Create Stripe Products & Prices**  
   - In Stripe Dashboard → **Product catalog**, create (or use existing) products for **Monthly** and **Premium** subscriptions, and optionally **Gift**.  
   - For each product, add a **Price**:  
     - **Monthly / Premium:** use a **recurring** price (e.g. monthly). Copy the **Price ID** (`price_...`).  
     - **Gift:** use a **one-time** price. Copy the **Price ID** (`price_...`).

2. **Get your Stripe secret key**  
   - Stripe Dashboard → **Developers** → **API keys** → copy **Secret key** (`sk_test_...` for test mode).  
   - Do **not** put it in `.env.local`; it will go in Supabase only.

3. **Install Supabase CLI** (if you don’t have it)  
   - https://supabase.com/docs/guides/cli  
   - Windows (PowerShell): `scoop install supabase` or use the npm option from the docs.

4. **Log in and link your project**  
   ```bash
   supabase login
   supabase link --project-ref rtnispswkyybiliynezz
   ```  
   (Use your real project ref from the dashboard URL: `https://supabase.com/dashboard/project/YOUR_REF`.)

5. **Set Edge Function secrets in Supabase**  
   - Dashboard → **Project Settings** (gear) → **Edge Functions** → **Secrets**.  
   - **Required:** `STRIPE_SECRET_KEY` (`sk_test_...`).  
   - **Required for subscription plans:** `STRIPE_PRICE_ID` (recurring Price ID for monthly).  
   - **Optional:** `STRIPE_PRICE_ID_PREMIUM` (recurring Price ID for premium); if omitted, premium is not offered.  
   - **Optional:** `STRIPE_PRICE_ID_GIFT` (one-time Price ID for gift); if omitted, gift is not offered.

   | Name | Value |
   |------|--------|
   | `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...`) — **required** |
   | `STRIPE_PRICE_ID` | Recurring Price ID for monthly plan (`price_...`) — **required** |
   | `STRIPE_PRICE_ID_PREMIUM` | (Optional) Recurring Price ID for premium. Omit if you don’t offer premium. |
   | `STRIPE_PRICE_ID_GIFT` | (Optional) One-time Price ID for gift. Omit if you don’t offer gift. |

   **Important:** Monthly and premium must be **recurring** prices (subscription). Gift must be a **one-time** price (payment).

6. **Deploy the function** (from your project root, e.g. `WebPage2`)  
   ```bash
   supabase functions deploy create-checkout-session
   ```  
   If the CLI asks for Docker and you don’t use it:  
   ```bash
   supabase functions deploy create-checkout-session --use-api
   ```

7. **Test**  
   - Run your app (`npm run dev`), go to checkout, pick a plan, click **Confirmar pedido**.  
   - You should be redirected to Stripe Checkout.  
   - Or test with curl (see §5 below); replace `YOUR_PROJECT_REF` and `YOUR_ANON_KEY` with your values.

8. **If you get 401 Unauthorized**  
   - This repo sets `verify_jwt = false` for `create-checkout-session` in `supabase/config.toml` so the function can be called without JWT verification.  
   - Redeploy so the config applies:  
     `supabase functions deploy create-checkout-session`  
   - The frontend also sends an explicit `Authorization: Bearer <token>` header (session or anon key).

9. **If you get "payment mode but passed a recurring price" (or 502 / Stripe error in the UI)**  
   - You're on the **Gift** plan but **STRIPE_PRICE_ID_GIFT** is set to a **recurring** price. Stripe requires gift to use a **one-time** price.
   - **Fix:** In [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → open your Gift product → **Pricing** tab. Add a **one-time** price (not “Recurring”). Copy the new Price ID (`price_...`). In **Supabase** → **Project Settings** → **Edge Functions** → **Secrets**, set **STRIPE_PRICE_ID_GIFT** to that one-time Price ID. No need to change code; redeploy only if you want the clearer error message: `supabase functions deploy create-checkout-session`.
   - The Edge Function reads secrets from **Supabase** only, not `.env.local`. Use **Price IDs** (`price_...`), not Product IDs (`prod_`). Monthly/premium = **recurring**; gift = **one-time**.
   - To see the exact error: **Edge Functions** → **create-checkout-session** → **Logs** → look for `Stripe error: ...`.

---

## 1. What the function does

- **Path:** `supabase/functions/create-checkout-session/index.ts`
- **Method:** POST
- **Body:** `{ planId, successUrl, cancelUrl, clientReferenceId? }`
- **Response:** `{ url }` — redirect the user to this URL for Stripe Checkout.

The function uses the **exact Stripe Price ID** for the chosen plan:

- **planId `"monthly"`** → `STRIPE_PRICE_ID` (recurring) → Checkout in **subscription** mode.
- **planId `"premium"`** → `STRIPE_PRICE_ID_PREMIUM` (recurring) → **subscription** mode.
- **planId `"gift"`** → `STRIPE_PRICE_ID_GIFT` (one-time) → Checkout in **payment** mode.

If a plan’s Price ID is not set in secrets, the function returns a clear error. No default product; parameters (price, quantity, mode) are determined per plan from env.

---

## 2. Where the Stripe secret key lives

- **Do not** put `STRIPE_SECRET_KEY` in `.env.local`. Anything with `VITE_` can be exposed to the browser; the secret must stay server-side.
- **Production / hosted:** Store it in **Supabase Edge Function secrets** (see below).
- **Local testing:** Use a `.env` file under `supabase/functions/` or `supabase functions serve --env-file .env.local` (use a file that is in `.gitignore` and never committed).

---

## 3. Set secrets in Supabase (production)

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** → select your project.
2. Go to **Project Settings** (gear) → **Edge Functions** → **Secrets**  
   Or: **Edge Functions** in the left sidebar → **Manage secrets** / **Secrets**.
3. Add secrets (names must match exactly).

   **Required:**
   - `STRIPE_SECRET_KEY` — your Stripe secret key (`sk_test_...` or `sk_live_...`).
   - `STRIPE_PRICE_ID` — **recurring** Stripe Price ID for the monthly plan (`price_...`).

   **Optional (per plan):**
   - `STRIPE_PRICE_ID_PREMIUM` — **recurring** Price ID for premium. Omit if you don’t offer premium.
   - `STRIPE_PRICE_ID_GIFT` — **one-time** Price ID for gift. Omit if you don’t offer gift.

   Subscription Checkout requires **recurring** prices; gift uses **one-time** price.

---

## 4. Deploy the Edge Function

### Option A: Supabase CLI (recommended)

1. **Install Supabase CLI** (if needed):  
   https://supabase.com/docs/guides/cli

2. **Log in and link the project:**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   `YOUR_PROJECT_REF` is in the dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`.

3. **Deploy the function:**
   ```bash
   supabase functions deploy create-checkout-session
   ```
   If Docker is not available, use:
   ```bash
   supabase functions deploy create-checkout-session --use-api
   ```

4. **Invoke URL (after deploy):**
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-checkout-session
   ```
   The frontend will call this URL with the Supabase anon key in the `Authorization` header.

### Option B: Supabase Dashboard

1. In the dashboard, go to **Edge Functions**.
2. Create a new function (or upload/zip the contents of `supabase/functions/create-checkout-session/`).
3. Name it `create-checkout-session` and deploy. Then set the same secrets as in §3.

---

## 5. Test the function

After deploy and secrets are set:

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-checkout-session" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"planId":"monthly","successUrl":"https://yoursite.com/checkout/success","cancelUrl":"https://yoursite.com/checkout/cancel"}'
```

You should get a JSON response with `"url": "https://checkout.stripe.com/..."`. If you get `"Server configuration error"`, the secret `STRIPE_SECRET_KEY` is missing. If you get a message that the plan is not configured, set the matching `STRIPE_PRICE_ID` (or `STRIPE_PRICE_ID_PREMIUM` / `STRIPE_PRICE_ID_GIFT`). If Stripe returns an error, ensure monthly/premium use **recurring** prices and gift uses a **one-time** price.

---

## 6. Frontend

The app uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`. It calls:

- **URL:** `${VITE_SUPABASE_URL}/functions/v1/create-checkout-session`
- **Headers:** `Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}`, `Content-Type: application/json`
- **Body:** `{ planId, successUrl, cancelUrl, clientReferenceId? }`

No Stripe secret or Price IDs are needed in `.env.local` for the frontend; only the Edge Function needs them in Supabase secrets.
