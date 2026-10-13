import { initStripe } from "@stripe/stripe-react-native"
import { supabase, isSupabaseConfigured } from "./supabase"

export async function initializeStripe(publishableKey: string) {
  await initStripe({
    publishableKey,
    merchantIdentifier: "merchant.com.obol.app",
  })
}

export function stripePublishableKey(): string {
  return process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
}

export function stripeConfigured(): boolean {
  const k = stripePublishableKey()
  return Boolean(k) && !k.includes("your_") && k.startsWith("pk_")
}

/**
 * Create a PaymentIntent via Supabase Edge Function `create-payment-intent`.
 * Falls back to null when function/secret missing (caller mints mock escrow).
 */
export async function createPaymentIntent(amountCents: number, currency = "usd") {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")

  const { data, error } = await supabase.functions.invoke("create-payment-intent", {
    body: { amount_cents: amountCents, currency },
  })

  if (error) throw error
  if (!data?.client_secret) throw new Error(data?.error || "No client_secret")

  return {
    clientSecret: data.client_secret as string,
    paymentIntentId: data.id as string,
  }
}

/** @deprecated use createPaymentIntent + local deposit mint after success */
export async function confirmPayment(amountCents: number, paymentIntentId: string) {
  return { amountCents, paymentIntentId }
}

export const TEST_CARD = {
  visa: "4242 4242 4242 4242",
  visaDebit: "4000 0566 5566 5556",
  mastercard: "5555 5555 5555 4444",
  amex: "3782 822463 10005",
  declined: "4000 0000 0000 0002",
}
