import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

type Kind = "live" | "pending" | "verified" | "funded" | "flagged"

const CFG: Record<Kind, { label: string; bg: string; col: string; dot: boolean }> = {
  live: { label: "LIVE", bg: color.action.danger, col: color.text.primary, dot: true },
  pending: { label: "PENDING", bg: color.bg.sheet, col: color.text.secondary, dot: false },
  verified: { label: "VERIFIED", bg: color.money.positive, col: color.text.primary, dot: false },
  funded: { label: "FUNDED", bg: color.action.primary, col: color.text.inverse, dot: false },
  flagged: { label: "FLAGGED", bg: color.action.danger, col: color.text.primary, dot: false },
}

export function StatusChip({ type }: { type: Kind }) {
  const { label, bg, col, dot } = CFG[type]
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      {dot ? <View style={styles.dot} /> : null}
      <Txt
        style={{
          fontFamily: font.headlineBlack,
          fontSize: 9,
          letterSpacing: 1,
          color: col,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Txt>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.text.primary,
  },
})
