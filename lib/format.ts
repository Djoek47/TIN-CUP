/** $ from cents, e.g. 84700 -> "$847.00" */
export function money(cents: number, opts?: { withCents?: boolean }): string {
  const withCents = opts?.withCents ?? true
  const dollars = cents / 100
  return (
    "$" +
    dollars.toLocaleString("en-US", {
      minimumFractionDigits: withCents ? 2 : 0,
      maximumFractionDigits: withCents ? 2 : 0,
    })
  )
}

/** Compact coin counts, e.g. 98230 -> "98.2k" */
export function coins(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
  return String(n)
}

/** relative time, e.g. "6h", "2d" */
export function ago(iso: string): string {
  const then = new Date(iso).getTime()
  const secs = Math.max(1, Math.floor((Date.now() - then) / 1000))
  if (secs < 60) return secs + "s"
  const mins = Math.floor(secs / 60)
  if (mins < 60) return mins + "m"
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + "h"
  const days = Math.floor(hrs / 24)
  if (days < 7) return days + "d"
  const wks = Math.floor(days / 7)
  return wks + "w"
}

/** progress 0..1 toward a beg goal */
export function progress(raised: number, goal: number): number {
  if (!goal || goal <= 0) return 0
  return Math.min(1, raised / goal)
}
