import { BrandMark } from "@/components/brand-mark"

export function AppHeader({
  title,
  subtitle,
  right,
  showLogo = false,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  showLogo?: boolean
}) {
  return (
    <header
      className="glass-bar sticky top-0 z-40 flex items-center gap-3 px-5 pb-3"
      style={{ paddingTop: "calc(var(--safe-top) + 0.75rem)" }}
    >
      {showLogo && <BrandMark size={34} />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-2xl font-extrabold leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
