// Supabase Edge Function — Stripe PaymentIntent for Obol deposits (test/live via STRIPE_SECRET_KEY)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  try {
    const secret = Deno.env.get("STRIPE_SECRET_KEY")
    if (!secret) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not set" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    const {
      amount_cents,
      currency = "usd",
      user_id,
      xau_rate,
    } = await req.json()
    if (!amount_cents || amount_cents < 50) {
      return new Response(JSON.stringify({ error: "amount_cents must be >= 50" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    const body = new URLSearchParams()
    body.set("amount", String(amount_cents))
    body.set("currency", String(currency).toLowerCase())
    body.set("automatic_payment_methods[enabled]", "true")
    if (user_id) body.set("metadata[user_id]", String(user_id))
    if (xau_rate) body.set("metadata[xau_rate]", String(xau_rate))

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })
    const intent = await stripeRes.json()
    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: intent.error?.message || "Stripe error" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({
        client_secret: intent.client_secret,
        id: intent.id,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }
})
