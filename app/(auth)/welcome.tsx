import { View, StyleSheet, ImageBackground } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

export default function Welcome() {
  const router = useRouter()
  const { connectWallet, loading } = useAuth()

  const handleConnectWallet = async () => {
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
          colors={["rgba(11,14,20,0.35)", "rgba(11,14,20,0.85)", color.bg.canvas]}
          locations={[0, 0.6, 1]}
          style={styles.scrim}
        >
          <View style={styles.top}>
            <Txt variant="overline" color={color.action.primary}>
              PERDITION GULCH
            </Txt>
            <Txt variant="displayXL" color={color.action.primary} center style={styles.word}>
              TIN CUP
            </Txt>
            <Txt variant="bodyM" color={color.text.secondary} center style={styles.tagline}>
              Where strangers throw real money at strangers — for glory, for laughs, for the story.
            </Txt>
          </View>

          <View style={styles.bottom}>
            <Button
              onPress={handleConnectWallet}
              loading={loading}
              size="large"
            >
              🔗 Connect Wallet
            </Button>
            <Txt variant="caption" color={color.text.tertiary} center style={styles.note}>
              Sign in with MetaMask, Rainbow, or any Web3 wallet on Polygon Mumbai testnet.
            </Txt>
            <Button
              variant="ghost"
              onPress={() => router.replace("/(app)")}
            >
              Browse as guest
            </Button>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scrim: { flex: 1, justifyContent: "space-between", paddingHorizontal: space[5] },
  top: { alignItems: "center", marginTop: space[9] },
  word: { marginTop: space[2] },
  tagline: { marginTop: space[4], maxWidth: 320 },
  bottom: { gap: space[3], paddingBottom: space[4] },
  note: { marginTop: -space[1] },
})
