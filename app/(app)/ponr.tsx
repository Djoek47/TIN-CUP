import { useRef, useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

/** S28 Point of No Return — Make PONRScreen (hold ~2s) */
export default function PonrScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progRef = useRef(0)

  const startHold = () => {
    timerRef.current = setInterval(() => {
      // 2s hold: +2 every 40ms → 100
      progRef.current += 2
      setProgress(progRef.current)
      if (progRef.current >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        router.replace("/(app)/coronation")
      }
    }, 40)
  }

  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    progRef.current = 0
    setProgress(0)
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={{ alignSelf: "flex-start" }}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, glass.card]}>
          <Ico.Back c={color.text.tertiary} s={18} />
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={[styles.door, glass.card]}>
          <View style={styles.doorGlow} />
          <View style={styles.knob} />
          <View style={styles.crack} />
        </View>
        <Txt style={styles.headline}>
          LORDS{"\n"}NEVER FALL.
        </Txt>
        <Txt style={styles.body}>
          Once you take the title, you can never beg again. No Vagrant days. No going back.
        </Txt>
        <Txt style={styles.ever}>Ever.</Txt>
      </View>

      <View style={{ width: "100%" }}>
        <Pressable
          onPressIn={startHold}
          onPressOut={endHold}
          style={[styles.holdBtn, glass.card]}
        >
          <View style={[styles.holdFill, { width: `${progress}%` }]} />
          <Txt
            style={[
              styles.holdTxt,
              { color: progress > 20 ? color.text.inverse : color.text.primary },
            ]}
          >
            {progress > 0 ? "Hold it..." : "Hold to swear the oath"}
          </Txt>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.notReady}>
          <Txt style={styles.notReadyTxt}>{"I'm not ready."}</Txt>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg.canvas,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  door: {
    width: 110,
    height: 148,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 36,
    overflow: "hidden",
  },
  doorGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(245,179,43,0.15)",
  },
  knob: {
    position: "absolute",
    right: 14,
    top: "50%",
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.action.primary,
  },
  crack: {
    position: "absolute",
    top: "25%",
    left: "15%",
    width: 2,
    height: "50%",
    backgroundColor: "rgba(245,179,43,0.4)",
    transform: [{ rotate: "-8deg" }],
  },
  headline: {
    fontFamily: font.display,
    fontSize: 34,
    color: color.action.primary,
    letterSpacing: 1.2,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 18,
  },
  body: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.text.secondary,
    lineHeight: 24,
    maxWidth: 270,
    textAlign: "center",
    marginBottom: 8,
  },
  ever: {
    fontFamily: font.headlineBold,
    fontSize: 15,
    color: color.text.primary,
  },
  holdBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(245,179,43,0.2)",
    justifyContent: "center",
  },
  holdFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.action.primaryHover,
    borderRadius: 14,
  },
  holdTxt: {
    fontFamily: font.headlineBold,
    fontSize: 15,
    textAlign: "center",
    zIndex: 1,
  },
  notReady: { paddingVertical: 8, alignItems: "center" },
  notReadyTxt: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.text.tertiary,
  },
})
