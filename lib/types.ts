export type League = {
  id: string
  name: string
  abbr: string
  sport: string
  color: string
  sort: number
}

export type Team = {
  id: string
  league_id: string
  name: string
  abbr: string
  city: string | null
  color: string
  wins: number
  losses: number
  streak: string | null
  rank: number | null
}

export type Athlete = {
  id: string
  team_id: string | null
  league_id: string
  name: string
  position: string | null
  jersey: number | null
  country: string | null
  age: number | null
  bio: string | null
  color: string
  is_featured: boolean
  stats: Record<string, number | string>
}

export type Game = {
  id: string
  league_id: string
  home_team_id: string | null
  away_team_id: string | null
  status: "scheduled" | "live" | "final"
  home_score: number
  away_score: number
  period: string | null
  start_time: string
  venue: string | null
  home_team?: Team | null
  away_team?: Team | null
}

export type NewsItem = {
  id: string
  league_id: string | null
  title: string
  summary: string | null
  source: string | null
  category: string | null
  image_url: string | null
  published_at: string
}

export type Highlight = {
  id: string
  league_id: string | null
  athlete_id: string | null
  title: string
  caption: string | null
  thumbnail_url: string | null
  video_url: string | null
  likes: number
  views: number
  created_at: string
  athlete?: Pick<Athlete, "id" | "name" | "color" | "position"> | null
}

export type Rumor = {
  id: string
  league_id: string | null
  athlete_id: string | null
  title: string
  body: string | null
  status: "rumor" | "confirmed" | "done"
  reliability: number
  source: string | null
  from_team: string | null
  to_team: string | null
  created_at: string
}

export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  avatar_color: string | null
  favorite_league: string | null
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  league_id: string | null
  title: string
  body: string | null
  upvotes: number
  created_at: string
  author?: Pick<Profile, "username" | "display_name" | "avatar_color"> | null
  comment_count?: number
  has_voted?: boolean
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  author?: Pick<Profile, "username" | "display_name" | "avatar_color"> | null
}
