-- Admin Portal Phase 2: Schema extension, new tables, RLS, admin list view, audit triggers
--
-- IMPORTANT: Run this script BY ITSELF in a NEW query (Supabase SQL Editor).
-- Do NOT paste it under Phase 1 in the same script. Phase 1 already creates profiles
-- and its RLS policies; re-running Phase 1 causes "policy ... already exists" errors.
--
-- Prerequisite: Phase 1 (supabase_phase1_profiles_orders_rls.sql) must already be
-- applied. Then run ONLY this file. See docs/PLAN_ADMIN_PORTAL.md and ORDERS_CREATION_FLOW.md.

-- =============================================================================
-- 1. EXTEND PROFILES (phone, address fields)
-- =============================================================================
alter table public.profiles
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists state text,
  add column if not exists city text,
  add column if not exists postal_code text,
  add column if not exists address_line text;

-- =============================================================================
-- 2. SUBSCRIPTIONS TABLE
-- =============================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null,
  cadence text not null default 'monthly' check (cadence in ('monthly', 'bimonthly', 'quarterly', 'annual')),
  status text not null default 'pending' check (status in ('active', 'paused', 'pending', 'canceled', 'trial', 'past_due')),
  started_at timestamptz,
  next_billing_at timestamptz,
  next_shipping_at timestamptz,
  canceled_at timestamptz,
  paused_at timestamptz,
  cancellation_reason text,
  payment_status_for_next_shipment text check (payment_status_for_next_shipment in ('yes', 'no', 'pending', 'failed')),
  failed_payment_attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions (user_id);
create index if not exists idx_subscriptions_status on public.subscriptions (status);
alter table public.subscriptions enable row level security;

-- =============================================================================
-- 3. PRODUCTS TABLE (reference for order_items)
-- =============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- =============================================================================
-- 4. EXTEND ORDERS (subscription_id, cycle, statuses, tracking, fulfillment)
-- =============================================================================
-- Add new columns (subscription_id FK added after subscriptions exists)
alter table public.orders
  add column if not exists subscription_id uuid references public.subscriptions (id) on delete set null,
  add column if not exists cycle_label text,
  add column if not exists order_status text check (order_status in ('pending', 'paid', 'packing', 'shipped', 'delivered', 'delayed', 'issue', 'cancelled')),
  add column if not exists payment_status text check (payment_status in ('pending', 'paid', 'failed')),
  add column if not exists packed_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists tracking_number text,
  add column if not exists carrier text,
  add column if not exists fulfillment_notes text;

-- Backfill order_status from existing status
update public.orders
set order_status = case
  when status = 'completed' then 'delivered'
  when status = 'cancelled' then 'cancelled'
  else 'pending'
end
where order_status is null;

update public.orders set payment_status = case when status = 'completed' then 'paid' else 'pending' end where payment_status is null;

-- =============================================================================
-- 5. ORDER_ITEMS TABLE
-- =============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  sku text,
  product_name_snapshot text,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);
alter table public.order_items enable row level security;

-- =============================================================================
-- 6. ADMIN_NOTES TABLE (notes about a customer, admin-only)
-- =============================================================================
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_notes_user_id on public.admin_notes (user_id);
alter table public.admin_notes enable row level security;

-- =============================================================================
-- 7. AUDIT_LOGS TABLE (insert via trigger or service; admin read-only)
-- =============================================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  changed_by uuid not null references auth.users (id) on delete restrict,
  changed_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on public.audit_logs (entity_type, entity_id);
create index if not exists idx_audit_logs_changed_at on public.audit_logs (changed_at desc);
alter table public.audit_logs enable row level security;

-- =============================================================================
-- 8. RLS POLICIES (DB-3)
-- =============================================================================

