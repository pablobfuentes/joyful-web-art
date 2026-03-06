# Updating a customer's order status (admin)

**Where:** Admin → Customers → [customer] → **Next Order** or **Order History** tab.

## Steps

1. Go to **Admin** → **Customers** and click **View** for the customer.
2. Open the **Next Order** tab (for their current/upcoming order) or **Order History** (for any order).
3. Click **Update order status** next to the order you want to change.
4. In the dialog:
   - **Order:** Choose the order (date and current status are shown).
   - **New order status:** Choose one of:  
     `pending` · `paid` · `packing` · `shipped` · `delivered` · `delayed` · `issue` · `cancelled`
5. Click **Save**. The list and detail refresh automatically.

## What gets updated

- The `orders` row is updated: `order_status` and `updated_at`.
- An audit log entry is written (Phase 2 migration) so the change appears under the **Audit log** tab.

## Related

- **Tracking:** Use **Add tracking** in the same tabs to set `tracking_number`, `carrier`, and optionally `shipped_at`.
- **Payment status:** Shown in the customer list (Payment status column) and on the customer detail Next Order section. It is set by your payment flow (e.g. Stripe webhook); admins do not edit it in the UI.
