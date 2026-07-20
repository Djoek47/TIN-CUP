import { supabase } from "./supabase"
import type { League, Team, Athlete, Game, NewsItem, Highlight, Rumor, Post, Comment } from "./types"

export async function getLeagues(): Promise<League[]> {
  const { data } = await supabase.from("leagues").select("*").order("sort", { ascending: true }).order("name")
  return data ?? []
}

export async function getFeaturedAthlete(): Promise<Athlete | null> {
  const { data } = await supabase
    .from("athletes")
    .select("*, league:leagues(id,name,abbr,sport,color)")
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle()
  return (data as Athlete) ?? null
}

export async function getAthletesRanked(): Promise<Athlete[]> {
  const { data } = await supabase
    .from("athletes")
    .select("*, league:leagues(id,name,abbr,sport,color)")
    .order("trend", { ascending: false })
    .order("name")
  return (data as Athlete[]) ?? []
}

export async function getAthlete(id: string): Promise<Athlete | null> {
  const { data } = await supabase
    .from("athletes")
    .select("*, league:leagues(id,name,abbr,sport,color)")
    .eq("id", id)
    .maybeSingle()
  return (data as Athlete) ?? null
}

export async function getLiveGames(): Promise<Game[]> {
  const { data } = await supabase
    .from("games")
    .select("*, home_team:teams!games_home_team_id_fkey(*), away_team:teams!games_away_team_id_fkey(*)")
    .eq("status", "live")
    .order("start_time", { ascending: false })
  return (data as Game[]) ?? []
}

export async function getAllGames(): Promise<Game[]> {
  const { data } = await supabase
    .from("games")
    .select("*, home_team:teams!games_home_team_id_fkey(*), away_team:teams!games_away_team_id_fkey(*)")
    .order("start_time", { ascending: false })
  return (data as Game[]) ?? []
}

export async function getNews(limit = 20): Promise<NewsItem[]> {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getHighlights(): Promise<Highlight[]> {
  const { data } = await supabase
    .from("highlights")
    .select("*, athlete:athletes(id,name,color,position)")
    .order("created_at", { ascending: false })
  return (data as Highlight[]) ?? []
}

export async function getRumors(): Promise<Rumor[]> {
  const { data } = await supabase.from("rumors").select("*").order("created_at", { ascending: false })
  return data ?? []
}

export async function getTeams(): Promise<Team[]> {
  const { data } = await supabase.from("teams").select("*").order("rank", { ascending: true })
  return data ?? []
}

/* ---------- Community ---------- */

export async function getPosts(userId?: string): Promise<Post[]> {
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(username,display_name,avatar_color), comments(count)")
    .order("created_at", { ascending: false })
  const posts = (data ?? []) as any[]
  let votedIds = new Set<string>()
  if (userId && posts.length) {
    const { data: votes } = await supabase
      .from("post_votes")
      .select("post_id")
      .eq("user_id", userId)
      .in(
        "post_id",
        posts.map((p) => p.id),
      )
    votedIds = new Set((votes ?? []).map((v: any) => v.post_id))
  }
  return posts.map((p) => ({
    ...p,
    comment_count: p.comments?.[0]?.count ?? 0,
    has_voted: votedIds.has(p.id),
  })) as Post[]
}

export async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from("comments")
    .select("*, author:profiles(username,display_name,avatar_color)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  return (data as Comment[]) ?? []
}

export async function createPost(input: { title: string; body: string; leagueId: string | null }) {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) throw new Error("Not signed in")
  const { error } = await supabase.from("posts").insert({
    user_id: uid,
    title: input.title,
    body: input.body,
    league_id: input.leagueId,
  })
  if (error) throw error
}

export async function addComment(postId: string, body: string) {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) throw new Error("Not signed in")
  const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: uid, body })
  if (error) throw error
}

export async function toggleVote(postId: string, hasVoted: boolean) {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) throw new Error("Not signed in")
  if (hasVoted) {
    await supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", uid)
    await supabase.rpc("adjust_post_upvotes", { p_post_id: postId, p_delta: -1 })
  } else {
    await supabase.from("post_votes").insert({ post_id: postId, user_id: uid })
    await supabase.rpc("adjust_post_upvotes", { p_post_id: postId, p_delta: 1 })
  }
}

export async function likeHighlight(highlightId: string, delta: number) {
  await supabase.rpc("adjust_highlight_likes", { p_highlight_id: highlightId, p_delta: delta })
}

/* ---------- Follows ---------- */

export async function getFollows(userId: string): Promise<{ athleteIds: string[]; teamIds: string[] }> {
  const { data } = await supabase.from("follows").select("athlete_id, team_id").eq("user_id", userId)
  const athleteIds: string[] = []
  const teamIds: string[] = []
  ;(data ?? []).forEach((f: any) => {
    if (f.athlete_id) athleteIds.push(f.athlete_id)
    if (f.team_id) teamIds.push(f.team_id)
  })
  return { athleteIds, teamIds }
}

export async function toggleFollowAthlete(userId: string, athleteId: string, isFollowing: boolean) {
  if (isFollowing) {
    await supabase.from("follows").delete().eq("user_id", userId).eq("athlete_id", athleteId)
  } else {
    await supabase.from("follows").insert({ user_id: userId, athlete_id: athleteId })
  }
}

export async function toggleFollowTeam(userId: string, teamId: string, isFollowing: boolean) {
  if (isFollowing) {
    await supabase.from("follows").delete().eq("user_id", userId).eq("team_id", teamId)
  } else {
    await supabase.from("follows").insert({ user_id: userId, team_id: teamId })
  }
}

export async function getProfile(userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
  return data
}
