import { View, StyleSheet, ImageBackground, Pressable } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

/** Welcome screen aligned to Figma Make Tin-Cup-V2 */
export default function Welcome() {
  const router = useRouter()
  const { connectWallet, loading } = useAuth()

  const enterTown = async () => {
    try {
      await connectWallet()
      router.replace("/(onboarding)/choose-fate")
    } catch (e) {
      console.log("[v0] Wallet connection failed:", e)
    }
  }

  return (
    <Screen padded={false} edges={["bottom"]}>
      <ImageBackground
        source={require("@/assets/art/townscape.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(11,14,20,0.2)", "rgba(11,14,20,0.6)", color.bg.canvas]}
          locations={[0, 0.55, 0.88]}
          style={styles.scrim}
        >
          <View style={styles.top}>
            <Txt variant="displayXL" color={color.action.primary} center style={styles.word}>
              TIN CUP
            </Txt>
            <Txt variant="overline" color={color.text.tertiary} style={styles.est}>
              Perdition Gulch · Est. Now
            </Txt>
          </View>

          <View style={styles.mid}>
            <Txt variant="bodyM" color={color.text.secondary} center style={styles.tagline}>
              Where strangers throw real gold at strangers — for glory, for laughs, for the story.
            </Txt>
          </View>

          <View style={styles.bottom}>
            <Button title="Walk into town" onPress={enterTown} loading={loading} size="lg" />
            <Txt variant="caption" color={color.text.tertiary} center>
              Look around free. No account till you touch money.
            </Txt>
            <Pressable onPress={enterTown} style={styles.signIn}>
              <Txt variant="buttonM" color={color.text.secondary} center>
                I&apos;ve been here before
              </Txt>
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
  word: {
    letterSpacing: 2,
    textShadowColor: "rgba(245,179,43,0.35)",
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  est: { marginTop: space[2], letterSpacing: 3 },
  mid: { alignItems: "center", paddingHorizontal: space[3] },
  tagline: { maxWidth: 280, lineHeight: 24 },
  bottom: { gap: space[3], paddingBottom: space[5] },
  signIn: { paddingVertical: space[3] },
})
