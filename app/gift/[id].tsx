import { useEffect, useState } from "react"
import { View, Pressable, Animated, Easing } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { BlurView } from "expo-blur"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"
import { Beg, Profile } from "@/lib/types"
import { formatCents } from "@/lib/format"

const SPECTACLES = ["coins", "fireworks", "confetti", "rain", "sparkles"]

export default function GiftScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { profile, refreshProfile } = useAuth()
  const [beg, setBeg] = useState<Beg & { author: Profile }>(null as any)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [amountCents, setAmountCents] = useState("500")
  const [message, setMessage] = useState("")
  const [spectacle, setSpectacle] = useState<string>("coins")
  const [showSpectacle, setShowSpectacle] = useState(false)
  const [error, setError] = useState("")
  const scaleAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    const loadBeg = async () => {
      if (!id) return
      const { data } = await supabase
        .from("begs")
        .select("*, author:author_id(display_name, title, face, hat)")
        .eq("id", id)
        .maybeSingle()

      if (data) {
        setBeg(data as any)
      }
      setLoading(false)
    }

    loadBeg()
  }, [id])

  const handleSendGift = async () => {
    if (!profile?.id || !beg?.id) {
      setError("Not ready to send.")
      return
    }

    const amount = parseInt(amountCents || "0")
    if (amount <= 0) {
      setError("Enter an amount, outlaw.")
      return
    }
    if (amount > (profile.balance_cents || 0)) {
      setError("Not enough gold in your cup.")
      return
    }

    setSending(true)
    setError("")

    try {
      const { error: err } = await supabase.rpc("send_gift", {
        p_recipient: beg.author_id,
        p_amount_cents: amount,
        p_beg_id: beg.id,
        p_message: message || null,
        p_spectacle: spectacle,
      })

      if (err) throw err

      // Play spectacle animation
      setShowSpectacle(true)
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()

      await new Promise((resolve) => setTimeout(resolve, 2000))

      await refreshProfile()
      router.back()
    } catch (e: any) {
      setError(e.message || "Failed to send gift")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Screen>
        <Txt variant="bodyM">Loading...</Txt>
      </Screen>
    )
  }

  if (!beg) {
    return (
      <Screen>
        <Txt variant="bodyM">Beg not found.</Txt>
      </Screen>
    )
  }

  return (
    <BlurView intensity={90} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: space[4],
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 320,
            paddingVertical: space[6],
            paddingHorizontal: space[4],
            backgroundColor: color.bg.canvas,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ alignSelf: "flex-start", marginBottom: space[4] }}>
            <Txt variant="bodyM" color={color.text.secondary}>
              ✕
            </Txt>
          </Pressable>

          <View style={{ alignItems: "center", marginBottom: space[6] }}>
            <Txt
              variant="displayXL"
              style={{
                fontSize: 48,
                marginBottom: space[2],
              }}
            >
              {beg.author?.face || "🤠"}
            </Txt>
            <Txt variant="headlineM" center>
              {beg.title}
            </Txt>
            <Txt variant="bodyS" color={color.text.secondary} center style={{ marginTop: space[2] }}>
              {beg.author?.display_name}
            </Txt>
          </View>

          {error && (
            <Card
              style={{
                backgroundColor: color.action.danger,
                paddingVertical: space[2],
                paddingHorizontal: space[3],
                marginBottom: space[4],
              }}
            >
              <Txt variant="bodyS" color={color.text.inverse}>
                {error}
              </Txt>
            </Card>
          )}

          <Field
            label="AMOUNT (DOLLARS)"
            placeholder="5.00"
            value={amountCents}
            onChangeText={setAmountCents}
            keyboardType="decimal-pad"
            style={{ marginBottom: space[4] }}
          />

          <Field
            label="MESSAGE (OPTIONAL)"
            placeholder="Break a leg out there"
            value={message}
            onChangeText={setMessage}
            style={{ marginBottom: space[4] }}
          />

          <View style={{ marginBottom: space[6] }}>
            <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[2] }}>
              SPECTACLE
            </Txt>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              {SPECTACLES.map((s) => (
                <Button
                  key={s}
                  variant={spectacle === s ? "primary" : "secondary"}
                  size="small"
                  onPress={() => setSpectacle(s)}
                  style={{ flex: 0 }}
                >
                  {s}
                </Button>
              ))}
            </View>
          </View>

          <Button
            onPress={handleSendGift}
            loading={sending}
            size="large"
            style={{ marginBottom: space[4] }}
          >
            Toss the Gold
          </Button>

          <Txt variant="bodyS" color={color.text.secondary} center>
            Your balance: {formatCents(profile?.balance_cents ?? 0)}
          </Txt>

          {showSpectacle && (
            <View style={{ position: "absolute", top: "50%", left: "50%", alignItems: "center" }}>
              <Animated.Text
                style={{
                  fontSize: 60,
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [1, 1, 0],
                  }),
                }}
              >
                {spectacle === "coins" ? "🪙" : spectacle === "fireworks" ? "🎆" : spectacle === "confetti" ? "🎉" : spectacle === "rain" ? "💧" : "✨"}
              </Animated.Text>
            </View>
          )}
        </Card>
      </View>
    </BlurView>
  )
}
