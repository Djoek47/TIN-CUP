import { initStripe, useStripe, usePaymentSheet } from "@stripe/stripe-react-native"
import * as SecureStore from "expo-secure-store"
import { supabase } from "./supabase"

// Initialize Stripe (call this once on app startup)
export async function initializeStripe(publishableKey: string) {
  await initStripe({
    publishableKey,
    merchantIdentifier: "merchant.com.tincup.app",
  })
}

/**
 * Create a payment intent for a deposit.
 * Call this from your backend first to get clientSecret + ephemeralKey.
 * Then pass to PaymentSheet.
 */
export async function createPaymentIntent(amountCents: number) {
  try {
    // Call a backend RPC or API endpoint to create payment intent
    const { data, error } = await supabase.rpc("create_payment_intent", {
      p_amount_cents: amountCents,
    })

    if (error) throw error

    return {
      clientSecret: data.client_secret,
      ephemeralKey: data.ephemeral_key,
      customerId: data.customer_id,
    }
  } catch (e) {
    console.error("[Stripe] Failed to create payment intent:", e)
    throw e
  }
}

/**
 * Complete a payment. Call this after PaymentSheet closes successfully.
 */
export async function confirmPayment(amountCents: number, paymentIntentId: string) {
  try {
    // After Stripe confirms the payment, deposit the funds
    const { data, error } = await supabase.rpc("deposit_funds", {
      p_amount_cents: amountCents,
      p_ref: paymentIntentId,
    })

    if (error) throw error
    return data
  } catch (e) {
    console.error("[Stripe] Failed to confirm payment:", e)
    throw e
  }
}

export const TEST_CARD = {
  visa: "4242 4242 4242 4242",
  visaDebit: "4000 0566 5566 5556",
  mastercard: "5555 5555 5555 4444",
  amex: "3782 822463 10005",
  declined: "4000 0000 0000 0002",
}
