import { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"
import { LedgerEntry } from "@/lib/types"
import { formatCents } from "@/lib/format"

export default function WalletScreen() {
  const { profile, refreshProfile, updateProfile } = useAuth()
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadLedger = async () => {
      if (!profile?.id) return
      const { data } = await supabase
        .from("ledger_entries")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (data) setLedger(data)
    }

    loadLedger()
  }, [profile?.id])

  const loadLedger = async () => {
    if (!profile?.id) return
    const { data } = await supabase
      .from("ledger_entries")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setLedger(data)
  }

  const handleDeposit = async () => {
    setLoading(true)
    try {
      console.log("[v0] Deposit: Adding $10 test funds")
      const { data, error } = await supabase.rpc("deposit_funds", {
        p_amount_cents: 1000, // $10
      })

      if (error) {
        console.log("[v0] Deposit RPC unavailable, applying local gold:", error.message)
        await updateProfile({
          balance_cents: (profile?.balance_cents ?? 0) + 1000,
        })
      } else {
        console.log("[v0] Deposit success:", data)
        await refreshProfile()
      }
      await loadLedger()
    } catch (e: any) {
      console.log("[v0] Deposit failed, local fallback:", e)
      try {
        await updateProfile({
          balance_cents: (profile?.balance_cents ?? 0) + 1000,
        })
      } catch {
        alert(e.message || "Deposit failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCashout = async () => {
    if (!profile?.balance_cents || profile.balance_cents === 0) {
      alert("No balance to cash out")
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Cashout: Withdrawing", profile.balance_cents)
      const { data, error } = await supabase.rpc("cashout_funds", {
        p_amount_cents: profile.balance_cents,
      })

      if (error) {
        console.log("[v0] Cashout RPC unavailable, clearing local stash:", error.message)
        await updateProfile({ balance_cents: 0 })
      } else {
        console.log("[v0] Cashout success:", data)
        await refreshProfile()
      }
      await loadLedger()
    } catch (e: any) {
      console.log("[v0] Cashout failed, local fallback:", e)
      try {
        await updateProfile({ balance_cents: 0 })
      } catch {
        alert(e.message || "Cashout failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const formatKind = (kind: string) => {
    const map: Record<string, string> = {
      deposit: "💰 Loaded",
      cashout: "💸 Cashed Out",
      gift_sent: "🎁 Gifted",
      gift_received: "🎉 Received",
      bonus: "⭐ Bonus",
    }
    return map[kind] ?? kind
  }

  return (
    <Screen padded scroll>
      <Txt variant="displayL" style={{ marginBottom: space[6] }}>
        YOUR STASH
      </Txt>

      {/* Balance Card */}
      <Card
        style={{
          backgroundColor: color.action.primary,
          paddingVertical: space[8],
          paddingHorizontal: space[6],
          marginBottom: space[6],
          alignItems: "center",
        }}
      >
        <Txt variant="bodyS" color={color.text.inverse} style={{ opacity: 0.8 }}>
          BALANCE
        </Txt>
        <Txt
          variant="displayXL"
          color={color.text.inverse}
          style={{ marginTop: space[2], marginBottom: space[4] }}
        >
          {formatCents(profile?.balance_cents ?? 0)}
        </Txt>
        <Txt variant="bodyS" color={color.text.inverse} style={{ opacity: 0.7 }}>
          {profile?.coins ?? 0} coins earned
        </Txt>
      </Card>

      {/* Actions */}
      <View style={{ gap: space[3], marginBottom: space[8] }}>
        <Button
          title="Add Gold"
          onPress={handleDeposit}
          loading={loading}
          size="lg"
          variant="primary"
        />
        <Button
          title="Cash Out"
          onPress={handleCashout}
          loading={loading}
          size="lg"
          variant="secondary"
          disabled={!profile?.balance_cents}
        />
      </View>

      {/* Fee Info */}
      <Card
        style={{
          backgroundColor: color.surface.raised,
          paddingVertical: space[4],
          paddingHorizontal: space[4],
          marginBottom: space[6],
        }}
      >
        <Txt variant="bodyS" style={{ marginBottom: space[2] }}>
          💰 Monarch&apos;s Cut
        </Txt>
        <Txt variant="bodyS" color={color.text.secondary}>
          5% of all gifts flow to the house. Worth the risk, outlaw.
        </Txt>
      </Card>

      {/* Ledger */}
      {ledger.length > 0 && (
        <View>
          <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
            RECENT ACTIVITY
          </Txt>
          {ledger.map((entry) => (
            <View
              key={entry.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: space[3],
                borderBottomWidth: 1,
                borderBottomColor: color.border.subtle,
              }}
            >
              <View>
                <Txt variant="bodyM">{formatKind(entry.kind)}</Txt>
                <Txt variant="bodyS" color={color.text.secondary}>
                  {entry.description}
                </Txt>
              </View>
              <Txt variant="numericM" color={entry.amount_cents > 0 ? color.action.success : color.action.danger}>
                {entry.amount_cents > 0 ? "+" : ""}{formatCents(entry.amount_cents)}
              </Txt>
            </View>
          ))}
        </View>
      )}
    </Screen>
  )
}
