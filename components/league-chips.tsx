"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { League } from "@/lib/types"

export function LeagueChips({ leagues }: { leagues: League[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("league") ?? "all"

  function select(id: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (id === "all") params.delete("league")
    else params.set("league", id)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const all = [{ id: "all", abbr: "All", color: "#ff2d6e" }, ...leagues]

  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {all.map((l) => {
        const active = current === l.id
        return (
          <button
            key={l.id}
            onClick={() => select(l.id)}
            className="press shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              background: active ? l.color : "var(--secondary)",
              color: active ? "#fff" : "var(--muted-foreground)",
              border: active ? "none" : "1px solid var(--border)",
            }}
          >
            {"abbr" in l ? l.abbr : l.id}
          </button>
        )
      })}
    </div>
  )
}
