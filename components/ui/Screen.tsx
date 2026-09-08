import { ReactNode } from "react"
import { View, StyleSheet, ViewStyle, ScrollView, StatusBar } from "react-native"
import { SafeAreaView, Edge } from "react-native-safe-area-context"
import { color, space } from "@/theme/tokens"

interface ScreenProps {
  children: ReactNode
  scroll?: boolean
  padded?: boolean
  edges?: Edge[]
  style?: ViewStyle
  contentStyle?: ViewStyle
  bg?: string
}

/** Root screen wrapper: canvas background, safe-area, optional scroll + padding. */
export function Screen({
  children,
  scroll,
  padded,
  edges = ["top", "bottom"],
  style,
  contentStyle,
  bg = color.bg.canvas,
}: ScreenProps) {
  const inner = padded ? [styles.padded, contentStyle] : contentStyle

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: bg }, style]}>
      <StatusBar barStyle="light-content" />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, inner]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner]}>{children}</View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  padded: { paddingHorizontal: space[4] },
  scrollContent: { paddingBottom: space[8] },
})
