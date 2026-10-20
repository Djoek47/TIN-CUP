/**
 * LiveKit media plane — token fetch + config helpers.
 * UI connects via LiveRoom when URL + room are set.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export function livekitUrl(): string | null {
  const u = process.env.EXPO_PUBLIC_LIVEKIT_URL ?? ""
  return u && !u.includes("your_") ? u : null
}

export function livekitConfigured(): boolean {
  return Boolean(livekitUrl())
}

export type LiveKitToken = {
  token: string
  url: string
  room: string
  identity: string
}

export async function fetchLiveKitToken(params: {
  room: string
  role: "host" | "viewer"
  identity?: string
}): Promise<LiveKitToken | null> {
  if (!isSupabaseConfigured || !params.room) return null
  const { data, error } = await supabase.functions.invoke("livekit-token", {
    body: {
      room: params.room,
      role: params.role,
      identity: params.identity,
    },
  })
  if (error || !data?.token) {
    console.warn("[livekit] token", error?.message || data?.error)
    return null
  }
  return {
    token: data.token as string,
    url: (data.url as string) || livekitUrl() || "",
    room: (data.room as string) || params.room,
    identity: (data.identity as string) || params.identity || "guest",
  }
}

export function roomNameForHost(hostId: string): string {
  return `obol-${hostId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 24)}`
}
