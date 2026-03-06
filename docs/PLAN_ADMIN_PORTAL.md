# Admin Portal – Phase 1: Plan and Proposals

**Status:** Awaiting approval. No implementation until this plan is explicitly approved.

---

## 1. System analysis (current state)

| Area | Current state |
|------|----------------|
| **Auth** | Supabase Auth; JWT in session; `AuthProvider` + `useAuth()` for current user. |
| **RBAC** | `public.profiles` with `role` in (`user`, `admin`). `AdminRoute` + `useProfile()` enforce admin for `/admin/registry-editor`. No backend/API role checks beyond RLS. |
| **Profiles** | `user_id`, `role`, `full_name`, `avatar_url`, `created_at`, `updated_at`. No phone, no dedicated address table. |
| **Orders** | `public.orders`: `id`, `user_id`, `plan_id`, `stripe_session_id`, `status` (pending/completed/cancelled), shipping_* fields, `created_at`, `updated_at`. RLS: own insert; own or admin select; own pending or admin update. No link to “subscription” or “cycle”. |
| **Customer UI** | Dashboard, Order History, Subscription, Settings, Notifications. Order/subscription data currently from **test-user-data** (in-memory); no Supabase reads for orders/subscriptions yet. |
| **Checkout** | Edge Function `create-checkout-session` for Stripe; success/cancel pages. Order creation may happen in Edge Function or success handler—to be confirmed. |
| **Admin UI** | Only Registry Editor at `/admin/registry-editor`; no customer/order/subscription management. |

**Gaps for admin portal:** No subscriptions table, no order_items, no products table, no addresses table (shipping on orders), no admin_notes, no audit_logs, no “next order” or payment status for next shipment. Customer dashboard does not yet read real subscription/order data from Supabase.

---

## 2. Proposed implementation plan (ordered checklist)

Execution order only after **explicit approval**. Deviations require a plan update and re-approval.

### 2.1 Database and backend (Supabase)

- [x] **DB-1** Document current `orders` creation flow (Edge Function and/or frontend) and where to attach `subscription_id` if we introduce subscriptions. → See `docs/ORDERS_CREATION_FLOW.md`.
- [x] **DB-2** Add migration script (single SQL file) that: … → `docs/supabase_admin_portal_phase2_migration.sql` (profiles extended; subscriptions, products, order_items, admin_notes, audit_logs; orders extended; backfill order_status/payment_status).
- [x] **DB-3** Add RLS policies: … → In same migration file (subscriptions, products, order_items, admin_notes, audit_logs).
- [x] **DB-4** Add helper/view for admin list: … → View `public.admin_customers_list` (security_invoker = on).
- [x] **DB-5** Add triggers or application logic to write to `audit_logs` … → Triggers on subscriptions, orders, admin_notes; function `audit_log_insert()`.

### 2.2 Auth and access control

- [ ] **AUTH-1** Keep using `profiles.role = 'admin'` and existing `AdminRoute` + `useProfile()` for admin UI route protection.
- [ ] **AUTH-2** Enforce admin at data layer: all admin-only data accessible only via RLS that checks `profiles.role = 'admin'` (no “admin API” that trusts frontend only).
- [ ] **AUTH-3** Ensure customer-facing queries (orders, subscription, profile) only return rows where `auth.uid() = user_id` (or equivalent); admin views use separate policies that allow `role = 'admin'`.
- [ ] **AUTH-4** Add server-side role check in any Supabase Edge Function used for admin actions (if we add admin mutations via Edge Functions). Otherwise perform admin updates via Supabase client with RLS so that only admin users can update.

### 2.3 Admin portal UI (frontend)

