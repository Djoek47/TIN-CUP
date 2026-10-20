// Stripe webhook — mint gold on payment_intent.succeeded; track Connect account updates
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
}

async function verifyStripeSignature(
  payload: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature || !secret) return false
  const parts = Object.fromEntries(
    signature.split(",").map((p) => {
      const [k, v] = p.split("=")
      return [k, v]
    }),
  )
  const timestamp = parts["t"]
  const v1 = parts["v1"]
  if (!timestamp || !v1) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${payload}`),
  )
  const digest = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return digest === v1
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (webhookSecret) {
    const ok = await verifyStripeSignature(payload, sig, webhookSecret)
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }
  }

  let event: any
  try {
    event = JSON.parse(payload)
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  const admin = createClient(supabaseUrl, serviceKey)

  const { error: dedupeErr } = await admin.from("processed_stripe_events").insert({
    id: event.id,
    kind: event.type,
  })
  if (dedupeErr) {
    // already processed
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object
      const userId = pi.metadata?.user_id as string | undefined
      const currency = String(pi.currency || "usd").toUpperCase()
      const amount = Number(pi.amount || 0)
      if (userId && amount > 0) {
        await admin.rpc("mint_gold_escrow_for_user", {
          p_user_id: userId,
          p_fiat_cents: amount,
          p_currency: currency,
          p_xau_rate: Number(pi.metadata?.xau_rate || 2650),
          p_rail: "stripe",
          p_ref: pi.id,
        })
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object
      await admin
        .from("profiles")
        .update({
          stripe_charges_enabled: !!account.charges_enabled,
          stripe_payouts_enabled: !!account.payouts_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_account_id", account.id)
    }
  } catch (e) {
    console.error("[stripe-webhook]", e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...cors, "Content-Type": "application/json" },
  })
})
