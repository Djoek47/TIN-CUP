#!/usr/bin/env node
/**
 * Provision two mock QA identities in Supabase (vagrant + lord) with fake gold.
 * Run: node --env-file=.env scripts/seed-demo-accounts.mjs
 */
import { createClient } from "@supabase/supabase-js"

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error("Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const XAU = 2650
const TROY_MG = 31103.4768
const fiatToGoldMg = (usd) => usd / (XAU / TROY_MG)

const ACCOUNTS = [
  {
    role: "vagrant",
    id: "0x1111111111111111111111111111111111111111",
    handle: "dusty",
    display_name: "Dusty",
    bio: "Vagrant QA — go live, challenges, cash out, ascend.",
    fate: "vagrant",
    is_lord: false,
    available: 250,
    hold: 50,
  },
  {
    role: "lord",
    id: "0x2222222222222222222222222222222222222222",
    handle: "baron",
    display_name: "Baron",
    bio: "Lord QA — fund bounties, pour gifts, court.",
    fate: "lord",
    is_lord: true,
    available: 2500,
    hold: 500,
  },
]

const supabase = createClient(url, key)

async function main() {
  console.log("Provisioning dual-caste mock accounts…")
  for (const a of ACCOUNTS) {
    const gold_mg_available = fiatToGoldMg(a.available)
    const gold_mg_hold = fiatToGoldMg(a.hold)
    const gold_mg_total = gold_mg_available + gold_mg_hold
    const balance_cents = Math.round((a.available + a.hold) * 100)

    const { error: pErr } = await supabase.from("profiles").upsert(
      {
        id: a.id.toLowerCase(),
        handle: a.handle,
        display_name: a.display_name,
        bio: a.bio,
        fate: a.fate,
        is_lord: a.is_lord,
        onboarded: true,
        coins: 0,
        balance_cents,
        gold_mg_available,
        gold_mg_hold,
        gold_mg_total,
        display_currency: "USD",
        mass_unit: "g",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    if (pErr) throw pErr

    // Clear prior seed ledger rows for this user (best-effort)
    await supabase.from("ledger_entries").delete().eq("user_id", a.id.toLowerCase()).eq("kind", "deposit")

    const { error: lErr } = await supabase.from("ledger_entries").insert({
      user_id: a.id.toLowerCase(),
      kind: "deposit",
      amount_cents: balance_cents,
      description: "Mock escrow provision",
      gold_mg: gold_mg_total,
      fiat_cents: balance_cents,
      currency: "USD",
      xau_rate: XAU,
      rail: "mock",
      escrow_status: "held",
    })
    if (lErr) throw lErr

    const { error: nErr } = await supabase.from("notifications").insert({
      user_id: a.id.toLowerCase(),
      kind: "system",
      title: `${a.display_name} ready`,
      body: `Mock ${a.role} provisioned with $${a.available + a.hold}`,
    })
    if (nErr) throw nErr

    console.log(`✓ ${a.role} @${a.handle} ${a.id.slice(0, 10)}… · $${a.available + a.hold} mock`)
  }

  // Clear old seed begs — feeds should only show real composed begs
  const vagrantId = ACCOUNTS[0].id.toLowerCase()
  await supabase.from("begs").delete().eq("author_id", vagrantId).eq("title", "Mock rent beg")
  console.log("✓ Cleared seed begs (compose real ones in-app)")

  console.log("\nDone. In the app: Connect → ENTER AS VAGRANT / ENTER AS LORD")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
