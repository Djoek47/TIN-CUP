import { View, StyleSheet, ViewProps } from "react-native"
import { useVessel } from "@/providers/VesselTheme"

export function Hairline({ style, ...rest }: ViewProps) {
  const { v } = useVessel()
  return <View {...rest} style={[styles.line, { backgroundColor: v.line }, style]} />
}

export function Row({ children, style, ...rest }: ViewProps) {
  const { v } = useVessel()
  return (
    <View {...rest} style={[styles.row, { borderTopColor: v.line }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, width: "100%" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})
