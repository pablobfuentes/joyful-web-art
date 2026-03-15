-- Admin Export Customers View: one row per user for CSV export.
-- Run in Supabase Dashboard → SQL Editor after Phase 1 and Phase 2 migrations.
-- View uses security_invoker = on so RLS on profiles, subscriptions, orders, admin_notes applies (admin-only read).
-- See docs/PLAN_EXPORT_USERS_CSV.md.

create or replace view public.admin_export_customers as
select
  p.user_id,
  p.full_name,
  public.get_user_email(p.user_id) as email,
  p.phone,
  p.address_line,
  p.city,
  p.state,
  p.postal_code,
  p.country,
  p.created_at as account_created_at,
  s.id as subscription_id,
  s.plan_id,
  s.status as subscription_status,
  s.started_at as subscription_started_at,
  s.next_billing_at,
  s.next_shipping_at,
  s.canceled_at as subscription_canceled_at,
  s.cancellation_reason,
  s.payment_status_for_next_shipment,
  s.failed_payment_attempts,
  coalesce(ord_cnt.order_count, 0)::int as order_count,
  last_pay.last_payment_date,
  note_agg.notes,
  next_ord.order_status as next_order_status,
  next_ord.payment_status as next_order_payment_status,
  last_ship.shipped_at as last_shipment_at,
  last_ship.tracking_number as last_tracking_number,
  last_ship.carrier as last_carrier
from public.profiles p
left join lateral (
  select * from public.subscriptions sub
  where sub.user_id = p.user_id
  order by sub.created_at desc
  limit 1
) s on true
left join (
  select user_id, count(*) as order_count
  from public.orders
  group by user_id
) ord_cnt on ord_cnt.user_id = p.user_id
left join (
  select user_id, max(updated_at) as last_payment_date
  from public.orders
  where payment_status = 'paid'
  group by user_id
) last_pay on last_pay.user_id = p.user_id
left join (
  select user_id, string_agg(body, ' | ' order by created_at desc) as notes
  from public.admin_notes
  group by user_id
) note_agg on note_agg.user_id = p.user_id
left join lateral (
  select o.order_status, o.payment_status
  from public.orders o
  where o.user_id = p.user_id
    and o.order_status not in ('shipped', 'delivered', 'cancelled')
  order by o.created_at desc
  limit 1
) next_ord on true
left join lateral (
  select o.shipped_at, o.tracking_number, o.carrier
  from public.orders o
  where o.user_id = p.user_id
    and o.shipped_at is not null
  order by o.shipped_at desc
  limit 1
) last_ship on true;

alter view public.admin_export_customers set (security_invoker = on);

comment on view public.admin_export_customers is 'One row per user for admin CSV export; RLS restricts to admins.';
