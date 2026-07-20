import Link from "next/link"
import type { Athlete } from "@/lib/types"
import { Avatar } from "@/components/avatar"

export function StarCard({ athlete }: { athlete: Athlete }) {
  const statEntries = Object.entries(athlete.stats).slice(0, 1)
  const [statKey, statVal] = statEntries[0] ?? ["", ""]

  return (
    <Link
      href={`/athlete/${athlete.id}`}
      className="press relative flex w-40 shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card p-4"
    >
      <div
        className="absolute inset-x-0 top-0 h-20 opacity-25"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${athlete.color}, transparent)` }}
        aria-hidden="true"
      />
      <Avatar name={athlete.name} color={athlete.color} size={56} />
      <p className="mt-3 truncate font-display text-base font-bold leading-tight">
        {athlete.name}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {athlete.position} · {athlete.league_id.toUpperCase()}
      </p>
      {statKey && (
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-lg font-extrabold tabular-nums" style={{ color: athlete.color }}>
            {statVal}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">{statKey}</span>
        </div>
      )}
    </Link>
  )
}
