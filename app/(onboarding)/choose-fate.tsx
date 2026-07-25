import { useState } from "react"
import { View, ScrollView, Pressable, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"

export default function ChooseFate() {
  const router = useRouter()
  const { profile, wallet, signer, updateProfile } = useAuth()
  const [selected, setSelected] = useState<"drifter" | "lord" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const drifterDescription = "Free entry. No buy-in. Just guts and glory. Beg for spare coins or gift to strangers."
  const lordDescription = "Pay $100 USDT to join the Monarch's Circle. Your gifts land heavier. Earn a cut on every coin that flows through the gulch."

  const handleConfirm = async () => {
    if (!selected || !wallet || !profile?.id) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError("")

    try {
      let txHash = ""

      if (selected === "lord") {
        console.log("[v0] Processing Lord membership: $100 USDT")

        // Use RPC function for atomic Lord membership purchase
        const { data, error } = await supabase.rpc("become_lord", {
          p_amount_cents: 10000, // $100
        })

        if (error) {
          console.log("[v0] Lord membership error:", error)
          throw error
        }

        console.log("[v0] Lord membership success:", data)
        Alert.alert("Welcome, Lord", "You have ascended to the Monarch's Circle. Your gifts now carry more weight.")
      } else {
        console.log("[v0] Becoming Drifter (free)")
      }

      // Update profile with fate selection
      await updateProfile({
        fate: selected,
        is_lord: selected === "lord",
      })

      console.log("[v0] Profile updated, moving to character creation")
      router.push("/(onboarding)/create")
    } catch (e: any) {
      console.log("[v0] Choose fate error:", e)
      setError(e.message || "Transaction failed")
      Alert.alert("Error", e.message || "Failed to complete transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      <View style={{ paddingVertical: space[8] }}>
        <Txt variant="displayL" center>
          CHOOSE YOUR FATE
        </Txt>
        <Txt variant="bodyM" color={color.text.secondary} center style={{ marginTop: space[3] }}>
          You&apos;re in the Gulch now. Pick your way.
        </Txt>
        {error && (
          <Card style={{ backgroundColor: color.action.danger, marginTop: space[4], padding: space[3] }}>
            <Txt variant="bodyS" color={color.text.inverse}>{error}</Txt>
          </Card>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16} style={{ marginVertical: space[6] }}>
        {/* DRIFTER */}
        <Pressable
          onPress={() => setSelected("drifter")}
          style={{
            marginRight: space[4],
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Card
            style={{
              backgroundColor: selected === "drifter" ? color.surface.drifter : color.surface.idle,
              borderWidth: selected === "drifter" ? 2 : 0,
              borderColor: selected === "drifter" ? color.action.primary : "transparent",
              width: 280,
              paddingVertical: space[8],
              paddingHorizontal: space[6],
            }}
          >
            <Txt variant="headlineXL" color={selected === "drifter" ? color.text.primary : color.text.secondary} center>
              DRIFTER
            </Txt>
            <Txt variant="bodyS" color={selected === "drifter" ? color.text.primary : color.text.tertiary} center style={{ marginTop: space[3], marginBottom: space[6] }}>
              {drifterDescription}
            </Txt>
            <View
              style={{
                backgroundColor: selected === "drifter" ? color.action.primary : color.border.subtle,
                height: 60,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Txt variant="buttonL" color={selected === "drifter" ? color.text.inverse : color.text.secondary}>
                FREE
              </Txt>
            </View>
          </Card>
        </Pressable>

        {/* LORD */}
        <Pressable onPress={() => setSelected("lord")}>
          <Card
            style={{
              backgroundColor: selected === "lord" ? color.surface.lord : color.surface.idle,
              borderWidth: selected === "lord" ? 2 : 0,
              borderColor: selected === "lord" ? color.action.primary : "transparent",
              width: 280,
              paddingVertical: space[8],
              paddingHorizontal: space[6],
            }}
          >
            <Txt variant="headlineXL" color={selected === "lord" ? color.action.primary : color.text.secondary} center>
              MONARCH
            </Txt>
            <Txt variant="bodyS" color={selected === "lord" ? color.text.primary : color.text.tertiary} center style={{ marginTop: space[3], marginBottom: space[6] }}>
              {lordDescription}
            </Txt>
            <View
              style={{
                backgroundColor: selected === "lord" ? color.action.primary : color.border.subtle,
                height: 60,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Txt variant="buttonL" color={selected === "lord" ? color.text.inverse : color.text.secondary}>
                $100 BUY-IN
              </Txt>
            </View>
          </Card>
        </Pressable>
      </ScrollView>

      <View style={{ marginTop: "auto", marginBottom: space[6] }}>
        <Button
          onPress={handleConfirm}
          disabled={!selected || loading}
          loading={loading}
          size="large"
        >
          Take the Cup
        </Button>
      </View>
    </Screen>
  )
}
