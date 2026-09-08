/** Money formatting + rail switch helpers */
export type MoneyMode = "mock" | "testnet"

export function moneyMode(): MoneyMode {
  const mode = (process.env.EXPO_PUBLIC_MONEY_MODE ?? "mock").toLowerCase()
  const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID ?? ""
  const configured =
    Boolean(clientId) && clientId !== "your_client_id_here" && !clientId.includes("YOUR_")
  if (mode === "testnet" && configured) return "testnet"
  return "mock"
}

export function fmtUsd(n: number, opts?: { cents?: boolean }): string {
  const abs = Math.abs(n)
  if (opts?.cents === false) {
    return `$${Math.round(abs).toLocaleString("en-US")}`
  }
  return `$${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function fmtCompactUsd(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1000) return `$${(abs / 1000).toFixed(1).replace(/\.0$/, "")}K`
  return `$${Math.round(abs)}`
}

export const MONEY_FAIL = "No gold moved."
export const TEST_BADGE = "TEST WALLET · FAKE MONEY"
export const TESTNET_BADGE = "TESTNET · BASE SEPOLIA"