- [x] **UI-1** Add admin layout and route group under `/admin` … → `AdminLayout` with nav (Overview, Customers, Registry Editor); routes `/admin`, `/admin/customers`, `/admin/customers/:userId`; all wrapped in `AdminRoute`.
- [x] **UI-2** **Admin overview page** (`/admin`): … → KPI cards from Supabase (subscriptions + orders counts); error message if migration not run.
- [x] **UI-3** **Customers / subscriptions table** (`/admin/customers`): … → Table from `admin_customers_list`; sort (name, email, subscription_status, next_shipping_at, last_update); search (name/email); pagination; View → customer detail.
- [x] **UI-4** **Customer detail page** (`/admin/customers/:id`): … → Tabs: Profile, Subscription, Next Order, Order History, Shipment History, Notes, Audit Log; loads profile, email (from view), subscriptions, orders+order_items, admin_notes, audit_logs.
- [x] **UI-5** **Edit modals/forms**: … → Update subscription status; update order status; add tracking (carrier, tracking_number, shipped_at); add internal note. Persist via Supabase; query invalidate + toast.
- [x] **UI-6** Export table to CSV … → Button "Export CSV" on customers table; exports current page rows (client-side).

### 2.4 Customer dashboard sync

- [ ] **SYNC-1** Introduce data layer for customer-facing dashboard: replace or complement test-user-data with Supabase reads for `profiles`, `subscriptions` (own), `orders` (own), `order_items` (own). Keep test-user-data as fallback or remove once real data exists.
- [ ] **SYNC-2** Customer dashboard shows: subscription status, next shipment status, next billing date, next shipment date, (optional) products in next shipment, tracking when shipped, latest order updates. All from Supabase with RLS so users see only their data.
- [ ] **SYNC-3** Ensure admin updates (order status, tracking, subscription status) are written to the same tables/columns that the customer dashboard reads; no separate “customer view” table—single source of truth. *(Deferred: customer dashboard still uses test-user-data; schema ready for SYNC.)*

### 2.5 Audit and safety

- [x] **AUDIT-1** Log sensitive changes … → Triggers on `subscriptions`, `orders`, `admin_notes` write to `audit_logs` (function `audit_log_insert`).
- [x] **AUDIT-2** Show audit log in admin customer detail … → Audit Log tab in AdminCustomerDetail.

### 2.6 Automation and QoL (optional / follow-up)

- [ ] **QoL-1** Automatic `updated_at` (and where applicable `packed_at`/`shipped_at`/`delivered_at`) on status change.
- [ ] **QoL-2** Warning badges in admin table/detail: failed payment, missing address, no products on next order, overdue shipment.
- [ ] **QoL-3** Email hooks (payment failed, packed, shipped, delivered): document as future work or stub; implement only if approved (may require Edge Function + email provider).

### 2.7 Testing and logs

- [ ] **TEST-1** Verify only admin users can open `/admin` and child routes; non-admin gets “Admin access required” (existing AdminRoute behavior).
- [ ] **TEST-2** Verify non-admin cannot read other users’ data via Supabase (RLS) by testing with anon/role keys or second user.
- [ ] **TEST-3** Test CRUD: update subscription status, order status, add tracking, add note; confirm customer dashboard reflects order/subscription updates.
- [ ] **TEST-4** Test edge cases: no next order, paused subscription, failed payment; ensure UI and RLS behave correctly.
- [x] **LOG** ChangeLog updated for Admin Portal Phase 2; FAIL_LOG used if any failure occurs.

---

## 3. Database / schema proposal

**Principle:** Extend existing tables where it fits; add new tables for subscriptions, line items, products, notes, and audit. One source of truth for customer- and admin-facing reads.

### 3.1 Existing tables to extend

**profiles** (existing)

- Keep: `user_id`, `role`, `full_name`, `avatar_url`, `created_at`, `updated_at`.
- Add (nullable): `phone`, `country`, `state`, `city`, `postal_code`, `address_line` (or keep shipping only on orders and add a dedicated `addresses` table if you want multiple addresses per user).

**orders** (existing)

- Keep: `id`, `user_id`, `plan_id`, `stripe_session_id`, `created_at`, `updated_at`, and existing shipping_*.
- Add: `subscription_id` (FK to subscriptions, nullable for legacy orders), `cycle_label` (e.g. "2026-03"), `order_status` text check (pending, paid, packing, shipped, delivered, delayed, issue), `payment_status` text (e.g. pending, paid, failed), `packed_at`, `shipped_at`, `delivered_at` timestamptz, `tracking_number` text, `carrier` text, `fulfillment_notes` text.
- Consider renaming or keeping current `status` and map to `order_status` to avoid breaking existing code; migration can backfill `order_status` from `status`.

