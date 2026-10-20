/**
 * Server money rails — Connect onboarding, cash-out payout, gift RPC, balance pull.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { xauSpot, FiatCurrency, goldMgToFiat } from "@/lib/gold"
import type { Balance } from "@/lib/vessel-types"

export async function fetchProfileBalance(userId: string): Promise<Balance | null> {
  if (!isSupabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "gold_mg_available, gold_mg_hold, gold_mg_total, display_currency, mass_unit, balance_cents, stripe_account_id, stripe_payouts_enabled",
    )
    .eq("id", userId.toLowerCase())
    .maybeSingle()
  if (error || !data) {
    if (error) console.warn("[money] fetchProfileBalance", error.message)
    return null
  }
  const cur = (data.display_currency || "USD") as FiatCurrency
  const available = Number(data.gold_mg_available || 0)
  const hold = Number(data.gold_mg_hold || 0)
  const total = Number(data.gold_mg_total || 0)
  return {
    gold_mg_available: available,
    gold_mg_hold: hold,
    gold_mg_total: total,
    hidden: false,
    displayCurrency: cur,
    massUnit: (data.mass_unit as Balance["massUnit"]) || "g",
    available: goldMgToFiat(available, cur),
    hold: goldMgToFiat(hold, cur),
    total: goldMgToFiat(total, cur),
    coinDust: 0,
  }
}

export async function rpcSendGoldGift(params: {
  toHandle: string
  amountFiat: number
  currency: FiatCurrency
  message?: string
}) {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { data, error } = await supabase.rpc("send_gold_gift", {
    p_to_handle: params.toHandle.replace(/^@/, ""),
    p_fiat_cents: Math.round(params.amountFiat * 100),
    p_currency: params.currency,
    p_xau_rate: xauSpot(params.currency),
    p_message: params.message ?? null,
  })
  if (error) throw error
  return data
}

export async function rpcHoldGold(params: {
  amountFiat: number
  kind: string
  label: string
  currency: FiatCurrency
}) {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { data, error } = await supabase.rpc("hold_gold_escrow", {
    p_fiat_cents: Math.round(params.amountFiat * 100),
    p_kind: params.kind,
    p_label: params.label,
    p_currency: params.currency,
    p_xau_rate: xauSpot(params.currency),
  })
  if (error) throw error
  return data
}

export async function startConnectOnboarding(returnUrl = "obol://wallet"): Promise<string> {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { data, error } = await supabase.functions.invoke("create-connect-account", {
    body: { return_url: returnUrl },
  })
  if (error || !data?.url) throw new Error(error?.message || data?.error || "Connect failed")
  return data.url as string
}

export async function requestCashOutPayout(amountFiat: number, currency: FiatCurrency) {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { data, error } = await supabase.functions.invoke("cash-out-payout", {
    body: {
      amount_cents: Math.round(amountFiat * 100),
      currency: currency.toLowerCase(),
    },
  })
  if (error || data?.error) throw new Error(error?.message || data?.error || "Cash out failed")
  return data
}

export async function fetchConnectStatus(userId: string) {
  if (!isSupabaseConfigured || !userId) return null
  const { data } = await supabase
    .from("profiles")
    .select("stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
    .eq("id", userId.toLowerCase())
    .maybeSingle()
  return data
}
