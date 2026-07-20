export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-[28%] bg-primary shadow-[0_8px_30px_-6px_rgba(255,45,110,0.6)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        style={{ width: size * 0.62, height: size * 0.62 }}
        stroke="var(--primary-foreground)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* stylized flame / rising star */}
        <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.2.4-2 1-2.8" />
        <path d="M12 14v8" />
        <path d="M8.5 22h7" />
      </svg>
    </div>
  )
}
