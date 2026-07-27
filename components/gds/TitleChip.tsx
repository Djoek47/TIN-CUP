import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

export function TitleChip({
  title,
  isLord = false,
  small = false,
}: {
  title: string
  isLord?: boolean
  small?: boolean
}) {
  return (
    <View
      style={[
        styles.chip,
        {
          paddingHorizontal: small ? 6 : 7,
          paddingVertical: 2,
          backgroundColor: isLord ? color.action.primary : "rgba(140,122,91,0.25)",
          borderWidth: isLord ? 0 : 1,
          borderColor: "rgba(140,122,91,0.33)",
        },
      ]}
    >
      <Txt
        style={{
          fontFamily: font.headlineBlack,
          fontSize: small ? 8 : 9,
          letterSpacing: 1,
          color: isLord ? color.text.inverse : color.dust,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Txt>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: { borderRadius: 999, alignSelf: "flex-start" },
})