-- subscriptions: user read own; admin select/insert/update/delete
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "subscriptions_select_admin"
  on public.subscriptions for select
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "subscriptions_insert_admin"
  on public.subscriptions for insert
  with check (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "subscriptions_update_admin"
  on public.subscriptions for update
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "subscriptions_delete_admin"
  on public.subscriptions for delete
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- products: reference table; admin full; authenticated read for display
create policy "products_select_authenticated"
  on public.products for select to authenticated using (true);

create policy "products_all_admin"
  on public.products for all
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- order_items: user select own (via order); admin full
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_select_admin"
  on public.order_items for select
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "order_items_insert_admin"
  on public.order_items for insert
  with check (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "order_items_update_admin"
  on public.order_items for update
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "order_items_delete_admin"
  on public.order_items for delete
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- admin_notes: admin only
create policy "admin_notes_select_admin"
  on public.admin_notes for select
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "admin_notes_insert_admin"
  on public.admin_notes for insert
  with check (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "admin_notes_update_admin"
  on public.admin_notes for update
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

create policy "admin_notes_delete_admin"
  on public.admin_notes for delete
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- audit_logs: admin select only; insert via trigger (no policy for client insert)
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (
    exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
  );

-- Allow service role and triggers to insert (RLS bypass for trigger runs as table owner)
-- Insert from app: use a security definer function or trigger only; no direct client insert policy.

-- =============================================================================
-- 9. ADMIN LIST VIEW (DB-4): one row per customer with subscription + next order + last shipment
-- =============================================================================
create or replace view public.admin_customers_list as
select
  p.user_id,
  p.full_name as customer_name,
  public.get_user_email(p.user_id) as customer_email,
  p.phone as customer_phone,
  p.address_line,
  p.city,
  p.state,
  p.postal_code,
  p.country,
  s.id as subscription_id,
  s.plan_id,
  s.status as subscription_status,
  s.next_billing_at,
  s.next_shipping_at,
  s.payment_status_for_next_shipment,
  next_ord.id as next_order_id,
  next_ord.order_status as next_order_status,
  next_ord.payment_status as next_order_payment_status,
  last_ship.id as last_shipment_order_id,
  last_ship.cycle_label as last_shipment_cycle,
  last_ship.shipped_at as last_shipment_at,
  last_ship.tracking_number as last_tracking_number,
  last_ship.carrier as last_carrier,
  greatest(p.updated_at, coalesce(s.updated_at, p.updated_at), coalesce(next_ord.updated_at, p.updated_at)) as last_update
from public.profiles p
left join lateral (
  select * from public.subscriptions sub
  where sub.user_id = p.user_id
  order by sub.created_at desc
  limit 1
) s on true
left join lateral (
  select o.* from public.orders o
  where o.user_id = p.user_id
    and o.order_status not in ('shipped', 'delivered', 'cancelled')
  order by o.created_at desc
  limit 1
) next_ord on true
left join lateral (
  select o.* from public.orders o
  where o.user_id = p.user_id
    and o.shipped_at is not null
  order by o.shipped_at desc
  limit 1
) last_ship on true;

alter view public.admin_customers_list set (security_invoker = on);

-- =============================================================================
-- 10. AUDIT TRIGGERS (DB-5): write to audit_logs on subscription/order changes
-- =============================================================================
create or replace function public.audit_log_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (entity_type, entity_id, action, old_value, new_value, changed_by)
  values (
    tg_argv[0],
    coalesce(new.id, old.id),
    coalesce(tg_argv[1], 'update'),
    case when tg_op = 'DELETE' or tg_op = 'UPDATE' then to_jsonb(old) else null end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end,
    coalesce(auth.uid(), (current_setting('request.jwt.claims', true)::json->>'sub')::uuid)
  );
  return coalesce(new, old);
end;
$$;

-- Trigger for subscriptions (status and key field changes)
drop trigger if exists audit_subscriptions on public.subscriptions;
create trigger audit_subscriptions
  after insert or update or delete on public.subscriptions
  for each row execute function public.audit_log_insert('subscription', 'change');

-- Trigger for orders (status, tracking, fulfillment)
drop trigger if exists audit_orders on public.orders;
create trigger audit_orders
  after insert or update or delete on public.orders
  for each row execute function public.audit_log_insert('order', 'change');

-- Trigger for admin_notes
drop trigger if exists audit_admin_notes on public.admin_notes;
create trigger audit_admin_notes
  after insert or update or delete on public.admin_notes
  for each row execute function public.audit_log_insert('admin_note', 'change');

-- Trigger runs as SECURITY DEFINER so the INSERT into audit_logs runs as table owner (bypasses RLS).
-- auth.uid() in trigger context is the session user (admin who performed the change) when called from Supabase client.

comment on table public.audit_logs is 'Insert only via triggers or service role; clients have no insert policy.';
