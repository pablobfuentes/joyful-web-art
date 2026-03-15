# Proposed Plan: Admin-Only Export Users CSV

## Goal
Add an admin-only “Export Customer Data” feature that generates and downloads a single CSV file with one row per user and all useful customer/operations fields, with backend enforcement and safe handling of missing data.

---

## 1. Data sources and schema (current state)

| Source | What we use |
|--------|-------------|
| **public.profiles** | user_id, role, full_name, phone, address_line, city, state, postal_code, country, created_at, updated_at |
| **auth.users** (via `get_user_email(uid)`) | email only (already used in admin_customers_list) |
| **public.subscriptions** | user_id, plan_id, cadence, status, started_at, next_billing_at, next_shipping_at, canceled_at, cancellation_reason, failed_payment_attempts, payment_status_for_next_shipment, created_at |
| **public.orders** | user_id, payment_status, created_at/updated_at (for last_payment_date and order count) |
| **public.admin_notes** | user_id, body (aggregate as notes per user) |
| **public.admin_customers_list** (view) | Already joins profiles + latest subscription + next order + last shipment; does not include started_at, canceled_at, cancellation_reason, failed_payment_attempts, order_count, last_payment_date, account_created_at, notes |

**Not in DB (leave blank in CSV):**
- username (no separate username; email is the identifier)
- address_line_2 (profiles has only address_line → map to address_line_1)
- amount_paid, currency (no amount/revenue stored in orders)
- stripe_customer_id, stripe_subscription_id (only stripe_session_id per order, not at user level)
- last_login_at (auth.users has last_sign_in_at but not exposed; can add later via security definer function)
- marketing_opt_in (no column)
- referral/source, user tags/segment (no columns)

---

## 2. Implementation plan (ordered checklist)

### Phase A — Database
- [x] **A1.** Add a new SQL migration file that creates a single view `admin_export_customers` → **Done:** `docs/supabase_admin_export_customers_view.sql` returning one row per user with:
  - All columns needed for the CSV (see field mapping below), including:
  - From profiles: user_id, full_name, phone, address_line, city, state, postal_code, country, created_at (as account_created_at).
  - From auth: email via existing `get_user_email(p.user_id)`.
  - From subscriptions (latest per user, same lateral join pattern as admin_customers_list): plan_id, status, started_at, next_billing_at, next_shipping_at, canceled_at, cancellation_reason, failed_payment_attempts, payment_status_for_next_shipment, subscription id.
  - Aggregates: order_count (count of orders per user), last_payment_date (max(orders.updated_at) where payment_status = 'paid' for that user).
  - Notes: string_agg(admin_notes.body, ' | ' order by created_at desc) for that user.
  - Next order / last shipment fields from same lateral logic as admin_customers_list where useful (next_order_status, last_shipment_at, last_tracking_number, last_carrier).
  - View must use `security_invoker = on` so RLS on underlying tables (profiles, subscriptions, orders, admin_notes) applies; only admins can select.
- [x] **A2.** Document the migration in `docs/` and reference it from `workflow/ChangeLog.md` and any admin setup docs.

### Phase B — Frontend (admin UI)
- [ ] **B1.** Add an “Export Customer Data” (or “Export CSV”) button in the admin area:
  - Place it on the **Customers** page (`AdminCustomers.tsx`) next to the existing “Export CSV” (current-page) button, with a clear label so admins distinguish “Export current page” vs “Export all customer data”.
  - Button visible only to users who can already see the admin Customers page (already behind `AdminRoute` → no extra UI guard needed; RLS enforces server-side).
- [ ] **B2.** Implement export handler that:
  - Sets loading state and disables the button to prevent duplicate clicks.
  - Fetches **all** rows from `admin_export_customers`: use a single `.select('*')` without `.range()` (or with a high limit, e.g. 10000) so all current users are included; if the project expects more than ~10k users, consider chunked fetch (e.g. 500 per page until empty) and merge.
  - Builds one CSV string with:
    - Header row: human-readable column names matching the requested fields (and any extra from the view).
    - One data row per user; escape commas and quotes (double quotes for fields containing comma or newline); empty/missing → blank cell.
  - Date format: consistent ISO or `YYYY-MM-DD HH:mm` for all date columns so Excel/Sheets parse correctly.
  - Filename: `users_export_YYYY-MM-DD_HH-mm.csv` (e.g. 24h time with dash).
  - Triggers download (Blob + createObjectURL + anchor click + revokeObjectURL).
  - On success: clear loading, show brief success feedback (e.g. toast or inline message). On error: clear loading, show error message (e.g. “Export failed: …”).
- [ ] **B3.** Keep the existing “Export CSV” (current page) button behavior unchanged for users who only want the current table page.

