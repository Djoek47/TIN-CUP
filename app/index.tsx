import { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

export default function Splash() {
  const router = useRouter()
  const { loading, session, profile, configured } = useAuth()

  const coinY = useSharedValue(-90)
  const coinOpacity = useSharedValue(0)
  const coinRotate = useSharedValue(-15)

  useEffect(() => {
    coinOpacity.value = withTiming(1, { duration: 200 })
    coinY.value = withSequence(
      withTiming(6, { duration: 480, easing: Easing.bezier(0.34, 1.2, 0.64, 1) }),
      withTiming(0, { duration: 220 }),
    )
    coinRotate.value = withDelay(120, withTiming(0, { duration: 500 }))
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
    }, 1200)
    return () => clearTimeout(t)
  }, [loading, session, profile, configured, router])

  const coinStyle = useAnimatedStyle(() => ({
    opacity: coinOpacity.value,
    transform: [{ translateY: coinY.value }, { rotate: `${coinRotate.value}deg` }],
  }))

  return (
    <View style={styles.container}>
      <View style={styles.stack}>
        <Animated.View style={coinStyle}>
          <MaterialCommunityIcons name="poker-chip" size={44} color={color.action.primary} />
        </Animated.View>
        <MaterialCommunityIcons name="cup" size={78} color={color.text.secondary} style={styles.cup} />
      </View>
      <Txt variant="displayL" color={color.action.primary} style={styles.word}>
        TIN CUP
      </Txt>
      <Txt variant="caption" color={color.text.tertiary}>
        PERDITION GULCH · v1.0
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
    gap: space[3],
  },
  stack: { height: 120, alignItems: "center", justifyContent: "flex-end" },
  cup: { marginTop: -14 },
  word: { marginTop: space[4] },
})
