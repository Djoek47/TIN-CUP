import { useState } from "react"
import { View, StyleSheet, ImageBackground, Pressable, ActivityIndicator, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { GoldButton } from "@/components/gds/GoldButton"
import { useAuth } from "@/providers/AuthProvider"
import { color, font, space } from "@/theme/tokens"

/** S03 Welcome — exact Make copy */
export default function Welcome() {
  const router = useRouter()
  const { connectWallet } = useAuth()
  const [busy, setBusy] = useState(false)

  const enter = async (mode: "new" | "returning") => {
    if (busy) return
    setBusy(true)
    try {
      const next = await connectWallet()
      if (mode === "returning" && next?.onboarded) {
        router.replace("/(app)")
      } else if (next?.onboarded) {
        router.replace("/(app)")
      } else {
        router.replace("/(onboarding)/choose-fate")
      }
    } catch (e) {
      console.log("[v0] Enter town failed:", e)
      router.replace("/(onboarding)/choose-fate")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen padded={false} edges={["bottom"]}>
      <ImageBackground source={require("@/assets/art/townscape.png")} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={["rgba(11,14,20,0.2)", "rgba(11,14,20,0.6)", color.bg.canvas]}
          locations={[0, 0.55, 0.88]}
          style={styles.scrim}
        >
          <View style={styles.top}>
            <Image
              source={require("@/assets/art/eagle-coin.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Tin Cup eagle dollar coin logo"
            />
            <Txt
              style={{
                fontFamily: font.display,
                fontSize: 42,
                color: color.action.primary,
                letterSpacing: 2.5,
                textShadowColor: "rgba(245,179,43,0.33)",
                textShadowRadius: 40,
                textShadowOffset: { width: 0, height: 0 },
              }}
            >
              TIN CUP
            </Txt>
            <Txt
              style={{
                fontFamily: font.headlineBlack,
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: color.text.tertiary,
                marginTop: 10,
              }}
            >
              Perdition Gulch · Est. Now
            </Txt>
          </View>

          <View style={styles.mid}>
            <Txt
              style={{
                fontFamily: font.body,
                fontSize: 15,
                color: color.text.secondary,
                lineHeight: 24,
                textAlign: "center",
                maxWidth: 280,
              }}
            >
              Where strangers throw real gold at strangers — for glory, for laughs, for the story.
            </Txt>
          </View>

          <View style={styles.bottom}>
            <GoldButton title="Walk into town" onPress={() => enter("new")} loading={busy} disabled={busy} />
            <Txt
              style={{
                fontFamily: font.body,
                fontSize: 12,
                color: color.text.tertiary,
                textAlign: "center",
              }}
            >
              Look around free. No account till you touch money.
            </Txt>
            <Pressable
              onPress={() => enter("returning")}
              style={styles.signIn}
              disabled={busy}
              accessibilityRole="button"
            >
              {busy ? (
                <ActivityIndicator color={color.text.secondary} />
              ) : (
                <Txt
                  style={{
                    fontFamily: font.headlineSemi,
                    fontSize: 15,
                    color: color.text.secondary,
                    textAlign: "center",
                  }}
                >
                  I&apos;ve been here before
                </Txt>
              )}
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scrim: { flex: 1, justifyContent: "space-between", paddingHorizontal: space[5] },
  top: { alignItems: "center", marginTop: space[9] + 8 },
  logo: { width: 72, height: 72, marginBottom: space[2] },
  mid: { alignItems: "center", paddingHorizontal: space[3] },
  bottom: { gap: space[3], paddingBottom: space[5] },
  signIn: { paddingVertical: space[3], minHeight: 48, justifyContent: "center" },
})
