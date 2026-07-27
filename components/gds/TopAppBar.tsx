import { View, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "expo-blur"
import { Txt } from "@/components/ui/Txt"
import { Ico } from "./icons"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

export function TopAppBar({
  title,
  overline,
  balance,
  onBack,
  onBell,
  onWallet,
}: {
  title: string
  overline?: string
  balance?: number
  onBack?: () => void
  onBell?: () => void
  onWallet?: () => void
}) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.row}>
        <View style={styles.left}>
          {onBack ? (
            <Pressable onPress={onBack} style={[styles.iconBtn, glass.card]} accessibilityRole="button">
              <Ico.Back c={color.text.secondary} s={18} />
            </Pressable>
          ) : null}
          <View>
            {overline ? (
              <Txt
                style={{
                  fontFamily: font.headlineBlack,
                  fontSize: 10,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: color.text.tertiary,
                  marginBottom: 2,
                }}
              >
                {overline}
              </Txt>
            ) : null}
            <Txt
              style={{
                fontFamily: font.headlineBlack,
                fontSize: 22,
                color: color.text.primary,
                lineHeight: 26,
              }}
              numberOfLines={1}
            >
              {title}
            </Txt>
          </View>
        </View>
        <View style={styles.right}>
          {balance !== undefined ? (
            <Pressable onPress={onWallet} style={[styles.pill, glass.gold]} accessibilityRole="button">
              <Txt style={{ fontSize: 13 }}>🪙</Txt>
              <Txt style={{ fontFamily: font.mono, fontSize: 13, color: color.action.primary }}>
                {balance.toLocaleString()}
              </Txt>
            </Pressable>
          ) : null}
          {onBell ? (
            <Pressable onPress={onBell} style={[styles.iconBtn, glass.card]} accessibilityRole="button">
              <Ico.Bell c={color.text.secondary} s={18} />
              <View style={styles.badge} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 14, zIndex: 20 },
  row: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: color.action.danger,
  },
})
