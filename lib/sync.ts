/**
 * Sync AppState money/profile events to Supabase (anon + open RLS for TestFlight MVP).
 * Does not depend on supabase.auth — profiles are keyed by wallet address.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { AppUser, Balance, LedgerEntry, Caste } from "@/lib/vessel-types"

export async function upsertProfile(params: {
  address: string
  user: AppUser
  caste: Caste
  balance: Balance
}) {
  if (!isSupabaseConfigured || !params.address) return
  const { address, user, caste, balance } = params
  const { error } = await supabase.from("profiles").upsert(
    {
      id: address.toLowerCase(),
      handle: user.handle,
      display_name: user.displayName,
      bio: user.bio,
      fate: caste,
      is_lord: caste === "lord",
      onboarded: true,
      balance_cents: Math.round(balance.available * 100),
      gold_mg_available: balance.gold_mg_available,
      gold_mg_hold: balance.gold_mg_hold,
      gold_mg_total: balance.gold_mg_total,
      display_currency: balance.displayCurrency,
      mass_unit: balance.massUnit,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  )
  if (error) console.warn("[sync] upsertProfile", error.message)
}

export async function insertLedger(entry: LedgerEntry, address: string | null) {
  if (!isSupabaseConfigured || !address) return
  const { error } = await supabase.from("ledger_entries").insert({
    user_id: address.toLowerCase(),
    kind: entry.kind,
    amount_cents: entry.fiat_cents,
    description: entry.who,
    gold_mg: entry.gold_mg,
    fiat_cents: entry.fiat_cents,
    currency: entry.currency,
    xau_rate: entry.xau_rate,
    rail: entry.rail,
    escrow_status: entry.escrow_status,
    created_at: new Date(entry.ts).toISOString(),
  })
  if (error) console.warn("[sync] insertLedger", error.message)
}

export async function insertNotification(params: {
  address: string
  kind: string
  title: string
  body: string
}) {
  if (!isSupabaseConfigured || !params.address) return
  const { error } = await supabase.from("notifications").insert({
    user_id: params.address.toLowerCase(),
    kind: params.kind,
    title: params.title,
    body: params.body,
  })
  if (error) console.warn("[sync] insertNotification", error.message)
}

export async function fetchRemoteLedger(address: string): Promise<LedgerEntry[] | null> {
  if (!isSupabaseConfigured || !address) return null
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("user_id", address.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(50)
  if (error || !data) {
    if (error) console.warn("[sync] fetchRemoteLedger", error.message)
    return null
  }
  return data.map((row: any) => ({
    id: String(row.id),
    dir: (row.fiat_cents ?? 0) >= 0 && row.kind !== "cashout" && row.kind !== "gift_sent" ? "in" : "out",
    who: row.description || row.kind,
    gold_mg: Number(row.gold_mg ?? 0),
    fiat_cents: Number(row.fiat_cents ?? row.amount_cents ?? 0),
    currency: (row.currency || "USD") as "USD" | "CAD",
    xau_rate: Number(row.xau_rate ?? 2650),
    rail: (row.rail || "mock") as any,
    escrow_status: (row.escrow_status || "held") as any,
    kind: (row.kind === "deposit"
      ? "deposit"
      : row.kind === "cashout"
        ? "cash"
        : row.kind?.includes("gift")
          ? "gift"
          : "other") as LedgerEntry["kind"],
    ts: new Date(row.created_at).getTime(),
    amount: Math.abs(Number(row.fiat_cents ?? row.amount_cents ?? 0)) / 100,
  }))
}

export async function fetchNotifications(address: string) {
  if (!isSupabaseConfigured || !address) return []
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", address.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(40)
  if (error) {
    console.warn("[sync] fetchNotifications", error.message)
    return []
  }
  return data ?? []
}
