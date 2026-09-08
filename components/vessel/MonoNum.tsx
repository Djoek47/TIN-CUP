import { Text, TextProps, StyleSheet } from "react-native"
import { font } from "@/theme/vessel"
import { useVessel } from "@/providers/VesselTheme"

export function MonoNum({ style, ...rest }: TextProps) {
  const { v } = useVessel()
  return <Text {...rest} style={[styles.num, { color: v.ink }, style]} />
}

export function Label({ children, style, ...rest }: TextProps) {
  const { v } = useVessel()
  return (
    <Text {...rest} style={[styles.label, { color: v.dim }, style]}>
      {children}
    </Text>
  )
}

export function UiText({ style, weight = "bold", ...rest }: TextProps & { weight?: "reg" | "semi" | "bold" | "black" }) {
  const { v } = useVessel()
  const family =
    weight === "black" ? font.uiBlack : weight === "semi" ? font.uiSemi : weight === "reg" ? font.uiReg : font.ui
  return <Text {...rest} style={[{ fontFamily: family, color: v.ink }, style]} />
}

const styles = StyleSheet.create({
  num: {
    fontFamily: font.monoBold,
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.2,
  },
  label: {
    fontFamily: font.mono,
    fontSize: 9.5,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
})