### 3.2 New tables

**subscriptions**

- `id` uuid PK, `user_id` uuid FK auth.users, `plan_id` text, `cadence` text (monthly, bimonthly, etc.), `status` text check (active, paused, pending, canceled, trial, past_due), `started_at`, `next_billing_at`, `next_shipping_at`, `canceled_at`, `paused_at`, `cancellation_reason` text, `payment_status_for_next_shipment` text (yes/no/pending/failed), `failed_payment_attempts` int default 0, `created_at`, `updated_at`.
- RLS: user read own; admin select/insert/update.

**products**

- `id` uuid PK, `sku` text unique, `name` text, optional fields (description, etc.). Used for reference; order_items can store snapshot.

**order_items**

- `id` uuid PK, `order_id` uuid FK orders, `product_id` uuid FK products nullable, `sku` text, `product_name_snapshot` text, `quantity` int not null, `created_at`/`updated_at`.
- RLS: admin full; user select own (via order ownership).

**admin_notes**

- `id` uuid PK, `user_id` uuid FK auth.users (or `order_id` if you prefer note-per-order), `body` text, `created_by` uuid FK auth.users, `created_at` timestamptz. Prefer one table for “notes about a user” so admin can attach notes to customer.
- RLS: admin only (select, insert; update/delete optional).

**audit_logs**

- `id` uuid PK, `entity_type` text (e.g. 'subscription', 'order', 'profile'), `entity_id` uuid, `action` text (e.g. 'status_change'), `old_value` jsonb, `new_value` jsonb, `changed_by` uuid FK auth.users, `changed_at` timestamptz.
- RLS: admin select; insert via trigger or backend (never by arbitrary client to avoid spoofing).

### 3.3 Admin list data source

- Create a **view** or **RPC** that joins profiles + subscriptions + “next order” (e.g. next order per subscription by next_shipping_at or cycle) + last shipment, and returns one row per customer (or per subscription) with: full name, email, phone, full address, plan, subscription status, next billing/shipping date, payment status for next shipment, next order status, last shipped cycle, tracking, last update. Secure with RLS (view with security_invoker = on) so only admins see it.

### 3.4 Customer-facing “next order” and history

- Customer dashboard reads: own profile, own subscription(s), own orders (and order_items) filtered by user_id. “Next order” = subscription’s next cycle order (e.g. order where order_status in (pending, paid, packing) and subscription_id = X), or derived from subscription.next_shipping_at and a matching order.

---

## 4. RBAC / auth approach

- **Frontend:** Keep `AdminRoute` and `useProfile()`. All routes under `/admin/*` render only when `profile?.role === 'admin'`. Non-admin users are shown “Admin access required” and not given links to admin pages.
- **Backend (Supabase):** No separate “admin API” key. Use the same Supabase client with the logged-in user’s JWT. RLS does the following:
  - **profiles:** User can select/update own row; admin can select all.
  - **subscriptions:** User can select own; admin can select/insert/update/delete (as needed).
  - **orders:** User can select own, insert own; admin can select/update all (and insert if needed). Restrict user update to “own pending” only.
  - **order_items:** User can select where order is own; admin can select/insert/update/delete.
  - **admin_notes:** Only admin can select/insert (and optionally update/delete).
  - **audit_logs:** Admin select only; insert only via trigger or a single Edge Function that validates auth.uid() and role.
- **Edge Functions:** If admin actions are done via Edge Functions, validate JWT and then check `profiles.role = 'admin'` (via service role or a small RPC) before performing mutations.
- **Sensitive data:** Customer PII (name, email, phone, address) appears only in admin views and in the customer’s own dashboard; never in public or non-admin API responses. RLS guarantees that non-admin users cannot read other users’ data.

---

## 5. Main UI sections (admin portal)

1. **Admin overview** (`/admin`)  
   - KPI cards: active subscriptions, upcoming shipments, failed payments, orders pending fulfillment, delayed shipments.  
   - Optional: short list of “attention needed” (e.g. failed payment, missing tracking).

