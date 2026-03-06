# Orders creation flow (DB-1)

**Purpose:** Document where `public.orders` rows are created so admin portal schema and subscription_id attachment are correct.

## Current state

- **Frontend:** `CheckoutSuccess` does not write to the database; it only shows a success message and navigates. No client-side insert into `orders`.
- **Edge Function `create-checkout-session`:** Creates a Stripe Checkout Session only (`stripe.checkout.sessions.create`). It does **not** insert into `public.orders`.
- **Repo:** No code in this repository performs `insert` into `public.orders`. The existing RLS allows users to insert their own orders (`orders_insert_own`).

## Implication for admin portal

- Order creation is expected to happen outside this repo (e.g. Stripe webhook handler or another Edge Function that writes to `public.orders` after payment success).
- The migration adds new columns to `orders` (`subscription_id`, `cycle_label`, `order_status`, `payment_status`, tracking, etc.). Existing rows can have these as null; new orders (from future webhook or success handler) can set `subscription_id` when a subscription exists.
- When implementing subscription lifecycle later: create or update a row in `subscriptions` when the user subscribes, and set `orders.subscription_id` when creating an order for that subscription.

## Where to attach subscription_id

- When an order is created (e.g. in a Stripe webhook or post-checkout Edge Function): if the payment is for a subscription cycle, set `order.subscription_id` to the corresponding `subscriptions.id` and set `cycle_label` (e.g. "2026-03").
