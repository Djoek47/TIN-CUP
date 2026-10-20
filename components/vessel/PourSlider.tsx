import { useMemo } from "react"
import { View, StyleSheet, LayoutChangeEvent } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated"
import { useVessel } from "@/providers/VesselTheme"
import { Label, MonoNum } from "./MonoNum"
import { VesselCup } from "./VesselCup"

/** Vertical drag-to-pour. amount = round(pour*max/step)*step */
export function PourSlider({
  value,
  onChange,
  max = 500,
  step = 5,
  min = 5,
}: {
  value: number
  onChange: (n: number) => void
  max?: number
  step?: number
  min?: number
}) {
  const { v } = useVessel()
  const height = useSharedValue(220)
  const fill = useMemo(() => Math.max(0.02, Math.min(1, value / max)), [value, max])

  const commit = (y: number, h: number) => {
    const ratio = 1 - Math.max(0, Math.min(1, y / h))
    const raw = Math.max(min, Math.min(max, ratio * max))
    const quantized = Math.max(min, Math.round(raw / step) * step)
    onChange(quantized)
  }

  const pan = Gesture.Pan().onUpdate((e) => {
    runOnJS(commit)(e.y, height.value)
  })

  return (
    <GestureDetector gesture={pan}>
      <View
        style={styles.wrap}
        onLayout={(e: LayoutChangeEvent) => {
          height.value = e.nativeEvent.layout.height
        }}
      >
        <View style={{ flex: 1 }}>
          <Label>POUR AN AMOUNT</Label>
          <MonoNum style={{ fontSize: 48, color: v.amb, marginTop: 8 }}>${value}</MonoNum>
        </View>
        <VesselCup fill={fill} width={64} height={140} />
      </View>
    </GestureDetector>
  )
}

/** Horizontal cash-out drag, quantized to $25 */
export function CashSlider({
  value,
  onChange,
  max,
  step = 25,
}: {
  value: number
  onChange: (n: number) => void
  max: number
  step?: number
}) {
  const { v } = useVessel()
  const width = useSharedValue(300)
  const ratio = max > 0 ? value / max : 0

  const commit = (x: number, w: number) => {
    const r = Math.max(0, Math.min(1, x / w))
    const raw = r * max
    onChange(Math.round(raw / step) * step)
  }

  const pan = Gesture.Pan().onUpdate((e) => {
    runOnJS(commit)(e.x, width.value)
  })

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${ratio * 100}%`,
  }))

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{ paddingVertical: 20 }}
        onLayout={(e) => {
          width.value = e.nativeEvent.layout.width
        }}
      >
        <View style={[styles.track, { backgroundColor: v.line }]}>
          <View style={{ width: `${ratio * 100}%`, height: "100%", backgroundColor: v.limfill }} />
          <Animated.View
            style={[
              styles.thumb,
              { backgroundColor: v.limfill, marginLeft: -10 },
              thumbStyle,
            ]}
          />
        </View>
        <View style={styles.cashLabels}>
          <Label>$0</Label>
          <Label>SLIDE TO SET</Label>
          <Label>MAX</Label>
        </View>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 160 },
  track: { height: 4, borderRadius: 2, overflow: "visible", justifyContent: "center" },
  thumb: { position: "absolute", width: 20, height: 20, borderRadius: 10, top: -8 },
  cashLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
})
