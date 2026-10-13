/**
 * Money rails — Stripe (test/live) + thirdweb + mock escrow.
 */
import { moneyMode, MONEY_FAIL } from "@/lib/money"
import {
  createPaymentIntent,
  initializeStripe,
  stripeConfigured,
  stripePublishableKey,
} from "@/lib/stripe"
import { isThirdwebConfigured } from "@/lib/thirdweb"
import { FiatCurrency, xauSpot } from "@/lib/gold"

export async function ensureStripeReady(): Promise<boolean> {
  if (!stripeConfigured()) return false
  try {
    await initializeStripe(stripePublishableKey())
    return true
  } catch {
    return false
  }
}

export async function stripeDeposit(
  amountFiat: number,
  currency: FiatCurrency,
): Promise<{ ok: boolean; paymentIntentId?: string; clientSecret?: string; rate: number }> {
  const rate = xauSpot(currency)
  const ready = await ensureStripeReady()
  if (!ready) return { ok: false, rate }
  try {
    const intent = await createPaymentIntent(
      Math.round(amountFiat * 100),
      currency.toLowerCase(),
    )
    return {
      ok: true,
      paymentIntentId: intent.paymentIntentId,
      clientSecret: intent.clientSecret,
      rate,
    }
  } catch (e) {
    console.warn("[rails] stripeDeposit", e)
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
