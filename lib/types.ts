export type Fate = "drifter" | "lord"

export interface Profile {
  id: string
  handle: string | null
  display_name: string | null
  fate: Fate | null
  title: string | null
  hat: string | null
  face: string | null
  accent: string | null
  coins: number
  balance_cents: number
  onboarded: boolean
  stripe_customer_id: string | null
  created_at: string
}

export type BegStatus = "open" | "funded" | "closed"

export interface Beg {
  id: string
  author_id: string
  title: string
  story: string | null
  goal_cents: number
  raised_cents: number
  backers: number
  status: BegStatus
  image_url: string | null
  created_at: string
  // joined author profile
  author?: Pick<Profile, "id" | "handle" | "display_name" | "title" | "fate" | "face" | "hat" | "accent">
}

export type Spectacle = "coins" | "goldRush" | "cannon"

export interface Gift {
  id: string
  beg_id: string | null
  sender_id: string
  recipient_id: string
  amount_cents: number
  coins: number
  message: string | null
  spectacle: Spectacle
  created_at: string
  sender?: Pick<Profile, "id" | "handle" | "display_name" | "title" | "fate" | "face">
}

export type LedgerKind = "deposit" | "cashout" | "gift_sent" | "gift_received" | "bonus"

export interface LedgerEntry {
  id: string
  user_id: string
  kind: LedgerKind
  amount_cents: number // signed
  balance_after_cents: number
  description: string | null
  ref_id: string | null
  created_at: string
}

export type NotificationKind = "gift" | "deposit" | "cashout" | "general" | "system"

export interface AppNotification {
  id: string
  user_id: string
  kind: NotificationKind
  title: string
  body: string | null
  data: Record<string, any> | null
  read: boolean
  created_at: string
}
