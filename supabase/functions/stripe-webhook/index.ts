// Supabase Edge Function: stripe-webhook
// Listens to Stripe webhooks and updates orders + subscriptions
// so that admin_customers_list reflects real paid subscriptions.
//
// Environment (set in Supabase Edge Function secrets):
// - STRIPE_SECRET_KEY        (sk_live_... or sk_test_...)
// - STRIPE_WEBHOOK_SECRET    (whsec_...)
// - SUPABASE_URL             (project URL)
// - SUPABASE_SERVICE_ROLE_KEY (service-role key, for server-side writes)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("[stripe-webhook] Missing required env vars");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const stripe = new Stripe(stripeSecret);
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    // @ts-ignore Stripe typings in Deno
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] Webhook signature verification failed", err);
    return new Response(
      JSON.stringify({ error: "Invalid signature" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Use service-role client so we can write orders/subscriptions regardless of current user.
  const client = createClient(supabaseUrl, serviceRoleKey);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clientRef = session.client_reference_id;
        if (!clientRef) {
          console.log("[stripe-webhook] checkout.session.completed without client_reference_id; skipping");
          break;
        }

        // client_reference_id is our order id from create-order.
        const { data: order, error: orderError } = await client
          .from("orders")
          .select("id, user_id, plan_id")
          .eq("id", clientRef)
          .maybeSingle();

        if (orderError || !order) {
          console.error("[stripe-webhook] Order not found for client_reference_id", { clientRef, orderError });
          break;
        }

        const now = new Date().toISOString();

        // Mark order as completed and store the Stripe session id.
        const { error: updateOrderError } = await client
          .from("orders")
          .update({
            status: "completed",
            stripe_session_id: session.id,
            updated_at: now,
          })
          .eq("id", order.id);

        if (updateOrderError) {
          console.error("[stripe-webhook] Failed to update order", updateOrderError);
        }

        // Upsert subscription for this user; keep it minimal for now.
        const { data: existingSub, error: subError } = await client
          .from("subscriptions")
          .select("id")
          .eq("user_id", order.user_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subError) {
          console.error("[stripe-webhook] Failed to load existing subscription", subError);
        }

        if (existingSub) {
          const { error: updSubError } = await client
            .from("subscriptions")
            .update({
              plan_id: order.plan_id,
              status: "active",
              payment_status_for_next_shipment: "yes",
              started_at: now,
              updated_at: now,
            })
            .eq("id", existingSub.id);
          if (updSubError) {
            console.error("[stripe-webhook] Failed to update subscription", updSubError);
          }
        } else {
          const { error: insSubError } = await client.from("subscriptions").insert({
            user_id: order.user_id,
            plan_id: order.plan_id,
            cadence: "monthly",
            status: "active",
            started_at: now,
            payment_status_for_next_shipment: "yes",
          });
          if (insSubError) {
            console.error("[stripe-webhook] Failed to insert subscription", insSubError);
          }
        }

        break;
      }
      default: {
        // For now, acknowledge other events without processing them.
        console.log("[stripe-webhook] Ignoring event type", event.type);
      }
    }
  } catch (err) {
    console.error("[stripe-webhook] Handler error", err);
    // Always return 200 to Stripe to avoid retries for logic errors we log.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

