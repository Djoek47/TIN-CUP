import { AppHeader } from "@/components/app-header"
import { LeagueChips } from "@/components/league-chips"
import { SectionHeader } from "@/components/section-header"
import { GameCard } from "@/components/game-card"
import { StandingsTable } from "@/components/standings-table"
import { getLeagues, getGames, getTeams } from "@/lib/queries"

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const { league } = await searchParams
  const [leagues, games, teams] = await Promise.all([
    getLeagues(),
    getGames(league),
    getTeams(league),
  ])

  return (
    <div>
      <AppHeader title="Scores" subtitle="Live games and standings" />
      <div className="pb-2 pt-1">
        <LeagueChips leagues={leagues} />
      </div>

      <div className="flex flex-col gap-7 pt-3">
        <section className="flex flex-col gap-3">
          <SectionHeader title="Games" />
          <div className="flex flex-col gap-2.5 px-5">
            {games.length > 0 ? (
              games.map((g) => <GameCard key={g.id} game={g} />)
            ) : (
              <p className="text-sm text-muted-foreground">No games scheduled.</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title="Standings" />
          <div className="px-5">
            {teams.length > 0 ? (
              <StandingsTable teams={teams} />
            ) : (
              <p className="text-sm text-muted-foreground">No standings yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
