import { createClient } from "@/lib/supabase/server"
import type {
  League,
  Team,
  Athlete,
  Game,
  NewsItem,
  Highlight,
  Rumor,
  Post,
  Comment,
  Profile,
} from "@/lib/types"

export async function getLeagues(): Promise<League[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("leagues").select("*").order("sort")
  return data ?? []
}

export async function getTeams(leagueId?: string): Promise<Team[]> {
  const supabase = await createClient()
  let q = supabase.from("teams").select("*").order("rank", { nullsFirst: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return data ?? []
}

export async function getGames(leagueId?: string): Promise<Game[]> {
  const supabase = await createClient()
  let q = supabase
    .from("games")
    .select(
      "*, home_team:home_team_id(*), away_team:away_team_id(*)",
    )
    .order("status", { ascending: true })
    .order("start_time", { ascending: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  // sort: live first, then scheduled, then final
  const order = { live: 0, scheduled: 1, final: 2 } as Record<string, number>
  return ((data as Game[]) ?? []).sort(
    (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3),
  )
}

export async function getNews(leagueId?: string): Promise<NewsItem[]> {
  const supabase = await createClient()
  let q = supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return data ?? []
}

export async function getHighlights(leagueId?: string): Promise<Highlight[]> {
  const supabase = await createClient()
  let q = supabase
    .from("highlights")
    .select("*, athlete:athlete_id(id,name,color,position)")
    .order("views", { ascending: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return (data as Highlight[]) ?? []
}

export async function getRumors(leagueId?: string): Promise<Rumor[]> {
  const supabase = await createClient()
  let q = supabase
    .from("rumors")
    .select("*")
    .order("created_at", { ascending: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return data ?? []
}

export async function getFeaturedAthletes(leagueId?: string): Promise<Athlete[]> {
  const supabase = await createClient()
  let q = supabase
    .from("athletes")
    .select("*")
    .eq("is_featured", true)
    .order("name")
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return (data as Athlete[]) ?? []
}

export async function getAthletes(leagueId?: string): Promise<Athlete[]> {
  const supabase = await createClient()
  let q = supabase.from("athletes").select("*").order("is_featured", { ascending: false }).order("name")
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data } = await q
  return (data as Athlete[]) ?? []
}

export async function getAthlete(id: string): Promise<{ athlete: Athlete | null; team: Team | null }> {
  const supabase = await createClient()
  const { data: athlete } = await supabase.from("athletes").select("*").eq("id", id).maybeSingle()
  let team: Team | null = null
  if (athlete?.team_id) {
    const { data } = await supabase.from("teams").select("*").eq("id", athlete.team_id).maybeSingle()
    team = data
  }
  return { athlete: athlete as Athlete | null, team }
}

export async function getTeam(id: string): Promise<{ team: Team | null; roster: Athlete[] }> {
  const supabase = await createClient()
  const { data: team } = await supabase.from("teams").select("*").eq("id", id).maybeSingle()
  const { data: roster } = await supabase
    .from("athletes")
    .select("*")
    .eq("team_id", id)
    .order("is_featured", { ascending: false })
  return { team: team as Team | null, roster: (roster as Athlete[]) ?? [] }
}

export async function getPosts(leagueId?: string): Promise<Post[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let q = supabase
    .from("posts")
    .select("*, author:user_id(username,display_name,avatar_color)")
    .order("created_at", { ascending: false })
  if (leagueId && leagueId !== "all") q = q.eq("league_id", leagueId)
  const { data: posts } = await q
  const list = (posts as Post[]) ?? []
  if (list.length === 0) return []

  const ids = list.map((p) => p.id)
  const { data: comments } = await supabase.from("comments").select("post_id").in("post_id", ids)
  const counts = new Map<string, number>()
  for (const c of comments ?? []) counts.set(c.post_id, (counts.get(c.post_id) ?? 0) + 1)

  let voted = new Set<string>()
  if (user) {
    const { data: votes } = await supabase
      .from("post_votes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", ids)
    voted = new Set((votes ?? []).map((v) => v.post_id))
  }

  return list.map((p) => ({
    ...p,
    comment_count: counts.get(p.id) ?? 0,
    has_voted: voted.has(p.id),
  }))
}

export async function getPost(id: string): Promise<{ post: Post | null; comments: Comment[] }> {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("*, author:user_id(username,display_name,avatar_color)")
    .eq("id", id)
    .maybeSingle()
  const { data: comments } = await supabase
    .from("comments")
    .select("*, author:user_id(username,display_name,avatar_color)")
    .eq("post_id", id)
    .order("created_at", { ascending: true })
  return { post: post as Post | null, comments: (comments as Comment[]) ?? [] }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  return data as Profile | null
}
