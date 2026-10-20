// Mint LiveKit access tokens for host publish / viewer subscribe
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"
import { AccessToken } from "npm:livekit-server-sdk@2.13.0"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })

  try {
    const apiKey = Deno.env.get("LIVEKIT_API_KEY")
    const apiSecret = Deno.env.get("LIVEKIT_API_SECRET")
    const livekitUrl = Deno.env.get("LIVEKIT_URL") || Deno.env.get("EXPO_PUBLIC_LIVEKIT_URL")
    if (!apiKey || !apiSecret || !livekitUrl) {
      return new Response(JSON.stringify({ error: "LiveKit secrets not configured" }), {
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
    const { data: userData } = await userClient.auth.getUser()
    const identity =
      userData.user?.id ||
      (await req.json().catch(() => ({}))).identity ||
      `guest-${crypto.randomUUID().slice(0, 8)}`

    const body = await req.clone().json().catch(() => ({}))
    const room = String(body.room || body.room_name || "")
    const role = body.role === "viewer" ? "viewer" : "host"
    if (!room) {
      return new Response(JSON.stringify({ error: "room required" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      })
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: String(identity),
      ttl: "2h",
    })
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: role === "host",
      canSubscribe: true,
      canPublishData: true,
    })
    const token = await at.toJwt()

    return new Response(
      JSON.stringify({ token, url: livekitUrl, room, identity }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    })
  }
})
