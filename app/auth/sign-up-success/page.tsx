import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <BrandMark size={56} />
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
        <MailCheck className="h-8 w-8 text-accent" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold">Check your inbox</h1>
      <p className="mt-3 max-w-xs text-pretty leading-relaxed text-muted-foreground">
        We sent you a confirmation link. Tap it to verify your account, then come back and sign in.
      </p>
      <Link
        href="/auth/login"
        className="press mt-8 flex w-full max-w-xs items-center justify-center rounded-2xl bg-primary font-semibold text-primary-foreground"
        style={{ height: 52 }}
      >
        Back to sign in
      </Link>
    </div>
  )
}
