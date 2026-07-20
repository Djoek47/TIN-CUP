"use client"

import { useState } from "react"
import Link from "next/link"
import type { Highlight } from "@/lib/types"
import { compact } from "@/lib/format"
import { Heart, MessageCircle, Share2, Play, Pause } from "lucide-react"

function HighlightSlide({ h }: { h: Highlight }) {
  const [liked, setLiked] = useState(false)
  const [playing, setPlaying] = useState(true)
  const color = h.athlete?.color ?? "#ff2d6e"
  const likeCount = h.likes + (liked ? 1 : 0)

  return (
    <div className="relative flex h-[calc(100dvh-6rem)] snap-start snap-always items-center justify-center">
      {/* poster */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="absolute inset-0 h-full w-full"
        aria-label={playing ? "Pause" : "Play"}
      >
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(90% 60% at 50% 35%, ${color}66, transparent), linear-gradient(180deg, #14141a, #060608)`,
          }}
        />
        {!playing && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <Play className="h-9 w-9 fill-white text-white" />
            </span>
          </span>
        )}
      </button>

      {/* subtle animated "playing" badge */}
      <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
        {playing ? (
          <Pause className="h-3.5 w-3.5 text-white" />
        ) : (
          <Play className="h-3.5 w-3.5 text-white" />
        )}
        <span className="text-xs font-semibold text-white">{h.league_id?.toUpperCase()}</span>
      </div>

      {/* right action rail */}
      <div className="pointer-events-auto absolute bottom-28 right-4 flex flex-col items-center gap-5">
        <button onClick={() => setLiked((l) => !l)} className="flex flex-col items-center gap-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35 backdrop-blur">
            <Heart
              className={`h-6 w-6 ${liked ? "pop" : ""}`}
              style={{ color: liked ? "#ff2d6e" : "#fff" }}
              fill={liked ? "#ff2d6e" : "none"}
            />
          </span>
          <span className="text-xs font-semibold text-white">{compact(likeCount)}</span>
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35 backdrop-blur">
            <MessageCircle className="h-6 w-6 text-white" />
          </span>
          <span className="text-xs font-semibold text-white">{compact(Math.round(h.likes / 12))}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35 backdrop-blur">
            <Share2 className="h-6 w-6 text-white" />
          </span>
          <span className="text-xs font-semibold text-white">Share</span>
        </div>
      </div>

      {/* bottom caption */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex flex-col gap-1 px-5 pr-20">
        {h.athlete && (
          <Link
            href={`/athlete/${h.athlete.id}`}
            className="press flex w-fit items-center gap-2"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: color }}
            >
              {h.athlete.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </span>
            <span className="font-display text-sm font-bold text-white">{h.athlete.name}</span>
          </Link>
        )}
        <p className="font-display text-lg font-extrabold leading-tight text-white text-balance">
          {h.title}
        </p>
        {h.caption && <p className="text-sm leading-relaxed text-white/80">{h.caption}</p>}
        <p className="mt-0.5 text-xs text-white/60">{compact(h.views)} views</p>
      </div>
    </div>
  )
}

export function WatchFeed({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-6rem)] items-center justify-center px-8 text-center">
        <p className="text-sm text-muted-foreground">No highlights yet for this league.</p>
      </div>
    )
  }
  return (
    <div className="no-scrollbar h-[calc(100dvh-6rem)] snap-y snap-mandatory overflow-y-auto">
      {highlights.map((h) => (
        <HighlightSlide key={h.id} h={h} />
      ))}
    </div>
  )
}
