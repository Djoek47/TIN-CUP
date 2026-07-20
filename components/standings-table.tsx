import Link from "next/link"
import type { Team } from "@/lib/types"

export function StandingsTable({ teams }: { teams: Team[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="w-5">#</span>
        <span className="flex-1">Team</span>
        <span className="w-8 text-center">W</span>
        <span className="w-8 text-center">L</span>
        <span className="w-10 text-center">Strk</span>
      </div>
      {teams.map((t, i) => (
        <Link
          key={t.id}
          href={`/team/${t.id}`}
          className="press flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0"
        >
          <span className="w-5 font-display text-sm font-bold text-muted-foreground">{i + 1}</span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
            style={{ background: t.color }}
          >
            {t.abbr}
          </span>
          <span className="flex-1 truncate text-sm font-semibold">{t.name}</span>
          <span className="w-8 text-center text-sm tabular-nums">{t.wins}</span>
          <span className="w-8 text-center text-sm tabular-nums text-muted-foreground">{t.losses}</span>
          <span
            className="w-10 text-center text-xs font-bold"
            style={{ color: t.streak?.startsWith("W") ? "var(--accent)" : "var(--muted-foreground)" }}
          >
            {t.streak ?? "—"}
          </span>
        </Link>
      ))}
    </div>
  )
}
