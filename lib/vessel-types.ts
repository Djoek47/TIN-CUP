import { fiatToGoldMg, FiatCurrency, MassUnit, MoneyRail, EscrowStatus } from "@/lib/gold"

export type Caste = "vagrant" | "lord"
export type ThemeMode = "dark" | "light"
export type MoneyMode = MoneyRail

export type LedgerEntry = {
  id: string
  dir: "in" | "out"
  who: string
  /** Canonical amount in gold_mg */
  gold_mg: number
  /** Fiat snapshot at event time */
  fiat_cents: number
  currency: FiatCurrency
  xau_rate: number
  rail: MoneyRail
  escrow_status: EscrowStatus
  kind: "gift" | "challenge" | "cash" | "ascend" | "bounty" | "deposit" | "other"
  ts: number
  /** @deprecated use gold_mg — kept for UI that still reads amount */
  amount: number
}

export type AppUser = {
  handle: string
  displayName: string
  bio: string
  location: string
  link: string
  adult: boolean
  /** Wallet address (0x…) or Supabase auth user id */
  address: string | null
  photoUri?: string | null
}

/** Balances are canonical gold_mg; fiat is derived for display */
export type Balance = {
  gold_mg_total: number
  gold_mg_available: number
  /** Escrow hold — waiting to be used or released */
  gold_mg_hold: number
  hidden: boolean
  displayCurrency: FiatCurrency
  massUnit: MassUnit
  /** legacy USD mirrors for screens still on dollars */
  total: number
  available: number
  hold: number
  coinDust: number
}

export type Prefs = {
  nGifts: boolean
  nLive: boolean
  nCourt: boolean
  priv: boolean
  hideAmt: boolean
  currency: FiatCurrency
  massUnit: MassUnit
}

function seedFromUsd(usd: number) {
  return fiatToGoldMg(usd, "USD")
}

const availUsd = 1356.2
const holdUsd = 487.55
const totalUsd = 1843.75

export const SEED_BALANCE: Balance = {
  gold_mg_available: seedFromUsd(availUsd),
  gold_mg_hold: seedFromUsd(holdUsd),
  gold_mg_total: seedFromUsd(totalUsd),
  hidden: false,
  displayCurrency: "USD",
  massUnit: "g",
  total: totalUsd,
  available: availUsd,
  hold: holdUsd,
  coinDust: 2450,
}

export const SEED_LEDGER: LedgerEntry[] = [
  {
    id: "1",
    dir: "in",
    who: "@baron",
    gold_mg: seedFromUsd(250),
    fiat_cents: 25000,
    currency: "USD",
    xau_rate: 2650,
    rail: "mock",
    escrow_status: "held",
    kind: "gift",
    ts: Date.now() - 2 * 60_000,
    amount: 250,
  },
  {
    id: "2",
    dir: "in",
    who: "Challenge payout",
    gold_mg: seedFromUsd(120),
    fiat_cents: 12000,
    currency: "USD",
    xau_rate: 2650,
    rail: "mock",
    escrow_status: "released",
    kind: "challenge",
    ts: Date.now() - 12 * 3600_000,
    amount: 120,
  },
  {
    id: "3",
    dir: "out",
    who: "@nobody",
    gold_mg: seedFromUsd(15),
    fiat_cents: 1500,
    currency: "USD",
    xau_rate: 2650,
    rail: "mock",
    escrow_status: "spent",
    kind: "gift",
    ts: Date.now() - 18 * 3600_000,
    amount: 15,
  },
]
