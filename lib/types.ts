export type Fate = "drifter" | "lord"

export interface Profile {
  id: string
  display_name?: string
  handle: string
  fate?: Fate
  title?: string
  hat: string
  face: string
  accent: string
  coins: number
  balance_cents: number
  onboarded: boolean
  stripe_customer_id?: string
  created_at: string
}

export interface Beg {
  id: string
  author_id: string
  title: string
  story?: string
  goal_cents: number
  raised_cents: number
  backers: number
  status: "open" | "funded" | "closed"
  image_url?: string
  created_at: string
  author?: Profile
}

export interface Gift {
  id: string
  beg_id?: string
  sender_id: string
  recipient_id: string
  amount_cents: number
  coins: number
  message?: string
  spectacle: string
  created_at: string
  sender?: Profile
  recipient?: Profile
}

export type LedgerKind = "deposit" | "cashout" | "gift_sent" | "gift_received" | "bonus"

export interface LedgerEntry {
  id: string
  user_id: string
  kind: LedgerKind
  amount_cents: number
  balance_after_cents: number
  description?: string
  ref_id?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  kind: string
  title: string
  body?: string
  data?: Record<string, any>
  read: boolean
  created_at: string
}
