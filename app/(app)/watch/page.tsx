import { WatchFeed } from "@/components/watch-feed"
import { getHighlights } from "@/lib/queries"

export default async function WatchPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>
}) {
  const { league } = await searchParams
  const highlights = await getHighlights(league)

  return (
    <div className="relative bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center px-5"
        style={{ paddingTop: "calc(var(--safe-top) + 0.75rem)" }}
      >
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white drop-shadow">
          Watch
        </h1>
      </div>
      <WatchFeed highlights={highlights} />
    </div>
  )
}
