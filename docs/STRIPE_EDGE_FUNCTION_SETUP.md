# Stripe Edge Function: Setup & Deploy Guide

This guide walks you through setting up the **create-checkout-session** Supabase Edge Function and configuring Stripe secrets.

---

## Quick start: First-time setup (follow in order)

1. **Get your Stripe Price IDs** (not Product IDs)  
   - Stripe Dashboard → **Product catalog** → open each product (Monthly, Gift, Premium) → **Pricing** tab → copy the **Price ID** (starts with `price_`).  
   - If you only have one price per product, you’ll have three IDs: e.g. `price_xxx`, `price_yyy`, `price_zzz`.

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
   - Add these four (names exactly as below):

   | Name                  | Value |
   |-----------------------|--------|
   | `STRIPE_SECRET_KEY`   | `sk_test_...` (your Stripe secret key) |
   | `STRIPE_PRICE_ID`     | Price ID for **monthly** plan (`price_...`) |
   | `STRIPE_PRICE_ID_GIFT`| Price ID for **gift** plan (`price_...`) |
   | `STRIPE_PRICE_ID_PREMIUM` | Price ID for **premium** plan (`price_...`) |

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

9. **If you get 502 Bad Gateway (or a Stripe error message in the UI)**  
   - The Edge Function gets **STRIPE_SECRET_KEY** and the **Price IDs** from **Supabase Dashboard → Project Settings → Edge Functions → Secrets**, **not** from `.env.local`. Changing `.env.local` does not affect the function.
   - In the Dashboard, set each of the four secrets to the correct value. For the three price secrets, use **Price IDs** (they start with `price_`), not Product IDs (`prod_`). In Stripe: Product catalog → open product → **Pricing** tab → copy the Price ID.
   - If the app shows a Stripe error message under the button, that message comes from Stripe (e.g. invalid price or key). Fix the secret values and try again.
   - To see the exact error in Supabase: **Edge Functions** → **create-checkout-session** → **Logs**, and look for the line `Stripe error: ...`.

---

## 1. What the function does

- **Path:** `supabase/functions/create-checkout-session/index.ts`
- **Method:** POST
- **Body:** `{ planId, successUrl, cancelUrl, clientReferenceId? }`
- **Response:** `{ url }` — redirect the user to this URL for Stripe Checkout.

The function reads **Stripe Price IDs** and **STRIPE_SECRET_KEY** from **Supabase Edge Function secrets** (never from `.env.local`).

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
3. Add these secrets (names must match exactly):

   | Secret name               | Value                                      |
   |---------------------------|--------------------------------------------|
   | `STRIPE_SECRET_KEY`       | Your Stripe secret key (`sk_test_...` or `sk_live_...`) |
   | `STRIPE_PRICE_ID`         | Stripe **Price** ID for monthly plan (e.g. `price_xxx`)  |
   | `STRIPE_PRICE_ID_GIFT`    | Stripe **Price** ID for gift plan          |
   | `STRIPE_PRICE_ID_PREMIUM` | Stripe **Price** ID for premium plan       |

4. In Stripe Dashboard: **Products** → select a product → **Pricing** → copy the **Price ID** (starts with `price_`). Use these in the table above. If you use Product IDs by mistake, the function will return a Stripe error; fix by pasting the correct Price IDs.

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

You should get a JSON response with `"url": "https://checkout.stripe.com/..."`. If you get `"Server configuration error"`, the secret `STRIPE_SECRET_KEY` is missing. If Stripe returns an error, check that the secrets are **Price** IDs (e.g. `price_xxx`), not Product IDs.

---

## 6. Frontend

The app uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`. It calls:

- **URL:** `${VITE_SUPABASE_URL}/functions/v1/create-checkout-session`
- **Headers:** `Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}`, `Content-Type: application/json`
- **Body:** `{ planId, successUrl, cancelUrl, clientReferenceId? }`

No Stripe secret or Price IDs are needed in `.env.local` for the frontend; only the Edge Function needs them in Supabase secrets.
