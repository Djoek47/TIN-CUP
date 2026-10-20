/** Format cents as a dollar string: 1500 → "$15.00" */
export function formatCents(cents: number | null | undefined): string {
  if (!cents) return "$0.00"
  const dollars = (cents / 100).toFixed(2)
  return `$${dollars}`
}

/** Format a date as a relative string: 2 hours ago, etc */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString()
}
