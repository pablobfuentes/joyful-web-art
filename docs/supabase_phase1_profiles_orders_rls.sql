-- Phase 1: Profiles, Orders, RLS, and Admin Views
-- Run this in Supabase Dashboard → SQL Editor → New query
-- See docs/ADMIN_AND_ORDERS_SETUP.md for step-by-step instructions.

-- =============================================================================
-- 1. PROFILES TABLE (user_id + role for RBAC; sync with auth.users)
-- =============================================================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Admins can read all profiles (needed for admin views that join orders + profiles)
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can update their own profile only
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger: auto-create profile with role 'user' when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, full_name)
  values (
    new.id,
    'user',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Trigger on auth.users (run once; may need Supabase dashboard or service role)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 2. ORDERS TABLE (checkout/orders for Stripe and shipping)
-- =============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  plan_id text not null,
  stripe_session_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  shipping_name text,
  shipping_email text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Users can insert their own orders
create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Users can read their own orders; admins can read all
create policy "orders_select_own_or_admin"
  on public.orders for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can update own pending orders (e.g. cancel); admins can update any
create policy "orders_update_own_pending_or_admin"
  on public.orders for update
  using (
    (auth.uid() = user_id and status = 'pending')
    or exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  )
  with check (true);

-- =============================================================================
-- 3. HELPER: get user email for admin views (SECURITY DEFINER to read auth.users)
-- =============================================================================
create or replace function public.get_user_email(uid uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select email from auth.users where id = uid;
$$;

grant execute on function public.get_user_email(uuid) to authenticated;
grant execute on function public.get_user_email(uuid) to service_role;

-- =============================================================================
-- 4. SAVED VIEW: Admin orders with customer info (use in Table Editor or SQL)
-- =============================================================================
create or replace view public.admin_orders_with_customer as
select
  o.id,
  o.user_id,
  o.plan_id,
  o.stripe_session_id,
  o.status,
  o.shipping_name,
  o.shipping_email,
  o.shipping_address,
  o.shipping_city,
  o.shipping_state,
  o.shipping_zip,
  o.created_at,
  o.updated_at,
  p.full_name as customer_name,
  public.get_user_email(o.user_id) as customer_email
from public.orders o
left join public.profiles p on p.user_id = o.user_id;

-- RLS: view uses underlying tables; access is enforced by orders/profiles policies
alter view public.admin_orders_with_customer set (security_invoker = on);

-- =============================================================================
-- 5. BACKFILL: Create profiles for existing auth.users (run once after migration)
-- =============================================================================
insert into public.profiles (user_id, role, full_name)
select
  id,
  'user',
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', '')
from auth.users
on conflict (user_id) do update set
  full_name = coalesce(profiles.full_name, excluded.full_name),
  updated_at = now();

-- =============================================================================
-- 6. ASSIGN FIRST ADMIN (run manually; replace with your auth user email)
-- =============================================================================
-- update public.profiles
-- set role = 'admin', updated_at = now()
-- where user_id = (select id from auth.users where email = 'your-admin@example.com' limit 1);