2. **Customers table** (`/admin/customers`)  
   - Table: full name, email, phone, plan, subscription status, next billing/shipping, payment status for next shipment, next order status, last shipped, tracking, last update.  
   - Sortable columns, filters (name, email, subscription status, order status, payment status, next shipment date, plan), pagination.  
   - Row action: open customer detail.

3. **Customer detail** (`/admin/customers/:userId`)  
   - Tabs or sections: Profile, Subscription, Next Order, Order History, Shipment History, Notes, Audit Log.  
   - Profile: view/edit name, email, phone, address (from profile or orders).  
   - Subscription: view/edit status, dates, payment status for next shipment.  
   - Next order: status, assign products (order_items), tracking, fulfillment notes.  
   - Order history: list orders with status, dates, link to items.  
   - Shipment history: orders that are shipped/delivered with tracking and items.  
   - Notes: list/add internal admin notes.  
   - Audit log: list changes for this customer/orders.

4. **Modals/forms (from customer detail or table)**  
   - Update subscription status.  
   - Update order status.  
   - Add/edit order items (product, SKU, name snapshot, quantity).  
   - Add/edit tracking (carrier, tracking number, shipped_at, estimated delivery).  
   - Add internal note.

5. **Export**  
   - Button to export current table (filtered/sorted) to CSV.

---

## 6. Risks, edge cases, and mitigations

| Risk / edge case | Mitigation |
|------------------|------------|
| Customer has active account but failed payment | Show `payment_status_for_next_shipment = failed` and warning; allow admin to mark “retry” or “past_due”; do not treat as “active” for fulfillment until paid. |
| Customer paused subscription | Subscription status = paused; “next order” may be null or still show with status “on hold”; UI distinguishes paused. |
| Customer canceled after paying but before shipment | Order remains with payment_status paid; order_status can be set to canceled/issue; subscription canceled; no new cycles. |
| Customer changed address after order creation | Store shipping on order at creation; allow admin to see “current” address from profile or latest order; optionally add “ship to latest address” for next order. |
| Order shipped with substituted products | order_items store actual shipped product (SKU/name snapshot); no need to match original plan exactly. |
| Multiple admin edits on same order | audit_logs per change; last write wins for status/tracking; consider optimistic locking (version column) if needed later. |
| No next order generated yet | UI shows “No next order”; admin can create next order for subscription or show “Generate next order” when billing/shipping date is due. |
| Customer has historical orders but no active subscription | Subscription status canceled or missing; order history still visible; “next order” empty. |
| RLS misconfiguration exposes other users’ data | Test with second user and anon key; document RLS matrix; code review all policies. |
| Audit log spoofing | Only allow insert via trigger or a single trusted path (e.g. Edge Function that checks admin and writes log). |

---

## 7. Suggested improvements (backlog / post-MVP)

- **Addresses table:** Normalize to `addresses` (user_id, label, line, city, state, zip, country) and reference from orders and profile for “default shipping.”
- **Email triggers:** Payment failed, order packed, shipped, delivered—implement via Edge Function + email provider after schema and admin flows are stable.
- **Bulk actions:** E.g. “Mark selected as packed” or “Export selected” for fulfillment batches.
- **Real-time:** Use Supabase Realtime for admin table or customer detail so multiple admins see updates (optional).
- **Version/optimistic lock:** Add `updated_at` or version to orders/subscriptions and check before update to avoid overwriting concurrent admin edits.

---

## 8. Deliverable format compliance

- **Phase 1 (this document):** System analysis (§1), implementation plan (§2), database proposal (§3), auth/RBAC (§4), UI sections (§5), risks/edge cases (§6), improvements (§7).
- **Phase 2:** To be executed **only after explicit approval** of this plan. Implementation order: backend/migrations and RLS → admin UI (overview, table, detail, modals) → customer dashboard sync → audit logging → tests and logs.

---

**Next step:** Review this plan. Once approved, implementation will follow the checklist in §2 and maintain FAIL_LOG and ChangeLog per workflow. Any change to scope or order will be proposed as a plan update before coding.
