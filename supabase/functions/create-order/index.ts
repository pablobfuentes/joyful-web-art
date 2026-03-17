// Supabase Edge Function: create-order
// Creates an order + shipment snapshot using the user's default address.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CourierSettings = {
  length_unit?: string;
  weight_unit?: string;
  box_width?: number;
  box_height?: number;
  box_length?: number;
};

type PackageContentsSettings = {
  default_description?: string;
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

  console.log("[create-order] Incoming request", {
    hasAuthHeader: !!req.headers.get("Authorization"),
    supabaseUrl,
  });

  let body: { planId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const planId = body.planId || "monthly";
  console.log("[create-order] Parsed body", { planId });

  // Get default address (RLS ensures this belongs to the caller)
  const { data: addresses, error: addrError } = await client
    .from("user_addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);

  if (addrError) {
    console.error("[create-order] user_addresses error", addrError);
    return new Response(
      JSON.stringify({ error: "No se pudo obtener la dirección de envío." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const addr = addresses?.[0] as (Record<string, unknown> & { user_id?: string }) | undefined;
  if (!addr || !addr.user_id) {
    console.error("[create-order] No default address found for caller", { addressesCount: addresses?.length ?? 0 });
    return new Response(
      JSON.stringify({ error: "No tienes una dirección de envío configurada." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Load courier settings
  const { data: dimsRow } = await client
    .from("courier_settings")
    .select("value")
    .eq("key", "dimensions")
    .maybeSingle();

  const dims = (dimsRow?.value ?? {}) as CourierSettings;
  const lengthUnit = dims.length_unit ?? "cm";
  const weightUnit = dims.weight_unit ?? "kg";
  const boxWidth = Number(dims.box_width ?? 30);
  const boxHeight = Number(dims.box_height ?? 10);
  const boxLength = Number(dims.box_length ?? 30);

  const { data: contentsRow } = await client
    .from("courier_settings")
    .select("value")
    .eq("key", "package_contents")
    .maybeSingle();

  const contents = (contentsRow?.value ?? {}) as PackageContentsSettings;
  const defaultContents = contents.default_description ?? "Productos de cuidado de la piel";

  // Insert order
  const { data: orderRows, error: orderError } = await client
    .from("orders")
    .insert({
      user_id: addr.user_id,
      plan_id: planId,
      status: "pending",
    })
    .select("*")
    .limit(1);

  if (orderError || !orderRows?.[0]) {
    console.error("[create-order] orders insert error", orderError);
    return new Response(
      JSON.stringify({ error: "No se pudo crear el pedido." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const order = orderRows[0] as Record<string, unknown> & { id: string };

  // Insert shipment snapshot
  const { error: shipError } = await client.from("shipments").insert({
    order_id: order.id,
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
    package_count: 1,
    package_width: boxWidth,
    package_height: boxHeight,
    package_length: boxLength,
    length_unit: lengthUnit,
    weight: null,
    weight_unit: weightUnit,
    declared_value: null,
    request_insurance: null,
    package_contents: defaultContents,
  });

  if (shipError) {
    console.error("[create-order] shipments insert error", shipError);
    return new Response(
      JSON.stringify({ error: "No se pudo crear el envío." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ orderId: order.id }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

