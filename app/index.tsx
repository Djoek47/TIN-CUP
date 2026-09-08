import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  VesselCup,
  PrimaryButton,
  UiText,
  Label,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { motion, space, pure } from "@/theme/vessel"

/** Splash — vessel fill, wordmark, ENTER THE ARENA */
export default function Splash() {
  const router = useRouter()
  const { v } = useVessel()
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
      // liquid ease approximation of cubic-bezier(.22,1,.28,1)
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
          <VesselCup fill={fill} width={92} height={148} />
          {showMark ? (
            <View style={styles.markBlock}>
              <UiText
                weight="black"
                style={[
                  styles.wordmark,
                  { color: v.ink, letterSpacing: v.track * 10 },
                ]}
              >
                TIN CUP
              </UiText>
              <Label style={{ color: pure.amber, letterSpacing: 3, marginTop: 10 }}>
                LIVE GENEROSITY. REAL STORIES.
              </Label>
            </View>
          ) : (
            <View style={{ height: 72 }} />
          )}
        </View>

        <View style={styles.footer}>
          {showCta ? (
            <PrimaryButton
              title="ENTER THE ARENA"
              tone="amb"
              onPress={() => router.push("/(auth)/welcome")}
            />
          ) : (
            <View style={{ height: space.btnH }} />
          )}
          <Label style={{ textAlign: "center", marginTop: 14, color: v.faint }}>
            Not a charity · Entertainment · Culture
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
