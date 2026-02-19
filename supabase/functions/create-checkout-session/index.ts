// Supabase Edge Function: create Stripe Checkout Session
// Requires secrets: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_PRICE_ID_GIFT, STRIPE_PRICE_ID_PREMIUM

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
      return monthly || null;
    case "gift":
      return gift || null;
    case "premium":
      return premium || null;
    default:
      return monthly || null;
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
  const priceId = getPriceId(planId);

  if (!priceId) {
    return new Response(
      JSON.stringify({ error: "Price not configured for this plan" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!successUrl || !cancelUrl) {
    return new Response(
      JSON.stringify({ error: "successUrl and cancelUrl are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(clientReferenceId ? { client_reference_id: String(clientReferenceId) } : {}),
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Payment setup failed";
    // Return 200 with error so the client can show the message (no 502 body parsing needed)
    return new Response(
      JSON.stringify({ url: null, error: message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
