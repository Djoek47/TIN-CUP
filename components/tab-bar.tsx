"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, Play, MessagesSquare, User } from "lucide-react"

const TABS = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/scores", label: "Scores", icon: Trophy },
  { href: "/watch", label: "Watch", icon: Play },
  { href: "/community", label: "Community", icon: MessagesSquare },
  { href: "/profile", label: "You", icon: User },
]

export function TabBar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav
      className="glass-nav fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around px-2 pt-2 pb-1.5">
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className="press flex flex-col items-center gap-1 py-1"
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className="h-6 w-6 transition-colors"
                  style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
