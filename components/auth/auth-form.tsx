"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { BrandMark } from "@/components/brand-mark"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const REDIRECT =
  process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

function redirectUrl() {
  return REDIRECT ?? `${window.location.origin}/auth/callback`
}

export function AuthForm({ mode }: { mode: "login" | "sign-up" }) {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)

  const isSignup = mode === "sign-up"

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl(),
            data: { display_name: displayName || email.split("@")[0] },
          },
        })
        if (error) throw error
        router.push("/auth/sign-up-success")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success("Welcome back")
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleApple() {
    setAppleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo: redirectUrl() },
      })
      if (error) throw error
    } catch {
      toast.error("Apple Sign In isn't enabled yet — use email to test for now.")
      setAppleLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10" style={{ paddingTop: "calc(var(--safe-top) + 3rem)" }}>
      {/* Hero */}
      <div className="fade-up flex flex-1 flex-col items-center justify-center text-center">
        <BrandMark size={72} />
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-balance">
          {isSignup ? "Join the movement" : "Welcome to HERO"}
        </h1>
        <p className="mt-3 max-w-xs text-pretty leading-relaxed text-muted-foreground">
          The premium home for women&apos;s sports — scores, stars, highlights, rumors and the fan
          community, all in one place.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEmail} className="fade-up flex flex-col gap-3">
        {isSignup && (
          <input
            type="text"
            inputMode="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-13 rounded-2xl border border-border bg-input px-4 text-base outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
            style={{ height: 52 }}
          />
        )}
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-border bg-input px-4 text-base outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
          style={{ height: 52 }}
        />
        <input
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-2xl border border-border bg-input px-4 text-base outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
          style={{ height: 52 }}
        />
        <button
          type="submit"
          disabled={loading}
          className="press mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-60"
          style={{ height: 52 }}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="fade-up my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Apple */}
      <button
        onClick={handleApple}
        disabled={appleLoading}
        className="press flex items-center justify-center gap-2 rounded-2xl bg-foreground text-base font-semibold text-background disabled:opacity-60"
        style={{ height: 52 }}
      >
        {appleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M17.05 12.53c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.68 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.18-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.18-.02 1.93-1.08 2.65-2.14.83-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5zM14.87 6.05c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
          </svg>
        )}
        Continue with Apple
      </button>

      {/* Switch */}
      <p className="fade-up mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New to HERO? "}
        <Link
          href={isSignup ? "/auth/login" : "/auth/sign-up"}
          className="font-semibold text-primary"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  )
}
