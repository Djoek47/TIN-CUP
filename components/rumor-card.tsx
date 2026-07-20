import type { Rumor } from "@/lib/types"
import { timeAgo } from "@/lib/format"
import { ArrowRight, Flame } from "lucide-react"

const STATUS_STYLE: Record<Rumor["status"], { label: string; bg: string; fg: string }> = {
  rumor: { label: "Rumor", bg: "rgba(245,166,35,0.14)", fg: "#f5a623" },
  confirmed: { label: "Confirmed", bg: "rgba(45,224,182,0.14)", fg: "#2de0b6" },
  done: { label: "Done Deal", bg: "rgba(45,224,182,0.14)", fg: "#2de0b6" },
}

export function RumorCard({ rumor }: { rumor: Rumor }) {
  const s = STATUS_STYLE[rumor.status]
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: s.bg, color: s.fg }}
        >
          {s.label}
        </span>
        <div className="flex items-center gap-1" aria-label={`Reliability ${rumor.reliability} of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Flame
              key={i}
              className="h-3 w-3"
              style={{ color: i < rumor.reliability ? "#f5a623" : "var(--muted)" }}
              fill={i < rumor.reliability ? "#f5a623" : "none"}
            />
          ))}
        </div>
      </div>
      <h3 className="text-pretty text-sm font-semibold leading-snug">{rumor.title}</h3>
      {rumor.body && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{rumor.body}</p>
      )}
      {rumor.from_team && rumor.to_team && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium">
          <span className="truncate rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
            {rumor.from_team}
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate rounded-lg bg-secondary px-2 py-1">{rumor.to_team}</span>
        </div>
      )}
      <p className="mt-3 text-[11px] text-muted-foreground">
        {rumor.source} · {timeAgo(rumor.created_at)}
      </p>
    </article>
  )
}
