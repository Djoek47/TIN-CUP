#!/usr/bin/env node
/**
 * Stripe connectivity report for 0bol (no secrets printed).
 * Run: node --env-file=.env scripts/stripe-connect-check.mjs
 */
import { createClient } from "@supabase/supabase-js"

const pk = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
const mode = (process.env.EXPO_PUBLIC_MONEY_MODE || "mock").toLowerCase()
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

const pkOk = pk.startsWith("pk_test_") || pk.startsWith("pk_live_")
const report = {
  money_mode: mode,
  publishable_key: pkOk ? `${pk.slice(0, 12)}… (${pk.startsWith("pk_live_") ? "LIVE" : "TEST"})` : "MISSING",
  publishable_ready: pkOk && !pk.includes("your_"),
  supabase: Boolean(url && anon),
  edge_payment_intent: "not_checked",
  note: "",
}

async function checkEdge() {
  if (!url || !anon) {
    report.edge_payment_intent = "skipped_no_supabase"
    return
  }
  if (!report.publishable_ready) {
    report.edge_payment_intent = "skipped_no_pk"
    report.note =
      "Add Cloud Agent / EAS secret EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_… and Supabase secret STRIPE_SECRET_KEY=sk_test_… then redeploy create-payment-intent."
    return
  }
  const supabase = createClient(url, anon)
  const { data, error } = await supabase.functions.invoke("create-payment-intent", {
    body: { amount_cents: 100, currency: "usd" },
  })
  if (error) {
    report.edge_payment_intent = `error: ${error.message || String(error)}`
    report.note =
      "Edge function missing STRIPE_SECRET_KEY or not deployed. MCP can list PIs but app creates them via edge."
    return
  }
  if (data?.client_secret && data?.id) {
    report.edge_payment_intent = `ok (${data.id})`
    report.note = "PaymentIntent create path works. App can present PaymentSheet when pk is loaded."
  } else {
    report.edge_payment_intent = `unexpected: ${JSON.stringify(data)?.slice(0, 120)}`
  }
}

await checkEdge()
console.log(JSON.stringify(report, null, 2))
if (!report.publishable_ready) process.exitCode = 2
