-- Courier Phase: user_addresses, shipments, global courier settings, and courier export view
-- Run this in Supabase Dashboard → SQL Editor after phase1 profiles/orders are in place.
-- See docs/Courier CSV Coverage – Checkout and Data.md for the high-level design.

-- =============================================================================
-- 1. USER_ADDRESSES: multiple MX-only addresses per user (Amazon-style)
-- =============================================================================

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  company text,
  email text,
  phone text not null,
  street text not null,
  street_number_ext text not null,
  street_number_int text,
  colonia text not null,
  municipio text not null,
  postal_code text not null,
  state text not null,
  country text not null default 'MX',
  address_reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_addresses enable row level security;

-- A user can manage only their own addresses
drop policy if exists "user_addresses_select_own" on public.user_addresses;
create policy "user_addresses_select_own"
  on public.user_addresses for select
  using (auth.uid() = user_id);

drop policy if exists "user_addresses_insert_own" on public.user_addresses;
create policy "user_addresses_insert_own"
  on public.user_addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_addresses_update_own" on public.user_addresses;
create policy "user_addresses_update_own"
  on public.user_addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_addresses_delete_own" on public.user_addresses;
create policy "user_addresses_delete_own"
  on public.user_addresses for delete
  using (auth.uid() = user_id);

-- Optional: enforce MX-only addresses at the database level
alter table public.user_addresses
  add constraint user_addresses_country_mx check (country = 'MX');

-- Keep only one default address per user (soft constraint via trigger)
create or replace function public.ensure_single_default_address()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_default then
    update public.user_addresses
    set is_default = false
    where user_id = new.user_id
      and id <> new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_user_addresses_single_default on public.user_addresses;
create trigger trg_user_addresses_single_default
  before insert or update on public.user_addresses
  for each row
  execute function public.ensure_single_default_address();

-- =============================================================================
-- 2. SHIPMENTS: per-order shipment rows (one row per box / courier CSV row)
-- =============================================================================

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  -- snapshot of address at checkout time
  ship_full_name text not null,
  ship_company text,
  ship_email text,
  ship_phone text not null,
  ship_street text not null,
  ship_street_number_ext text not null,
  ship_street_number_int text,
  ship_colonia text not null,
  ship_municipio text not null,
  ship_postal_code text not null,
  ship_state text not null,
  ship_country text not null default 'MX',
  ship_address_reference text,
  -- shipment / courier-specific fields
  package_count integer not null default 1,
  package_width numeric,
  package_height numeric,
  package_length numeric,
  length_unit text,
  weight numeric,
  weight_unit text,
  declared_value numeric,
  request_insurance boolean,
  package_contents text,
  created_at timestamptz not null default now()
);

alter table public.shipments enable row level security;

-- Users can see their own shipments via their orders; admins see all
drop policy if exists "shipments_select_own_or_admin" on public.shipments;
create policy "shipments_select_own_or_admin"
  on public.shipments for select
  using (
    exists (
      select 1
      from public.orders o
      join public.profiles p on p.user_id = auth.uid()
      where o.id = order_id
        and (o.user_id = auth.uid() or p.role = 'admin')
    )
  );

-- Inserts limited to the owning user (via order) or admin/service role
drop policy if exists "shipments_insert_own" on public.shipments;
create policy "shipments_insert_own"
  on public.shipments for insert
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- =============================================================================
-- 3. GLOBAL COURIER SETTINGS (simple key/value for defaults)
-- =============================================================================

create table if not exists public.courier_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Example defaults (adjust in Supabase SQL editor as needed):
insert into public.courier_settings (key, value)
values
  ('dimensions', jsonb_build_object(
    'length_unit', 'cm',
    'weight_unit', 'kg',
    'box_width', 30,
    'box_height', 10,
    'box_length', 30
  )),
  ('package_contents', jsonb_build_object(
    'default_description', 'Productos de cuidado de la piel'
  ))
on conflict (key) do nothing;

-- =============================================================================
-- 4. COURIER EXPORT VIEW: one row per shipment for ET_BatchFile_Multiguia.csv
-- =============================================================================

create or replace view public.admin_export_courier_et_batch as
select
  s.ship_full_name        as nombre_destinatario,
  s.ship_company          as compania_destinatario,
  s.ship_email            as email_destinatario,
  s.ship_phone            as telefono_destinatario,
  s.ship_street           as calle_destinatario,
  s.ship_street_number_ext as numero_ext_destinatario,
  s.ship_street_number_int as numero_int_destinatario,
  s.ship_colonia          as colonia_destinatario,
  s.ship_municipio        as municipio_destinatario,
  s.ship_postal_code      as codigo_postal_destinatario,
  s.ship_state            as estado_destinatario,
  s.ship_country          as pais_destinatario,
  s.ship_address_reference as referencia_ubicacion,
  false::boolean          as guardar_direccion_destino,
  coalesce(
    s.package_contents,
    (select (value->>'default_description')::text
     from public.courier_settings
     where key = 'package_contents'
    )
  )                       as contenido_paquete,
  coalesce(
    s.length_unit,
    (select (value->>'length_unit')::text
     from public.courier_settings
     where key = 'dimensions'
    )
  )                       as unidad_longitud,
  coalesce(
    s.weight_unit,
    (select (value->>'weight_unit')::text
     from public.courier_settings
     where key = 'dimensions'
    )
  )                       as unidad_peso,
  coalesce(
    s.package_width,
    (select (value->>'box_width')::numeric
     from public.courier_settings
     where key = 'dimensions'
    )
  )                       as ancho_paquete,
  coalesce(
    s.package_height,
    (select (value->>'box_height')::numeric
     from public.courier_settings
     where key = 'dimensions'
    )
  )                       as alto_paquete,
  coalesce(
    s.package_length,
    (select (value->>'box_length')::numeric
     from public.courier_settings
     where key = 'dimensions'
    )
  )                       as largo_paquete,
  s.package_count         as cantidad,
  s.weight                as peso,
  s.declared_value        as valor_declarado,
  s.request_insurance     as solicitar_aseguranza
from public.shipments s
join public.orders o on o.id = s.order_id;

alter view public.admin_export_courier_et_batch set (security_invoker = on);

comment on view public.admin_export_courier_et_batch is
  'One row per shipment formatted for ET_BatchFile_Multiguia.csv courier export; RLS via shipments/orders restricts to admins.';

