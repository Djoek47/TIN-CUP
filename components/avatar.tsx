import { initials } from "@/lib/format"

export function Avatar({
  name,
  color,
  size = 40,
}: {
  name: string | null | undefined
  color?: string | null
  size?: number
}) {
  const c = color || "#ff2d6e"
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${c}, ${c}99)`,
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}
