// Supabase Edge Function: update-shipment-address
// Allows updating shipment address before a cutoff window.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CUTOFF_HOURS = 48; // adjust as needed

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (!supabaseUrl || !anonKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });

  let body: { shipmentId?: string; addressId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { shipmentId, addressId } = body;
  if (!shipmentId || !addressId) {
    return new Response(
      JSON.stringify({ error: "shipmentId and addressId are required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Load shipment + order; RLS ensures only allowed rows are visible
  const { data: shipmentRow, error: shipError } = await client
    .from("shipments")
    .select("*, orders!inner(created_at)")
    .eq("id", shipmentId)
    .maybeSingle();

  if (shipError || !shipmentRow) {
    return new Response(
      JSON.stringify({ error: "Shipment not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // @ts-ignore
  const createdAt = new Date(shipmentRow.orders.created_at);
  const cutoffAt = new Date(createdAt.getTime() + CUTOFF_HOURS * 60 * 60 * 1000);
  if (new Date() > cutoffAt) {
    return new Response(
      JSON.stringify({ error: "La dirección ya no se puede modificar para este envío." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Load new address; RLS ensures it belongs to the caller
  const { data: addr, error: addrError } = await client
    .from("user_addresses")
    .select("*")
    .eq("id", addressId)
    .maybeSingle();

  if (addrError || !addr) {
    return new Response(
      JSON.stringify({ error: "Dirección no encontrada." }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { error: updateError } = await client
    .from("shipments")
    .update({
      ship_full_name: addr.full_name,
      ship_company: addr.company,
      ship_email: addr.email,
      ship_phone: addr.phone,
      ship_street: addr.street,
      ship_street_number_ext: addr.street_number_ext,
      ship_street_number_int: addr.street_number_int,
      ship_colonia: addr.colonia,
      ship_municipio: addr.municipio,
      ship_postal_code: addr.postal_code,
      ship_state: addr.state,
      ship_country: addr.country,
      ship_address_reference: addr.address_reference,
    })
    .eq("id", shipmentId);

  if (updateError) {
    return new Response(
      JSON.stringify({ error: "No se pudo actualizar la dirección de envío." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

