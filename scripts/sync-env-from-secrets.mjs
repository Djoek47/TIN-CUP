#!/usr/bin/env node
/**
 * Writes local .env from Cloud Agent secrets / Supabase management API.
 * Safe to re-run. Never prints secret values.
 */
import fs from "node:fs"
import https from "node:https"

const REF = process.env.SUPABASE_PROJECT_REF || "wmeavdmmymawotzxxtuj"

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        let data = ""
        res.on("data", (c) => (data += c))
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`${res.statusCode} ${data.slice(0, 200)}`))
            return
          }
          try {
            resolve(JSON.parse(data))
          } catch {
            resolve(data)
          }
        })
      })
      .on("error", reject)
  })
}

async function main() {
  const stripePk =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    ""
  const stripeOk =
    (stripePk.startsWith("pk_test_") || stripePk.startsWith("pk_live_")) &&
    !stripePk.includes("your_")
  const out = {
    // Prefer auto when Stripe pk is present so deposit uses PaymentSheet; else mock for QA
    EXPO_PUBLIC_MONEY_MODE:
      process.env.EXPO_PUBLIC_MONEY_MODE || (stripeOk ? "auto" : "mock"),
    EXPO_PUBLIC_THIRDWEB_CLIENT_ID: process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || "",
    EXPO_PUBLIC_THIRDWEB_CHAIN: process.env.EXPO_PUBLIC_THIRDWEB_CHAIN || "base-sepolia",
    EXPO_PUBLIC_XAU_USD: process.env.EXPO_PUBLIC_XAU_USD || "2650",
    EXPO_PUBLIC_XAU_CAD: process.env.EXPO_PUBLIC_XAU_CAD || "3520",
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: stripePk,
    EXPO_PUBLIC_SUPABASE_URL:
      process.env.EXPO_PUBLIC_SUPABASE_URL || `https://${REF}.supabase.co`,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  }

  const token = process.env.SUPABASE_ACCESS_TOKEN
  if (token && !out.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    const keys = await get(`https://api.supabase.com/v1/projects/${REF}/api-keys`, {
      Authorization: `Bearer ${token}`,
    })
    const anon = (keys || []).find((k) => k.name === "anon" || k.id === "anon")
    if (anon?.api_key) out.EXPO_PUBLIC_SUPABASE_ANON_KEY = anon.api_key
  }

  const body = Object.entries(out)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n")
  fs.writeFileSync(".env", body + "\n")
  fs.writeFileSync(".env.local", body + "\n")
  console.log(
    `[sync-env] wrote .env (anon=${out.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "yes" : "no"}, thirdweb=${out.EXPO_PUBLIC_THIRDWEB_CLIENT_ID ? "yes" : "no"}, stripe=${stripeOk ? "yes" : "no"})`,
  )
}

main().catch((e) => {
  console.warn("[sync-env] skipped:", e.message)
  process.exit(0)
})
