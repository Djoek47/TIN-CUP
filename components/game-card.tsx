import type { Game } from "@/lib/types"

function TeamRow({
  abbr,
  name,
  color,
  score,
  status,
  winner,
}: {
  abbr: string
  name: string
  color: string
  score: number
  status: Game["status"]
  winner: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white"
        style={{ background: color }}
      >
        {abbr}
      </span>
      <span
        className="flex-1 truncate text-sm font-semibold"
        style={{ color: winner ? "var(--foreground)" : "var(--muted-foreground)" }}
      >
        {name}
      </span>
      {status !== "scheduled" && (
        <span
          className="font-display text-lg font-extrabold tabular-nums"
          style={{ color: winner ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          {score}
        </span>
      )}
    </div>
  )
}

export function GameCard({ game, compact = false }: { game: Game; compact?: boolean }) {
  const home = game.home_team
  const away = game.away_team
  if (!home || !away) return null

  const homeWin = game.status === "final" && game.home_score > game.away_score
  const awayWin = game.status === "final" && game.away_score > game.home_score

  return (
    <div
      className="rounded-2xl border border-border bg-card p-3.5"
      style={compact ? { width: 250 } : undefined}
    >
      <div className="mb-2.5 flex items-center justify-between">
        {game.status === "live" ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-live">
            <span className="live-dot" />
            LIVE · {game.period}
          </span>
        ) : game.status === "final" ? (
          <span className="text-xs font-semibold text-muted-foreground">FINAL</span>
        ) : (
          <span className="text-xs font-semibold text-accent">{game.period}</span>
        )}
        <span className="truncate text-[11px] text-muted-foreground">{game.venue}</span>
      </div>
      <div className="flex flex-col gap-2">
        <TeamRow
          abbr={away.abbr}
          name={compact ? away.abbr : away.name}
          color={away.color}
          score={game.away_score}
          status={game.status}
          winner={awayWin || game.status !== "final"}
        />
        <TeamRow
          abbr={home.abbr}
          name={compact ? home.abbr : home.name}
          color={home.color}
          score={game.home_score}
          status={game.status}
          winner={homeWin || game.status !== "final"}
        />
      </div>
    </div>
  )
}