### Phase C — Security and compliance
- [ ] **C1.** No new backend endpoint required: export uses existing Supabase client with authenticated user; RLS ensures only admins can read `admin_export_customers` (view uses underlying tables’ policies). No service role or Stripe keys in frontend.
- [ ] **C2.** Do not expose the export to non-admin users: button lives only under `/admin/customers` which is already wrapped by `AdminRoute` (profile.role === 'admin'). No additional backend “admin check” is strictly required since the view is unreadable by non-admins, but the UX is admin-only by placement.
- [ ] **C3.** Log the feature in `docs/FAILURE_LOG.md` only if a failure occurs; document the change in `workflow/ChangeLog.md` and `docs/CHANGELOG_AI.md` (and VMP audit if applicable).

### Phase D — Testing and docs
- [ ] **D1.** Add a unit or integration test that:
  - Mocks Supabase so that a call to `from('admin_export_customers').select('*')` returns a small fixture (e.g. 2 rows).
  - Asserts that the export button triggers the fetch, builds CSV with expected headers and escaped content, and that the download filename matches `users_export_*.csv`.
- [ ] **D2.** Manually verify: as admin, click “Export Customer Data”, open CSV in Excel/Google Sheets; confirm columns, dates, and empty cells for missing data. Verify non-admin cannot access `/admin/customers` (existing behavior).

---

## 3. CSV field mapping (human-readable headers)

| CSV column (human-readable) | Source | Notes |
|-----------------------------|--------|-------|
| user_id | profiles.user_id | |
| username | — | Leave blank (not stored) |
| full_name | profiles.full_name | |
| email | get_user_email(user_id) | |
| phone_number | profiles.phone | |
| address_line_1 | profiles.address_line | Single field in DB |
| address_line_2 | — | Leave blank |
| city | profiles.city | |
| state | profiles.state | |
| postal_code | profiles.postal_code | |
| country | profiles.country | |
| plan_subscription | subscriptions.plan_id | |
| subscription_status | subscriptions.status | |
| subscription_date | subscriptions.started_at | |
| next_billing_date | subscriptions.next_billing_at | |
| renewal_date | subscriptions.next_billing_at | Same as next_billing_date |
| payment_status | subscriptions.payment_status_for_next_shipment | |
| last_payment_date | max(orders.updated_at) where payment_status='paid' | |
| amount_paid | — | Leave blank |
| currency | — | Leave blank |
| stripe_customer_id | — | Leave blank |
| stripe_subscription_id | — | Leave blank |
| account_created_at | profiles.created_at | |
| last_login_at | — | Leave blank (optional future: get_user_last_sign_in_at) |
| marketing_opt_in | — | Leave blank |
| notes | string_agg(admin_notes.body) | |
| order_count | count(orders) per user | |
| total_revenue_per_user | — | Leave blank |
| cancellation_date | subscriptions.canceled_at | |
| cancellation_reason | subscriptions.cancellation_reason | |
| trial_status | derived: subscription_status = 'trial' | e.g. "trial" or "" |
| failed_payment_count | subscriptions.failed_payment_attempts | |
| last_shipment_at | from last_ship lateral | |
| last_tracking_number | from last_ship lateral | |
| last_carrier | from last_ship lateral | |
| next_order_status | from next_ord lateral | |
| next_shipping_at | subscriptions.next_shipping_at | |

---

## 4. Risks
- **Large user count:** Fetching all rows in one request may hit Supabase response size or timeout limits (e.g. 10k+ rows). Mitigation: implement chunked fetch (e.g. 500 per request) and merge in memory; document recommended max in comments.
- **RLS and view:** If the new view references a table/function that is not readable by admin policy, the export will fail for admins; testing with an admin account after migration is required.

---

## 5. Assumptions
- Phase 1 and Phase 2 migrations are already applied (profiles, subscriptions, orders, admin_notes, admin_customers_list exist).
- No Stripe customer/subscription IDs or payment amounts are stored in the app DB today; they are left blank in the CSV unless we add them later via webhooks/sync.
- Admin identification is solely via `profiles.role = 'admin'` and `AdminRoute`; no separate “export” permission.

---

## 6. Potential improvements (out of scope unless approved)
- Optional: add `get_user_last_sign_in_at(uid)` (security definer) and include `last_login_at` in the view and CSV.
- Optional: server-side export (Edge Function or serverless) that streams CSV and enforces admin server-side for very large datasets or audit requirements.

---

## 7. Things to consider
- Existing “Export CSV” on Customers page exports only the current page; the new button should be clearly labeled (e.g. “Export all customer data (CSV)”) to avoid confusion.
- Date format: use `YYYY-MM-DD HH:mm` or ISO for consistency and Excel/Sheets compatibility; ensure timezone is consistent (e.g. UTC or local as per app convention).
- Empty/missing: leave cell blank; do not write "null" or "—" so that Excel/Sheets treat them as empty.

---

**Next step:** Once this plan is explicitly approved, implementation will follow the checklist in order (Phase A → B → C → D) and logs (ChangeLog, FAILURE_LOG, CHANGELOG_AI) will be updated accordingly.
