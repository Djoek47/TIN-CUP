import { View, Image } from "react-native"
import { Text } from "./ui"
import { colors, fonts } from "../theme"

export function Wordmark({ size = 22, showMark = true }: { size?: number; showMark?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {showMark && (
        <Image
          source={require("../assets/mark.png")}
          style={{ width: size * 1.25, height: size * 1.25 }}
          resizeMode="contain"
        />
      )}
      <Text style={{ fontFamily: fonts.serifBold, fontSize: size, color: colors.pink, letterSpacing: 0.3 }}>
        fanissima
      </Text>
    </View>
  )
}
