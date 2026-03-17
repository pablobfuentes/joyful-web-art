// Supabase Edge Function: create Stripe Checkout Session — v3
// Modes: subscription for monthly/premium (recurring prices), payment for gift (one-time price).
// Secrets: STRIPE_SECRET_KEY, STRIPE_PRICE_ID (monthly), STRIPE_PRICE_ID_PREMIUM, STRIPE_PRICE_ID_GIFT.
// Deploy: supabase functions deploy create-checkout-session --no-verify-jwt

import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getPriceId(planId: string): string | null {
  const monthly = Deno.env.get("STRIPE_PRICE_ID");
  const gift = Deno.env.get("STRIPE_PRICE_ID_GIFT");
  const premium = Deno.env.get("STRIPE_PRICE_ID_PREMIUM");
  switch (planId) {
    case "monthly":
      return monthly ?? null;
    case "gift":
      return gift ?? null;
    case "premium":
      return premium ?? null;
    default:
      return monthly ?? null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const secret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secret) {
    console.error("STRIPE_SECRET_KEY is not set");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: { planId?: string; successUrl?: string; cancelUrl?: string; clientReferenceId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { planId = "monthly", successUrl, cancelUrl, clientReferenceId } = body;

  if (!successUrl || !cancelUrl) {
    return new Response(
      JSON.stringify({ error: "successUrl and cancelUrl are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const priceId = getPriceId(planId);
  console.log(`[v3] planId=${planId} priceId=${priceId ?? "MISSING"}`);

  if (!priceId) {
    return new Response(
      JSON.stringify({
        error: `Plan "${planId}" not configured. Set STRIPE_PRICE_ID (monthly), STRIPE_PRICE_ID_PREMIUM, or STRIPE_PRICE_ID_GIFT in Supabase → Project Settings → Edge Functions → Secrets.`,
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(secret);
  const isGift = planId === "gift";
  const mode = isGift ? "payment" : "subscription";
  console.log(`[v3] mode=${mode} isGift=${isGift}`);

  // Guard: gift plan must use a one-time price, subscription plans must use a recurring price.
  try {
    const priceObj = await stripe.prices.retrieve(priceId);
    const isRecurring = priceObj.recurring !== null;
    console.log(`[v3] price type: ${isRecurring ? "recurring" : "one-time"}`);

    if (isGift && isRecurring) {
      return new Response(
        JSON.stringify({
          url: null,
          error:
            `STRIPE_PRICE_ID_GIFT (${priceId}) is a recurring price but Gift requires a one-time price. ` +
            "In Stripe Dashboard → your Gift product → Pricing, add a one-time price and update STRIPE_PRICE_ID_GIFT in Supabase secrets.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isGift && !isRecurring) {
      return new Response(
        JSON.stringify({
          url: null,
          error:
            `The price for plan "${planId}" (${priceId}) is a one-time price but subscriptions require a recurring price. ` +
            "In Stripe Dashboard, make sure STRIPE_PRICE_ID (monthly) and STRIPE_PRICE_ID_PREMIUM use recurring prices.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (priceErr) {
    console.error("[v3] price retrieve error:", priceErr);
    const msg = priceErr instanceof Error ? priceErr.message : "Could not retrieve price from Stripe";
    return new Response(
      JSON.stringify({ url: null, error: `Invalid price ID "${priceId}": ${msg}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(clientReferenceId ? { client_reference_id: String(clientReferenceId) } : {}),
    });
    console.log(`[v3] session created: ${session.id}`);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[v3] Stripe session error:", err);
    const message = err instanceof Error ? err.message : "Payment setup failed";
    return new Response(
      JSON.stringify({ url: null, error: message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
