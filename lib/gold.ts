/**
 * Reference gold ledger helpers.
 * Canonical unit: gold_mg (milligrams of reference XAU — not physical delivery).
 */

export type FiatCurrency = "USD" | "CAD"
export type MassUnit = "mg" | "g" | "kg" | "lb" | "oz"
export type MoneyRail = "mock" | "stripe" | "thirdweb"
export type EscrowStatus = "held" | "spent" | "released"

/** Troy ounce in milligrams */
export const TROY_OZ_MG = 31103.4768

/**
 * Mock spot: USD / CAD per troy ounce of reference XAU.
 * Replace via EXPO_PUBLIC_XAU_USD / EXPO_PUBLIC_XAU_CAD when keys are set.
 */
export function xauSpot(currency: FiatCurrency = "USD"): number {
  if (currency === "CAD") {
    const v = Number(process.env.EXPO_PUBLIC_XAU_CAD)
    return Number.isFinite(v) && v > 0 ? v : 3520
  }
  const v = Number(process.env.EXPO_PUBLIC_XAU_USD)
  return Number.isFinite(v) && v > 0 ? v : 2650
}

/** Fiat dollars per milligram of reference gold */
export function fiatPerMg(currency: FiatCurrency = "USD"): number {
  return xauSpot(currency) / TROY_OZ_MG
}

export function fiatToGoldMg(fiatAmount: number, currency: FiatCurrency = "USD"): number {
  if (fiatAmount <= 0) return 0
  return fiatAmount / fiatPerMg(currency)
}

export function goldMgToFiat(goldMg: number, currency: FiatCurrency = "USD"): number {
  return goldMg * fiatPerMg(currency)
}

export function mgToUnit(goldMg: number, unit: MassUnit): number {
  switch (unit) {
    case "mg":
      return goldMg
    case "g":
      return goldMg / 1000
    case "kg":
      return goldMg / 1_000_000
    case "lb":
      return goldMg / 453_592.37
    case "oz":
      return goldMg / TROY_OZ_MG
    default:
      return goldMg
  }
}

export function unitToMg(amount: number, unit: MassUnit): number {
  switch (unit) {
    case "mg":
      return amount
    case "g":
      return amount * 1000
    case "kg":
      return amount * 1_000_000
    case "lb":
      return amount * 453_592.37
    case "oz":
      return amount * TROY_OZ_MG
    default:
      return amount
  }
}

export function fmtGoldMg(
  goldMg: number,
  unit: MassUnit = "g",
  opts?: { digits?: number },
): string {
  const n = mgToUnit(Math.abs(goldMg), unit)
  const digits = opts?.digits ?? (unit === "kg" || unit === "lb" ? 4 : unit === "g" ? 3 : 1)
  const body = n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
  return `${body} ${unit}`
}

export function fmtFiat(amount: number, currency: FiatCurrency = "USD"): string {
  try {
    return new Intl.NumberFormat(currency === "CAD" ? "en-CA" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    const sym = currency === "CAD" ? "CA$" : "$"
    return `${sym}${Math.abs(amount).toFixed(2)}`
  }
}

/** Lord ascension fee in fiat dollars (reference), converted at mint time */
export const LORD_FEE_FIAT = 100
