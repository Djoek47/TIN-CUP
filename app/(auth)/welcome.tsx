import { View, ImageBackground, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Text, Button } from "../../components/ui"
import { Wordmark } from "../../components/wordmark"
import { AppleButton } from "../../components/apple-button"
import { colors, spacing } from "../../theme"

export default function Welcome() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <ImageBackground
      source={require("../../assets/welcome-hero.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(11,7,16,0.35)", "rgba(11,7,16,0.85)", "rgba(11,7,16,0.99)"]}
        locations={[0, 0.55, 0.85]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={{ alignItems: "center", marginTop: spacing.xxl }}>
          <Wordmark size={30} />
        </View>

        <View style={{ gap: spacing.lg }}>
          <Text variant="overline" color={colors.pink}>
            The global home of women&apos;s sport
          </Text>
          <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 44, lineHeight: 48, color: colors.text }}>
            Every game.{"\n"}Every icon.{"\n"}One feed.
          </Text>
          <Text variant="body" style={{ maxWidth: 320 }}>
            Live scores, athlete stats, highlights, transfer rumors and the loudest fan community in women&apos;s sport.
          </Text>

          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            <AppleButton />
            <Button label="Continue with email" onPress={() => router.push("/(auth)/sign-up")} variant="secondary" />
            <Button
              label="I already have an account"
              variant="ghost"
              onPress={() => router.push("/(auth)/sign-in")}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "space-between",
  },
})
