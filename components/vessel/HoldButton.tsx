import { useRef, useState } from "react"
import { Pressable, View, StyleSheet, ViewStyle } from "react-native"
import { UiText } from "./MonoNum"
import { pure, space } from "@/theme/vessel"
import { useVessel } from "@/providers/VesselTheme"

/** Hold-to-confirm. progress 0..1 via rAF. Release before 1 resets. */
export function HoldButton({
  label,
  durationMs,
  onComplete,
  accent = "lim",
  style,
}: {
  label: string
  durationMs: number
  onComplete: () => void | Promise<void>
  accent?: "lim" | "amb"
  style?: ViewStyle
}) {
  const { v } = useVessel()
  const fill = accent === "amb" ? v.ambfill : v.limfill
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const start = useRef(0)

  const stop = (reset: boolean) => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = null
    start.current = 0
    if (reset) setProgress(0)
  }

  const tick = (t: number) => {
    if (!start.current) start.current = t
    const p = Math.min(1, (t - start.current) / durationMs)
    setProgress(p)
    if (p >= 1) {
      stop(false)
      setProgress(0)
      void onComplete()
      return
    }
    raf.current = requestAnimationFrame(tick)
  }

  return (
    <Pressable
      onPressIn={() => {
        start.current = 0
        raf.current = requestAnimationFrame(tick)
      }}
      onPressOut={() => stop(true)}
      style={[
        styles.btn,
        {
          borderColor: fill,
          borderRadius: v.radPill,
          height: space.btnH,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${progress * 100}%`,
          backgroundColor: fill,
          opacity: 0.35,
        }}
      />
      <UiText style={{ letterSpacing: 1.5, fontSize: 13 }}>{label}</UiText>
    </Pressable>
  )
}

export function PrimaryButton({
  title,
  onPress,
  tone = "amb",
  disabled,
}: {
  title: string
  onPress: () => void
  tone?: "amb" | "lim"
  disabled?: boolean
}) {
  const { v } = useVessel()
  const bg = tone === "lim" ? v.limfill : v.ambfill
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderRadius: v.radPill,
          height: space.btnH,
          opacity: disabled ? 0.4 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          borderWidth: 0,
        },
      ]}
    >
      <UiText weight="black" style={{ color: pure.fillInk, letterSpacing: 1.2, fontSize: 13 }}>
        {title}
      </UiText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    width: "100%",
  },
})
