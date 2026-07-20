import type { NewsItem } from "@/lib/types"
import { timeAgo } from "@/lib/format"

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex gap-3 rounded-2xl border border-border bg-card p-3.5">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold uppercase text-white"
        style={{ background: "var(--secondary)" }}
      >
        <span className="text-primary">{item.league_id?.toUpperCase() ?? "WS"}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {item.category}
          </span>
          <span className="text-[11px] text-muted-foreground">{timeAgo(item.published_at)}</span>
        </div>
        <h3 className="text-pretty text-sm font-semibold leading-snug">{item.title}</h3>
        {item.summary && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        )}
        <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{item.source}</p>
      </div>
    </article>
  )
}
