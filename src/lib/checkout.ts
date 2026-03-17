/**
 * Calls Supabase Edge Function to create a Stripe Checkout Session.
 * Returns the redirect URL or an error message.
 * Sends explicit Authorization so the Edge Function receives a valid JWT (session or anon).
 */

import { supabase } from "@/lib/supabase";

const origin = typeof window !== "undefined" ? window.location.origin : "";
const anonKey = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_ANON_KEY : "";

export type CreateCheckoutSessionParams = {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
  clientReferenceId?: string;
};

async function createOrderForPlan(planId: string): Promise<{ orderId: string | null; error: string | null }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? anonKey ?? "";
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const { data, error } = await supabase.functions.invoke("create-order", {
    body: { planId },
    headers,
  });

  if (error) {
    return { orderId: null, error: error.message || "No se pudo crear el pedido." };
  }
  if (data?.error) {
    return { orderId: null, error: String(data.error) };
  }
  return { orderId: data?.orderId ?? null, error: null };
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ url: string | null; error: string | null }> {
  const successUrl = params.successUrl ?? `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = params.cancelUrl ?? `${origin}/checkout/cancel`;

  // First, create order + shipment snapshot using the user's default address
  const { orderId, error: orderError } = await createOrderForPlan(params.planId);
  if (orderError || !orderId) {
    return { url: null, error: orderError ?? "No se pudo crear el pedido." };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? anonKey ?? "";
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const { data, error } = await supabase.functions.invoke("create-checkout-session", {
    body: {
      planId: params.planId,
      successUrl,
      cancelUrl,
      clientReferenceId: params.clientReferenceId ?? orderId,
    },
    headers,
  });

  if (error) {
    console.error("[checkout] createCheckoutSession invoke error", error);
    return { url: null, error: error.message || "No se pudo iniciar el pago." };
  }

  const url = data?.url ?? null;
  const errMsg = data?.error ?? null;
  if (errMsg) return { url: null, error: typeof errMsg === "string" ? errMsg : "Error al conectar con el pago." };
  if (!url) return { url: null, error: "No se recibió URL de pago." };

  return { url, error: null };
}
