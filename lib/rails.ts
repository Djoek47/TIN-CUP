/**
 * Money rails — Stripe (fiat KYC) + thirdweb (crypto, minimal KYC).
 * Both mint/burn the same gold_mg escrow ledger via AppState deposit/cashOut.
 */
import { moneyMode, MONEY_FAIL } from "@/lib/money"
import { createPaymentIntent, confirmPayment, initializeStripe } from "@/lib/stripe"
import { isThirdwebConfigured } from "@/lib/thirdweb"
import { FiatCurrency, xauSpot } from "@/lib/gold"

export async function ensureStripeReady(): Promise<boolean> {
  const key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
  if (!key || key.includes("your_") || key.includes("YOUR_")) return false
  try {
    await initializeStripe(key)
    return true
  } catch {
    return false
  }
}

/** Attempt Stripe PaymentIntent deposit; returns false to fall back to mock mint */
export async function stripeDeposit(amountFiat: number, currency: FiatCurrency): Promise<{
  ok: boolean
  paymentIntentId?: string
  rate: number
}> {
  const rate = xauSpot(currency)
  const ready = await ensureStripeReady()
  if (!ready) return { ok: false, rate }
  try {
    const intent = await createPaymentIntent(Math.round(amountFiat * 100))
    await confirmPayment(Math.round(amountFiat * 100), intent.clientSecret)
    return { ok: true, paymentIntentId: intent.clientSecret, rate }
  } catch {
    return { ok: false, rate }
  }
}

export function thirdwebReady(): boolean {
  return moneyMode() === "thirdweb" && isThirdwebConfigured
}

export function railLabel(): string {
  const m = moneyMode()
  if (m === "stripe") return "Stripe escrow"
  if (m === "thirdweb") return "thirdweb treasury"
  return "Mock escrow"
}

export { MONEY_FAIL }
