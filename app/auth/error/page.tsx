import Link from "next/link"
import { TriangleAlert } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
        <TriangleAlert className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 max-w-xs text-pretty leading-relaxed text-muted-foreground">
        We couldn&apos;t complete that sign-in. Please try again.
      </p>
      <Link
        href="/auth/login"
        className="press mt-8 flex w-full max-w-xs items-center justify-center rounded-2xl bg-primary font-semibold text-primary-foreground"
        style={{ height: 52 }}
      >
        Try again
      </Link>
    </div>
  )
}
