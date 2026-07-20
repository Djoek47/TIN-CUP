export type Role = "drifter" | "lord"

export type AvatarConfig = {
  face?: string
  hair?: string
  rags?: string
  cup?: string
  quirk?: string
  hat?: string
  coat?: string
  crown?: boolean
}

export interface Profile {
  id: string
  handle: string
  outlaw_name: string
  role: Role
  title: string
  level: number
  xp: number
  coin_balance: number
  coin_dust: number
  avatar: AvatarConfig
  onboarded: boolean
  created_at: string
}

export interface Beg {
  id: string
  author_id: string
  title: string
  story: string
  category: string
  goal_coins: number | null
  raised_coins: number
  gift_count: number
  status: "live" | "expired" | "flagged"
  created_at: string
  expires_at: string
  // joined
  author?: Pick<Profile, "id" | "handle" | "outlaw_name" | "title" | "role" | "avatar">
}

export interface Gift {
  id: string
  beg_id: string | null
  sender_id: string
  recipient_id: string
  coins: number
  tier: GiftTier
  created_at: string
  sender?: Pick<Profile, "handle" | "outlaw_name" | "title" | "role">
}

export type GiftTier = "nickel" | "small" | "medium" | "large" | "legendary"

export type LedgerType =
  | "deposit"
  | "cashout"
  | "gift_sent"
  | "gift_received"
  | "fee"
  | "dust"

export interface LedgerEntry {
  id: string
  user_id: string
  type: LedgerType
  coins: number // signed
  fee_coins: number
  memo: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  kind: "gift" | "system" | "streak" | "ascension" | "deposit" | "cashout"
  title: string
  body: string
  read: boolean
  created_at: string
}
