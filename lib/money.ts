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
  const mode = (process.env.EXPO_PUBLIC_MONEY_MODE ?? "mock").toLowerCase()
  if (mode === "stripe") return "stripe"
  if (mode === "thirdweb" || mode === "testnet") {
    const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID ?? ""
    const configured =
      Boolean(clientId) && clientId !== "your_client_id_here" && !clientId.includes("YOUR_")
    return configured ? "thirdweb" : "mock"
  }
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
export const TEST_BADGE = "TEST WALLET · FAKE MONEY"
export const STRIPE_BADGE = "STRIPE · ESCROW"
export const THIRDWEB_BADGE = "THIRDWEB · ESCROW"
export const TESTNET_BADGE = THIRDWEB_BADGE

export function moneyBadgeFor(mode: MoneyMode): string {
  if (mode === "stripe") return STRIPE_BADGE
  if (mode === "thirdweb") return THIRDWEB_BADGE
  return TEST_BADGE
}
