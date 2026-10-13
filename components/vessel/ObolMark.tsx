import { useEffect, useRef } from "react"
import { Animated, View, StyleSheet, Image, ImageSourcePropType } from "react-native"
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G, Line } from "react-native-svg"
import { pure } from "@/theme/vessel"
import { useVessel } from "@/providers/VesselTheme"

export type ObolMoment = "idle" | "arrival" | "handoff" | "crossing" | "milled"

type Props = {
  size?: number
  fill?: number
  moment?: ObolMoment
  /** Prefer raster brand assets when available */
  useRaster?: boolean
}

const SURFACE_Y = 56 // locked per brand README — never move

const RASTER: Partial<Record<string, ImageSourcePropType>> = {
  "vagrant-idle": require("../../assets/brand/obol/png/1024/rank-5a-vagrant.png"),
  "lord-idle": require("../../assets/brand/obol/png/1024/rank-5a-lord.png"),
  arrival: require("../../assets/brand/obol/png/1024/mark-4b-arrival.png"),
  handoff: require("../../assets/brand/obol/png/1024/mark-4d-handoff.png"),
  crossing: require("../../assets/brand/obol/png/1024/mark-4e-crossing.png"),
  milled: require("../../assets/brand/obol/png/1024/mark-4c-milled-edge.png"),
}

/**
 * Unified Obol coin mark: circle + liquid surface at y=56.
 * Morphs by caste (vagrant lime / lord amber coronet) and moment.
 */
export function ObolMark({ size = 72, fill = 0.55, moment = "idle", useRaster = false }: Props) {
  const { isLord, theme } = useVessel()
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    opacity.setValue(0)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start()
  }, [isLord, theme, moment, opacity])

  if (useRaster) {
    const key =
      moment !== "idle"
        ? moment
        : isLord
          ? "lord-idle"
          : "vagrant-idle"
    const src = RASTER[key] ?? RASTER["vagrant-idle"]
    return (
      <Animated.View style={{ width: size, height: size, opacity }}>
        <Image source={src} style={{ width: size, height: size }} resizeMode="contain" />
      </Animated.View>
    )
  }

  const liquidColor = isLord ? pure.amber : pure.lime
  const rim = isLord ? pure.amber : theme === "light" ? "#1a1a1a" : pure.bone
  const clamped = Math.max(0.08, Math.min(0.92, fill))
  // Surface stays at y=56; fill depth varies below
  const wave = `M 12 ${SURFACE_Y} Q 30 ${SURFACE_Y - 3} 50 ${SURFACE_Y} T 88 ${SURFACE_Y}`
  const liquidPath = `${wave} L 88 88 A 38 38 0 0 1 12 88 Z`

  return (
    <Animated.View style={{ width: size, height: size, opacity }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="obolLiq" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={liquidColor} stopOpacity={0.95} />
            <Stop offset="100%" stopColor={isLord ? pure.bone : pure.lime} stopOpacity={0.55} />
          </LinearGradient>
        </Defs>
        {/* Coin rim */}
        <Circle cx="50" cy="50" r="38" fill="none" stroke={rim} strokeWidth={2.2} />
        {/* Liquid body under locked surface */}
        <Path d={liquidPath} fill="url(#obolLiq)" opacity={0.35 + clamped * 0.55} />
        {/* Surface wave — y=56 */}
        <Path d={wave} fill="none" stroke="#F4F3F0" strokeWidth={1.6} strokeLinecap="round" />
        {moment === "arrival" ? (
          <Circle cx="50" cy="34" r="3.2" fill="#F4F3F0" />
        ) : null}
        {moment === "crossing" ? (
          <Path
            d={`M 28 28 Q 42 ${SURFACE_Y - 4} 50 ${SURFACE_Y} Q 58 ${SURFACE_Y + 6} 72 78`}
            fill="none"
            stroke="#F4F3F0"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ) : null}
        {moment === "handoff" ? (
          <G>
            <Path d="M 22 56 L 48 56" stroke={pure.amber} strokeWidth={2} strokeLinecap="round" />
            <Path d="M 52 56 L 78 56" stroke={pure.lime} strokeWidth={2} strokeLinecap="round" />
          </G>
        ) : null}
        {moment === "milled" ? (
          <G>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2
              const x1 = 50 + Math.cos(a) * 40
              const y1 = 50 + Math.sin(a) * 40
              const x2 = 50 + Math.cos(a) * 44
              const y2 = 50 + Math.sin(a) * 44
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={rim}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              )
            })}
          </G>
        ) : null}
        {/* Lord coronet — surface stands up */}
        {isLord && moment === "idle" ? (
          <Path
            d={`M 38 ${SURFACE_Y} L 44 ${SURFACE_Y - 10} L 50 ${SURFACE_Y - 4} L 56 ${SURFACE_Y - 10} L 62 ${SURFACE_Y}`}
            fill="none"
            stroke={pure.amber}
            strokeWidth={1.8}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
        {/* Specular arc */}
        <Path
          d="M 28 32 Q 36 24 48 26"
          fill="none"
          stroke="#fff"
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.55}
        />
      </Svg>
    </Animated.View>
  )
}

/** Compact wordmark row: mark + OBOL */
export function ObolWordmark({ size = 40 }: { size?: number }) {
  const { v } = useVessel()
  return (
    <View style={styles.row}>
      <ObolMark size={size} fill={0.62} moment="idle" />
      <Animated.Text
        style={{
          marginLeft: 12,
          fontSize: size * 0.55,
          fontWeight: "900",
          letterSpacing: 4,
          color: v.ink,
        }}
      >
        OBOL
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
})
