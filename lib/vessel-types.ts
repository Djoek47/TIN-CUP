export type Caste = "vagrant" | "lord"
export type ThemeMode = "dark" | "light"
export type MoneyMode = "mock" | "testnet"

export type LedgerEntry = {
  id: string
  dir: "in" | "out"
  who: string
  amount: number
  kind: "gift" | "challenge" | "cash" | "ascend" | "bounty" | "other"
  ts: number
}

export type AppUser = {
  handle: string
  displayName: string
  bio: string
  location: string
  link: string
  adult: boolean
  address: `0x${string}` | null
}

export type Balance = {
  total: number
  available: number
  hold: number
  hidden: boolean
  coinDust: number
}

export type Prefs = {
  nGifts: boolean
  nLive: boolean
  nCourt: boolean
  priv: boolean
  hideAmt: boolean
}

export const SEED_BALANCE: Balance = {
  total: 1843.75,
  available: 1356.2,
  hold: 487.55,
  hidden: false,
  coinDust: 2450,
}

export const SEED_LEDGER: LedgerEntry[] = [
  { id: "1", dir: "in", who: "@maverick", amount: 250, kind: "gift", ts: Date.now() - 2 * 60_000 },
  { id: "2", dir: "in", who: "Challenge payout", amount: 120, kind: "challenge", ts: Date.now() - 12 * 3600_000 },
  { id: "3", dir: "out", who: "@nobody", amount: 15, kind: "gift", ts: Date.now() - 18 * 3600_000 },
]
