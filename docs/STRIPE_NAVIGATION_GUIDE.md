# Stripe Dashboard Navigation Guide

## Finding Key Features in Stripe Dashboard

### 1. API Keys Location

**Path:** Developers → API keys

**Step-by-step:**
1. Log into [dashboard.stripe.com](https://dashboard.stripe.com)
2. Look at the **left sidebar** (if collapsed, click the menu icon ☰)
3. Scroll down and find **"Developers"** (usually near the bottom)
4. Click **"Developers"** to expand the submenu
5. Click **"API keys"**
6. You'll see:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`) - click "Reveal" to see it

**Direct URL:** `https://dashboard.stripe.com/apikeys`

---

### 2. Products & Prices Location

**Path:** Products → Add product

**Step-by-step:**
1. In the left sidebar, find **"Products"** (usually near the top)
2. Click **"Products"**
3. Click the **"+ Add product"** button (top right)
4. Fill in product details and pricing
5. After creating, you'll see the **Price ID** (starts with `price_`)

**Direct URL:** `https://dashboard.stripe.com/products`

---

### 3. Webhooks Location

**Path:** Developers → Webhooks

**Step-by-step:**
1. In the left sidebar, find **"Developers"** (near the bottom)
2. Click **"Developers"** to expand
3. Click **"Webhooks"**
4. You'll see existing webhooks or an empty list
5. Click **"Add endpoint"** to create a new webhook

**Direct URL:** `https://dashboard.stripe.com/webhooks`

**If you can't find it:**
- Make sure you're logged in
- Check if your sidebar is collapsed (click ☰ to expand)
- Try the direct URL above
- Look for the `</>` icon which represents "Developers"

---

### 4. Test Mode vs Live Mode

**Toggle Location:** Top right of the dashboard

**Step-by-step:**
1. Look at the **top right corner** of the Stripe dashboard
2. You'll see a toggle switch that says **"Test mode"** or **"Live mode"**
3. Click it to switch between modes
4. **Important:** Use **Test mode** for development!

**What's the difference?**
- **Test mode:** Uses test API keys (`pk_test_`, `sk_test_`), no real charges
- **Live mode:** Uses live API keys (`pk_live_`, `sk_live_`), real charges

---

## Quick Links

- **Dashboard Home:** [dashboard.stripe.com](https://dashboard.stripe.com)
- **API Keys:** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
- **Products:** [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
- **Webhooks:** [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
- **Documentation:** [stripe.com/docs](https://stripe.com/docs)

---

## Common Issues

### "I can't see the Developers menu"
- Make sure you're logged in
- Try refreshing the page
- Check if your account has the right permissions
- Try the direct URLs above

### "I can't find Webhooks"
- It's under **Developers** → **Webhooks**
- Make sure you've expanded the Developers section
- Try the direct URL: `https://dashboard.stripe.com/webhooks`

### "I don't see Test mode toggle"
- Make sure you're on the main dashboard page
- It's in the top right corner
- Some accounts might have it in a different location

---

## Need More Help?

- [Stripe Support](https://support.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Community](https://github.com/stripe/stripe-node/discussions)
