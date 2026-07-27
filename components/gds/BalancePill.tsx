import { Pressable, StyleSheet, View } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

/** Make / Stage 2 BalancePill — Plex Mono coins, tap → Wallet */
export function BalancePill({
  balance,
  onPress,
}: {
  balance: number
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, glass.gold]}
      accessibilityRole="button"
      accessibilityLabel={`Balance ${balance} coins`}
    >
      <Txt style={{ fontSize: 13 }}>🪙</Txt>
      <Txt style={{ fontFamily: font.mono, fontSize: 13, color: color.action.primary }}>
        {balance.toLocaleString()}
      </Txt>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
})
