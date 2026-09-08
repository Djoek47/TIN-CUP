import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

const AVATARS = ["🤠", "🎩", "😅", "🎪"]
const COLORS = [color.action.primary, "#B33A3E", color.link, color.money.positive]

export function GiverStack({ count }: { count: number }) {
  const shown = Math.min(4, count)
  return (
    <View style={styles.row}>
      <View style={styles.stack}>
        {Array.from({ length: shown }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.avatar,
              {
                backgroundColor: COLORS[i % 4],
                marginLeft: i > 0 ? -5 : 0,
                zIndex: shown - i,
              },
            ]}
          >
            <Txt style={{ fontSize: 8 }}>{AVATARS[i]}</Txt>
          </View>
        ))}
      </View>
      <Txt style={{ fontFamily: font.body, fontSize: 10, color: color.text.tertiary }}>{count} gave</Txt>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  stack: { flexDirection: "row" },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(11,14,20,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
})
