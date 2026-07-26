import { useEffect } from "react"
import { View, StyleSheet, Image } from "react-native"
import { useRouter } from "expo-router"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

const AnimatedImage = Animated.createAnimatedComponent(Image)

/** Splash — eagle dollar coin drop → route */
export default function Splash() {
  const router = useRouter()
  const { loading, session, profile, configured } = useAuth()

  const coinY = useSharedValue(-80)
  const coinOpacity = useSharedValue(0)
  const coinRotate = useSharedValue(-15)

  useEffect(() => {
    coinOpacity.value = withTiming(1, { duration: 280 })
    coinY.value = withSequence(
      withTiming(0, { duration: 560, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
      withTiming(-14, { duration: 140 }),
      withTiming(0, { duration: 160 }),
    )
    coinRotate.value = withDelay(120, withTiming(0, { duration: 600 }))
  }, [coinOpacity, coinRotate, coinY])

  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => {
      if (!configured || !session) {
        router.replace("/(auth)/welcome")
      } else if (!profile?.onboarded) {
        router.replace("/(onboarding)/choose-fate")
      } else {
        router.replace("/(app)")
      }
    }, 2800)
    return () => clearTimeout(t)
  }, [loading, session, profile, configured, router])

  const coinStyle = useAnimatedStyle(() => ({
    opacity: coinOpacity.value,
    transform: [{ translateY: coinY.value }, { rotate: `${coinRotate.value}deg` }],
  }))

  return (
    <View style={styles.container}>
      <AnimatedImage
        source={require("@/assets/art/eagle-coin.png")}
        style={[styles.coin, coinStyle]}
        resizeMode="contain"
        accessibilityLabel="Tin Cup eagle dollar coin"
      />
      <Txt variant="displayXL" color={color.action.primary} style={styles.word}>
        TIN CUP
      </Txt>
      <Txt variant="overline" color={color.text.tertiary} style={styles.sub}>
        Perdition Gulch
      </Txt>
      <Txt variant="caption" color={color.text.tertiary} style={styles.ver}>
        v1.0 · Season 1: Gold Rush
      </Txt>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  coin: {
    width: 120,
    height: 120,
    marginBottom: space[5],
  },
  word: {
    letterSpacing: 2,
    textShadowColor: "rgba(245,179,43,0.4)",
    textShadowRadius: 40,
    textShadowOffset: { width: 0, height: 0 },
  },
  sub: { marginTop: space[3], letterSpacing: 4 },
  ver: { position: "absolute", bottom: 36 },
})
