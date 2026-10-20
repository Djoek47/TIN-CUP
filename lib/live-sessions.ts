/**
 * Live sessions — presence in Supabase + LiveKit room_name for media.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { roomNameForHost } from "@/lib/livekit"

export type LiveSession = {
  id: string
  host_id: string
  handle: string
  title: string
  goal_cents: number
  raised_cents: number
  category: string
  audience: string
  started_at: string
  room_name?: string | null
}

export async function startLiveSession(params: {
  hostId: string
  handle: string
  title: string
  goalUsd: number
  category: string
  audience: string
}): Promise<LiveSession | null> {
  if (!isSupabaseConfigured) return null
  const room_name = roomNameForHost(params.hostId)

  await supabase
    .from("live_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("host_id", params.hostId.toLowerCase())
    .is("ended_at", null)

  const { data, error } = await supabase
    .from("live_sessions")
    .insert({
      host_id: params.hostId.toLowerCase(),
      handle: params.handle,
      title: params.title,
      goal_cents: Math.round(params.goalUsd * 100),
      raised_cents: 0,
      category: params.category,
      audience: params.audience,
      room_name,
    })
    .select("*")
    .single()
  if (error) {
    console.warn("[live] start", error.message)
    return null
  }
  return data as LiveSession
}

export async function endLiveSession(hostId: string) {
  if (!isSupabaseConfigured) return
  const { error } = await supabase
    .from("live_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("host_id", hostId.toLowerCase())
    .is("ended_at", null)
  if (error) console.warn("[live] end", error.message)
}

export async function listLiveSessions(): Promise<LiveSession[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from("live_sessions")
    .select("*")
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(40)
  if (error) {
    console.warn("[live] list", error.message)
    return []
  }
  return (data ?? []) as LiveSession[]
}

export async function bumpLiveRaised(hostId: string, amountCents: number) {
  if (!isSupabaseConfigured || amountCents <= 0) return
  const { data } = await supabase
    .from("live_sessions")
    .select("id, raised_cents")
    .eq("host_id", hostId.toLowerCase())
    .is("ended_at", null)
    .maybeSingle()
  if (!data) return
  await supabase
    .from("live_sessions")
    .update({ raised_cents: Number(data.raised_cents || 0) + amountCents })
    .eq("id", data.id)
}
