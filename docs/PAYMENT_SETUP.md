# Payment Integration Setup Guide

## Phase 4: Payment Implementation

This guide covers setting up payment processing for KumiBox using Stripe.

## Why Stripe?

**Recommended:** Stripe is the best choice for your subscription box service because:

✅ **Free Tier:** No monthly fees, only pay per transaction (2.9% + $0.30)
✅ **Subscription Support:** Built-in recurring billing perfect for subscription boxes
✅ **Scalability:** Handles 20 users to 5,000+ users seamlessly
✅ **PCI Compliant:** Stripe handles all PCI compliance requirements
✅ **Developer-Friendly:** Excellent documentation and testing tools
✅ **International:** Supports global payments and currencies

**Alternative:** PayPal (also free tier, but less subscription-friendly)

## Setup Steps

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign in"
3. Create account (free, no credit card required for test mode)
4. Complete business information (can be updated later)

### Step 2: Get API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

3. Copy the **Test mode** keys first (for development)

### Step 3: Configure Environment Variables

Add to your `.env.local`:

```env
# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here  # Backend only - never expose in frontend!
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # For webhook verification
```

**Important:**
- `VITE_STRIPE_PUBLIC_KEY` is safe to use in frontend (it's public)
- `STRIPE_SECRET_KEY` must NEVER be in frontend code (backend only)
- `STRIPE_WEBHOOK_SECRET` is for webhook verification (backend only)

### Step 4: Create Products and Prices in Stripe

1. Go to **Products** → **Add product**
2. Create your subscription box product:
   - **Name:** KumiBox Monthly Subscription
   - **Description:** Your subscription box description
   - **Pricing:** 
     - **Recurring:** Monthly
     - **Price:** $XX.XX (your price)
   - **Billing period:** Monthly

3. Copy the **Price ID** (starts with `price_`) - you'll need this

### Step 5: Set Up Backend Checkout Endpoint (REQUIRED)

**⚠️ IMPORTANT:** You **MUST** set up a backend endpoint to create Stripe checkout sessions. This is **NOT optional** - payments won't work without it.

**Why?** Creating checkout sessions requires your Stripe **secret key**, which must **NEVER** be in frontend code for security reasons.

**Quick Setup:**
- See `docs/BACKEND_CHECKOUT_SETUP.md` for a simple Node.js/Express implementation
- Takes about 5 minutes to set up
- Required endpoint: `POST /api/payment/checkout`

**What the endpoint does:**
1. Receives `priceId`, `successUrl`, `cancelUrl` from frontend
2. Creates Stripe checkout session using secret key
3. Returns `sessionId` and `url` to frontend

---

### Step 6: Configure Webhooks (Optional - For Production)

**Note:** Webhooks are only needed when you have a backend API ready. You can skip this step for now and set it up later.

**How to find Webhooks in Stripe Dashboard:**

1. Log into your Stripe Dashboard: [dashboard.stripe.com](https://dashboard.stripe.com)
2. Look at the **left sidebar menu**
3. Find and click on **"Developers"** (it's usually near the bottom of the sidebar, with an icon that looks like `</>` or a code symbol)
4. In the Developers submenu, click on **"Webhooks"**
5. You should see a page with "Add endpoint" button

**If you can't find "Developers" in the sidebar:**
- Try clicking the menu icon (☰) if the sidebar is collapsed
- Look for it in the top navigation bar
- The URL should be: `https://dashboard.stripe.com/webhooks`

**Setting up a webhook endpoint:**

1. Click **"Add endpoint"** button
2. Set endpoint URL: `https://your-domain.com/api/webhooks/stripe` (replace with your actual domain)
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Click **"Add endpoint"**
5. Copy the **Webhook signing secret** (starts with `whsec_`) - you'll need this for backend verification

**For local development/testing:**
- You can use Stripe CLI to forward webhooks to your local server
- Or use a service like ngrok to expose your local server
- See: [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

## Implementation Plan

### Frontend (This Phase)
- ✅ Stripe.js integration
- ✅ Checkout page with Stripe Elements
- ✅ Payment success/failure pages
- ✅ Subscription management UI

### Backend (Future Phase)
- ⏳ Stripe API integration
- ⏳ Webhook endpoint
- ⏳ Subscription management
- ⏳ Payment method updates

## Testing

### Test Cards (Stripe Test Mode)

Use these cards to test different scenarios:

**Success:**
- `4242 4242 4242 4242` - Visa (any future date, any CVC)

**Requires Authentication:**
- `4000 0025 0000 3155` - Requires 3D Secure

**Declined:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

**Expired:**
- `4000 0000 0000 0069` - Expired card

## Security Best Practices

1. **Never store card data** - Stripe handles this
2. **Always verify webhook signatures** - Prevent fake events
3. **Use HTTPS** - Required for production
4. **Idempotency keys** - Prevent duplicate charges
5. **Test mode first** - Always test before going live

## Next Steps

After setup:
1. Test checkout flow with test cards
2. Verify webhook events are received
3. Test subscription creation
4. Test payment failures and retries
5. Switch to live mode when ready

## Resources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Dashboard Navigation Guide](./STRIPE_NAVIGATION_GUIDE.md) - Detailed guide for finding features in Stripe dashboard