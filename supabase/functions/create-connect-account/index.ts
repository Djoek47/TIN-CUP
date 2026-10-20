// Create Stripe Connect Express account + Account Link for cash-out onboarding
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
    const returnUrl =
      (await req.json().catch(() => ({}))).return_url || "obol://wallet"

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_account_id, handle")
      .eq("id", userId)
      .maybeSingle()

    let accountId = profile?.stripe_account_id as string | null
    if (!accountId) {
      const body = new URLSearchParams()
      body.set("type", "express")
      body.set("capabilities[transfers][requested]", "true")
      body.set("metadata[user_id]", userId)
      if (profile?.handle) body.set("business_profile[name]", String(profile.handle))

      const accRes = await fetch("https://api.stripe.com/v1/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      })
      const account = await accRes.json()
      if (!accRes.ok) {
        return new Response(JSON.stringify({ error: account.error?.message || "Account create failed" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        })
      }
      accountId = account.id
      await admin
        .from("profiles")
        .update({ stripe_account_id: accountId, updated_at: new Date().toISOString() })
        .eq("id", userId)
    }

    const linkBody = new URLSearchParams()
    linkBody.set("account", accountId!)
    linkBody.set("refresh_url", returnUrl)
    linkBody.set("return_url", returnUrl)
    linkBody.set("type", "account_onboarding")

    const linkRes = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: linkBody,
    })
    const link = await linkRes.json()
    if (!linkRes.ok) {
      return new Response(JSON.stringify({ error: link.error?.message || "Link failed" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    return new Response(
      JSON.stringify({ url: link.url, account_id: accountId }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }
})
