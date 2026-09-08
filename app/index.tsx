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
import { color, font, space } from "@/theme/tokens"

const AnimatedImage = Animated.createAnimatedComponent(Image)

/** S01 Splash — Make: coin drop → welcome / app */
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
    <View style={styles.container} accessibilityLabel="Tin Cup, loading">
      <AnimatedImage
        source={require("@/assets/art/eagle-coin.png")}
        style={[styles.coin, coinStyle]}
        resizeMode="contain"
      />
      <Txt
        style={{
          fontFamily: font.display,
          fontSize: 50,
          color: color.action.primary,
          letterSpacing: 2.5,
          lineHeight: 54,
          textShadowColor: "rgba(245,179,43,0.4)",
          textShadowRadius: 50,
          textShadowOffset: { width: 0, height: 0 },
        }}
      >
        TIN CUP
      </Txt>
      <Txt
        style={{
          fontFamily: font.headlineBlack,
          fontSize: 10,
          letterSpacing: 4.8,
          color: color.text.tertiary,
          textTransform: "uppercase",
          marginTop: 10,
        }}
      >
        Perdition Gulch
      </Txt>
      <Txt
        style={{
          position: "absolute",
          bottom: 36,
          fontFamily: font.body,
          fontSize: 11,
          color: color.text.tertiary,
        }}
      >
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
  coin: { width: 72, height: 72, marginBottom: space[5] + 4 },
})
