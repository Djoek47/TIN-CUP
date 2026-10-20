import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { TitleChip } from "./TitleChip"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

export function PosterChip({
  name,
  title,
  isLord = false,
  size = "S",
}: {
  name: string
  title: string
  isLord?: boolean
  size?: "S" | "M"
}) {
  const dim = size === "S" ? 32 : 40
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, glass.card, { width: dim, height: dim, borderRadius: 8 }]}>
        <Txt style={{ fontSize: dim * 0.5 }}>{isLord ? "🎩" : "🤠"}</Txt>
      </View>
      <View>
        <Txt
          style={{
            fontFamily: font.headlineBold,
            fontSize: size === "S" ? 12 : 14,
            color: color.text.primary,
            lineHeight: size === "S" ? 14 : 18,
          }}
          numberOfLines={1}
        >
          {name}
        </Txt>
        <TitleChip title={title} isLord={isLord} small />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
})
