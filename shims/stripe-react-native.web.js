/** Web stub — Stripe React Native SDK is iOS/Android only. */
const React = require("react")

function StripeProvider({ children }) {
  return children ?? null
}

function useStripe() {
  return {
    initPaymentSheet: async () => ({ error: { code: "Canceled", message: "Stripe PaymentSheet is native-only" } }),
    presentPaymentSheet: async () => ({ error: { code: "Canceled", message: "Stripe PaymentSheet is native-only" } }),
  }
}

async function initStripe() {
  return
}

module.exports = {
  StripeProvider,
  useStripe,
  initStripe,
  CardField: () => null,
}
