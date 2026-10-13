/**
 * Fixed mock test identities for dual-caste QA.
 * Addresses are stable so Supabase seed + app reconnect share the same rows.
 */
import { fiatToGoldMg, FiatCurrency } from "@/lib/gold"
import type { AppUser, Balance, Caste, LedgerEntry } from "@/lib/vessel-types"

export type DemoRole = "vagrant" | "lord"

export type DemoAccount = {
  role: DemoRole
  label: string
  address: `0x${string}`
  user: AppUser
  caste: Caste
  /** Starting fiat available / hold used to build gold_mg balances */
  seedFiat: { available: number; hold: number; currency: FiatCurrency }
}

function bal(available: number, hold: number, currency: FiatCurrency = "USD"): Balance {
  const gold_mg_available = fiatToGoldMg(available, currency)
  const gold_mg_hold = fiatToGoldMg(hold, currency)
  const total = available + hold
  return {
    gold_mg_available,
    gold_mg_hold,
    gold_mg_total: gold_mg_available + gold_mg_hold,
    hidden: false,
    displayCurrency: currency,
    massUnit: "g",
    total,
    available,
    hold,
    coinDust: 0,
  }
}

/** Peasant / Vagrant — earn, go live, cash out, ascend */
export const DEMO_VAGRANT: DemoAccount = {
  role: "vagrant",
  label: "Test Vagrant (peasant)",
  address: "0x1111111111111111111111111111111111111111",
  caste: "vagrant",
  user: {
    handle: "dusty",
    displayName: "Dusty",
    bio: "Mock peasant account — go live, enter challenges, cash out escrow.",
    location: "Toronto, CA",
    link: "obol.app/dusty",
    adult: false,
    address: "0x1111111111111111111111111111111111111111",
  },
  seedFiat: { available: 250, hold: 50, currency: "USD" },
}

/** Lord — fund bounties, pour gifts, court */
export const DEMO_LORD: DemoAccount = {
  role: "lord",
  label: "Test Lord",
  address: "0x2222222222222222222222222222222222222222",
  caste: "lord",
  user: {
    handle: "baron",
    displayName: "Baron",
    bio: "Mock lord account — fund bounties, pour gold, watch the court.",
    location: "New York, US",
    link: "obol.app/baron",
    adult: false,
    address: "0x2222222222222222222222222222222222222222",
  },
  seedFiat: { available: 2500, hold: 500, currency: "USD" },
}

export const DEMO_ACCOUNTS: Record<DemoRole, DemoAccount> = {
  vagrant: DEMO_VAGRANT,
  lord: DEMO_LORD,
}

export function demoBalance(role: DemoRole): Balance {
  const a = DEMO_ACCOUNTS[role]
  return bal(a.seedFiat.available, a.seedFiat.hold, a.seedFiat.currency)
}

export function demoLedger(role: DemoRole): LedgerEntry[] {
  const a = DEMO_ACCOUNTS[role]
  const cur = a.seedFiat.currency
  const avail = a.seedFiat.available
  return [
    {
      id: `${role}-seed`,
      dir: "in",
      who: "Mock escrow provision",
      gold_mg: fiatToGoldMg(avail, cur),
      fiat_cents: Math.round(avail * 100),
      currency: cur,
      xau_rate: 2650,
      rail: "mock",
      escrow_status: "held",
      kind: "deposit",
      ts: Date.now() - 60_000,
      amount: avail,
    },
  ]
}

export function isDemoAddress(address: string | null | undefined): DemoRole | null {
  if (!address) return null
  const lower = address.toLowerCase()
  if (lower === DEMO_VAGRANT.address.toLowerCase()) return "vagrant"
  if (lower === DEMO_LORD.address.toLowerCase()) return "lord"
  return null
}
