/** Money formatting + rail switch helpers */
import {
  FiatCurrency,
  fmtFiat,
  fmtGoldMg,
  goldMgToFiat,
  MassUnit,
  MoneyRail,
} from "@/lib/gold"

export type MoneyMode = MoneyRail

export function moneyMode(): MoneyMode {
  const mode = (process.env.EXPO_PUBLIC_MONEY_MODE ?? "auto").toLowerCase()
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
  const stripeOk =
    Boolean(stripeKey) && !stripeKey.includes("your_") && stripeKey.startsWith("pk_")
  const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID ?? ""
  const twOk =
    Boolean(clientId) && clientId !== "your_client_id_here" && !clientId.includes("YOUR_")

  if (mode === "stripe") return stripeOk ? "stripe" : "mock"
  if (mode === "thirdweb" || mode === "testnet") return twOk ? "thirdweb" : "mock"
  if (mode === "mock") return "mock"
  // auto
  if (stripeOk) return "stripe"
  if (twOk) return "thirdweb"
  return "mock"
}

export function fmtUsd(n: number, opts?: { cents?: boolean }): string {
  if (opts?.cents === false) {
    return `$${Math.round(Math.abs(n)).toLocaleString("en-US")}`
  }
  return fmtFiat(n, "USD")
}

export function fmtCompactUsd(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1000) return `$${(abs / 1000).toFixed(1).replace(/\.0$/, "")}K`
  return `$${Math.round(abs)}`
}

export function fmtBalanceGold(
  goldMg: number,
  unit: MassUnit,
  currency: FiatCurrency,
): { gold: string; fiat: string } {
  return {
    gold: fmtGoldMg(goldMg, unit),
    fiat: fmtFiat(goldMgToFiat(goldMg, currency), currency),
  }
}

export const MONEY_FAIL = "No gold moved."
export const ESCROW_BADGE = "ESCROW · GOLD"
export const STRIPE_BADGE = "STRIPE · ESCROW"
export const THIRDWEB_BADGE = "THIRDWEB · TREASURY"
export const TESTNET_BADGE = THIRDWEB_BADGE
/** @deprecated use ESCROW_BADGE */
export const TEST_BADGE = ESCROW_BADGE

export function moneyBadgeFor(mode: MoneyMode): string {
  if (mode === "stripe") return STRIPE_BADGE
  if (mode === "thirdweb") return THIRDWEB_BADGE
  return ESCROW_BADGE
}
