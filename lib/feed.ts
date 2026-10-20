/** Real content feed from Supabase (begs + open live sessions). */
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { LiveSession } from "@/lib/live-sessions"
import { listLiveSessions } from "@/lib/live-sessions"

export type FeedBeg = {
  id: string
  author_id: string
  title: string
  story: string
  goal_cents: number
  raised_cents: number
  backers: number
  handle?: string
}

export async function fetchOpenBegs(): Promise<FeedBeg[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from("begs")
    .select("id, author_id, title, story, goal_cents, raised_cents, backers, status")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(30)
  if (error || !data) {
    if (error) console.warn("[feed] begs", error.message)
    return []
  }
  const authorIds = [...new Set(data.map((b) => b.author_id).filter(Boolean))]
  let handles: Record<string, string> = {}
  if (authorIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, handle")
      .in("id", authorIds)
    handles = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.handle || "user"]))
  }
  return data.map((b) => ({
    id: String(b.id),
    author_id: b.author_id,
    title: b.title,
    story: b.story || "",
    goal_cents: Number(b.goal_cents || 0),
    raised_cents: Number(b.raised_cents || 0),
    backers: Number(b.backers || 0),
    handle: handles[b.author_id] || undefined,
  }))
}

export async function fetchHomeBundle(): Promise<{
  live: LiveSession[]
  begs: FeedBeg[]
}> {
  const [live, begs] = await Promise.all([listLiveSessions(), fetchOpenBegs()])
  return { live, begs }
}

export async function fetchTopGivers(): Promise<{ handle: string; cents: number }[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("user_id, fiat_cents, kind")
    .in("kind", ["gift", "bounty"])
    .lt("fiat_cents", 0)
    .limit(200)
  if (error || !data) {
    if (error) console.warn("[feed] givers", error.message)
    return []
  }
  const tallies: Record<string, number> = {}
  for (const row of data) {
    const id = row.user_id
    if (!id) continue
    tallies[id] = (tallies[id] || 0) + Math.abs(Number(row.fiat_cents || 0))
  }
  const ids = Object.keys(tallies)
  if (!ids.length) return []
  const { data: profiles } = await supabase.from("profiles").select("id, handle").in("id", ids)
  const handleOf = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.handle || p.id.slice(0, 8)]))
  return Object.entries(tallies)
    .map(([id, cents]) => ({ handle: handleOf[id] || id.slice(0, 8), cents }))
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 20)
}
