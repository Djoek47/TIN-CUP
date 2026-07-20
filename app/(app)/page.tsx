import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { LeagueChips } from "@/components/league-chips"
import { SectionHeader } from "@/components/section-header"
import { GameCard } from "@/components/game-card"
import { StarCard } from "@/components/star-card"
import { NewsCard } from "@/components/news-card"
import { RumorCard } from "@/components/rumor-card"
import { Avatar } from "@/components/avatar"
import { compact } from "@/lib/format"
import {
  getLeagues,
  getGames,
  getFeaturedAthletes,
  getNews,
  getHighlights,
  getRumors,
  getCurrentProfile,
} from "@/lib/queries"
import { Play } from "lucide-react"

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const { league } = await searchParams
  const [leagues, games, stars, news, highlights, rumors, profile] = await Promise.all([
    getLeagues(),
    getGames(league),
    getFeaturedAthletes(league),
    getNews(league),
    getHighlights(league),
    getRumors(league),
    getCurrentProfile(),
  ])

  return (
    <div>
      <AppHeader
        title="HERO"
        subtitle="Women's sports, front and center"
        showLogo
        right={
          <Link href="/profile" aria-label="Your profile">
            <Avatar name={profile?.display_name ?? "Fan"} color={profile?.avatar_color} size={36} />
          </Link>
        }
      />

      <div className="pb-2 pt-1">
        <LeagueChips leagues={leagues} />
      </div>

      <div className="flex flex-col gap-7 pt-3">
        {/* Scores */}
        <section className="flex flex-col gap-3">
          <SectionHeader title="Scores" href="/scores" />
          {games.length > 0 ? (
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
              {games.map((g) => (
                <GameCard key={g.id} game={g} compact />
              ))}
            </div>
          ) : (
            <p className="px-5 text-sm text-muted-foreground">No games for this league yet.</p>
          )}
        </section>

        {/* Featured stars */}
        {stars.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Featured stars" href="/scores" action="Standings" />
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
              {stars.map((a) => (
                <StarCard key={a.id} athlete={a} />
              ))}
            </div>
          </section>
        )}

        {/* Trending highlight */}
        {highlights.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Trending" href="/watch" action="Watch" />
            <Link href="/watch" className="press mx-5 block">
              <div className="relative overflow-hidden rounded-3xl border border-border">
                <div
                  className="flex aspect-video w-full flex-col justify-end p-4"
                  style={{
                    background: `linear-gradient(160deg, ${highlights[0].athlete?.color ?? "#ff2d6e"}55, #0b0b0f 78%)`,
                  }}
                >
                  <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white/80">
                    {highlights[0].athlete?.name}
                  </p>
                  <p className="font-display text-lg font-extrabold text-white">
                    {highlights[0].title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {compact(highlights[0].views)} views · {compact(highlights[0].likes)} likes
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Latest news */}
        {news.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Latest" />
            <div className="flex flex-col gap-2.5 px-5">
              {news.slice(0, 4).map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          </section>
        )}

        {/* Rumors */}
        {rumors.length > 0 && (
          <section className="flex flex-col gap-3">
            <SectionHeader title="Rumors & transfers" />
            <div className="flex flex-col gap-2.5 px-5">
              {rumors.slice(0, 3).map((r) => (
                <RumorCard key={r.id} rumor={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
