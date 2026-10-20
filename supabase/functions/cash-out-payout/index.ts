// Cash-out: Transfer to Connect Express account, then release gold escrow
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"

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

    const authHeader = req.headers.get("Authorization") || ""
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!
    const userClient = createClient(supabaseUrl, anon, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }
    const userId = userData.user.id
    const { amount_cents, currency = "usd" } = await req.json()
    if (!amount_cents || amount_cents < 100) {
      return new Response(JSON.stringify({ error: "amount_cents must be >= 100" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_account_id, stripe_payouts_enabled, fate, is_lord, gold_mg_available")
      .eq("id", userId)
      .maybeSingle()

    if (!profile || profile.is_lord || profile.fate === "lord") {
      return new Response(JSON.stringify({ error: "Lords cannot cash out" }), {
        status: 403,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }
    if (!profile.stripe_account_id) {
      return new Response(JSON.stringify({ error: "Complete Stripe Connect onboarding first" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    const transferBody = new URLSearchParams()
    transferBody.set("amount", String(amount_cents))
    transferBody.set("currency", String(currency).toLowerCase())
    transferBody.set("destination", profile.stripe_account_id)
    transferBody.set("metadata[user_id]", userId)

    const transferRes = await fetch("https://api.stripe.com/v1/transfers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: transferBody,
    })
    const transfer = await transferRes.json()
    if (!transferRes.ok) {
      return new Response(JSON.stringify({ error: transfer.error?.message || "Transfer failed" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    // Release escrow via authenticated RPC (user JWT)
    const { error: releaseErr } = await userClient.rpc("release_gold_cashout", {
      p_fiat_cents: amount_cents,
      p_currency: String(currency).toUpperCase(),
      p_rail: "stripe",
    })
    if (releaseErr) {
      console.error("[cash-out] release", releaseErr)
    }

    return new Response(
      JSON.stringify({ ok: true, transfer_id: transfer.id }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }
})
