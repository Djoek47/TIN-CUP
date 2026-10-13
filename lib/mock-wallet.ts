import * as Crypto from "expo-crypto"
import { MONEY_FAIL, moneyMode } from "@/lib/money"

export type MockAccount = {
  address: `0x${string}`
  mode: "mock" | "thirdweb"
}

async function randomAddress(): Promise<`0x${string}`> {
  const bytes = await Crypto.getRandomBytesAsync(20)
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `0x${hex}` as `0x${string}`
}

/** Always Expo-safe. Never imports thirdweb/wallets. */
export async function connectMockWallet(): Promise<MockAccount> {
  return { address: await randomAddress(), mode: "mock" }
}

/**
 * Crypto send stub. Real thirdweb Account wiring belongs in a native TestFlight binary;
 * Expo Go / default path always throws MONEY_FAIL so UI shows failure copy
 * and AppState keeps the mock ledger authoritative.
 */
export async function sendTestnetUsdc(_params: {
  to: string
  amountUsd: number
}): Promise<string> {
  if (moneyMode() !== "thirdweb") throw new Error(MONEY_FAIL)
  throw new Error(MONEY_FAIL)
}

export async function stakeLordTestnet(_treasury: string): Promise<string> {
  return sendTestnetUsdc({ to: _treasury, amountUsd: 100 })
}
