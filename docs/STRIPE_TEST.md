# Stripe test rail (Slack/make-v2)

## Wired

- Cloud secrets: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_…`), `STRIPE_SECRET_KEY` (`sk_test_…`)
- Local `.env` via `node scripts/sync-env-from-secrets.mjs` → `EXPO_PUBLIC_MONEY_MODE=auto`
- EAS production + preview: same pk + `auto`
- Supabase secret `STRIPE_SECRET_KEY` + edge function `create-payment-intent` deployed

## Verify

```bash
npm run stripe:check
```

Expect `publishable_ready: true` and `edge_payment_intent: ok (pi_…)`.

## In-app

1. Connect → ENTER AS VAGRANT or LORD (mock gold still works)
2. Wallet → ADD FUNDS → should show **STRIPE TEST MODE READY**
3. Pay with `4242 4242 4242 4242` → escrow mint

## Gate

Do **not** run EAS submit / TestFlight upload until the user explicitly approves.
