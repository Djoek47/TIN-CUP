import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function SectionHeader({
  title,
  href,
  action,
}: {
  title: string
  href?: string
  action?: string
}) {
  return (
    <div className="flex items-end justify-between px-5">
      <h2 className="font-display text-xl font-extrabold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="press flex items-center gap-0.5 text-sm font-semibold text-primary"
        >
          {action ?? "See all"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
