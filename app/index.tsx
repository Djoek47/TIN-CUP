import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ObolMark,
  PrimaryButton,
  UiText,
  Label,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { motion, space, pure } from "@/theme/vessel"

/** Splash — vessel fill, wordmark, ENTER THE ARENA / resume session */
export default function Splash() {
  const router = useRouter()
  const { v } = useVessel()
  const { ready, user } = useApp()
  const [fill, setFill] = useState(0.02)
  const [showMark, setShowMark] = useState(false)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    const delay = 250
    const duration = motion.fillMs
    let raf = 0
    const t0 = Date.now()

    const tick = () => {
      const elapsed = Date.now() - t0 - delay
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3.2)
      setFill(0.02 + eased * 0.98)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const markT = setTimeout(() => setShowMark(true), 1500)
    const ctaT = setTimeout(() => setShowCta(true), 2200)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(markT)
      clearTimeout(ctaT)
    }
  }, [])

  return (
    <VesselScreen nav={false}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <ObolMark size={112} fill={fill} moment="crossing" />
          {showMark ? (
            <View style={styles.markBlock}>
              <UiText
                weight="black"
                style={[styles.wordmark, { color: v.ink, letterSpacing: v.track * 10 }]}
              >
                0bol
              </UiText>
              <Label style={{ color: pure.amber, letterSpacing: 3, marginTop: 10 }}>
                A COIN FOR THE CROSSING
              </Label>
            </View>
          ) : (
            <View style={{ height: 72 }} />
          )}
        </View>

        <View style={styles.footer}>
          {showCta ? (
            <PrimaryButton
              title={ready && user.address ? "CONTINUE SESSION" : "ENTER THE ARENA"}
              tone="amb"
              onPress={() => {
                if (ready && user.address) router.replace("/(app)")
                else router.push("/(auth)/welcome")
              }}
            />
          ) : (
            <View style={{ height: space.btnH }} />
          )}
          <Label style={{ textAlign: "center", marginTop: 14, color: v.faint }}>
            Mock gold first · Entertainment · Culture
          </Label>
        </View>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  markBlock: { alignItems: "center" },
  wordmark: {
    fontSize: 33,
    letterSpacing: 4,
  },
  footer: {
    paddingBottom: 8,
  },
})
