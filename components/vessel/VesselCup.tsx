import { View, StyleSheet } from "react-native"
import Svg, { Defs, ClipPath, Path, LinearGradient, Stop, Rect } from "react-native-svg"
import { pure } from "@/theme/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { Label } from "./MonoNum"

/** Glass vessel cup with liquid fill 0..1 */
export function VesselCup({
  fill = 0.55,
  width = 56,
  height = 96,
  showMeniscus = true,
}: {
  fill?: number
  width?: number
  height?: number
  showMeniscus?: boolean
}) {
  const { v, isLord } = useVessel()
  const clamped = Math.max(0.02, Math.min(1, fill))
  const liquidTop = height * (1 - clamped) * 0.72 + height * 0.12

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 126 150">
        <Defs>
          <ClipPath id="cup">
            <Path d="M24 10 L102 10 L88 134 Q63 141 38 134 Z" />
          </ClipPath>
          <LinearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={isLord ? pure.amber : pure.amber} />
            <Stop offset="100%" stopColor={isLord ? pure.bone : pure.lime} stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Path
          d="M24 10 L102 10 L88 134 Q63 141 38 134 Z"
          fill="none"
          stroke={v.gls}
          strokeWidth={2}
        />
        <Rect x="20" y={liquidTop} width="90" height={150} fill="url(#liq)" clipPath="url(#cup)" />
        {showMeniscus ? (
          <Rect x="24" y={liquidTop} width="78" height={2.5} fill="#fff" clipPath="url(#cup)" opacity={0.9} />
        ) : null}
      </Svg>
    </View>
  )
}

export function PureAmberFill() {
  return null
}

export function ImageSlot({
  label,
  height = 180,
  radius,
}: {
  label: string
  height?: number
  radius?: number
}) {
  const { v } = useVessel()
  return (
    <View
      style={{
        height,
        borderRadius: radius ?? v.rad,
        backgroundColor: v.surf,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: v.line,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Label style={{ textAlign: "center", paddingHorizontal: 16 }}>{label}</Label>
    </View>
  )
}
