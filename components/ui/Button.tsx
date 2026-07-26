import { ReactNode } from "react"
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator, View } from "react-native"
import * as Haptics from "expo-haptics"
import { Platform } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { color, radius, space, font } from "@/theme/tokens"
import { Txt } from "./Txt"

type Variant = "primary" | "secondary" | "danger" | "ghost" | "cactus"
type Size = "lg" | "md"

interface ButtonProps {
  title: string
  onPress?: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  full?: boolean
  icon?: ReactNode
  style?: ViewStyle
}

const bg: Record<Variant, string> = {
  primary: color.action.primary,
  secondary: "rgba(245,179,43,0.10)",
  danger: color.action.danger,
  cactus: color.money.positive,
  ghost: "transparent",
}

const fg: Record<Variant, string> = {
  primary: color.text.inverse,
  secondary: color.action.primary,
  danger: color.text.primary,
  cactus: color.text.primary,
  ghost: color.text.secondary,
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  disabled,
  loading,
  full = true,
  icon,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1)
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 })
  }
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 })
  }
  const handlePress = () => {
    if (disabled || loading) return
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress?.()
  }

  const isSecondary = variant === "secondary"

  return (
    <Animated.View style={[animStyle, full && styles.full, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[
          styles.base,
          size === "lg" ? styles.lg : styles.md,
          { backgroundColor: bg[variant] },
          variant === "primary" && styles.primaryGold,
          isSecondary && styles.secondaryBorder,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={fg[variant]} />
        ) : (
          <View style={styles.row}>
            {icon}
            <Txt
              variant={size === "lg" ? "buttonL" : "buttonM"}
              color={fg[variant]}
              style={{ fontFamily: font.headlineBold }}
            >
              {title}
            </Txt>
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  full: { width: "100%" },
  base: {
    borderRadius: radius.s,
    alignItems: "center",
    justifyContent: "center",
  },
  lg: { height: 56, paddingHorizontal: space[5], borderRadius: radius.m },
  md: { height: 44, paddingHorizontal: space[4] },
  primaryGold: {
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderTopColor: "rgba(255,255,255,0.4)",
    shadowColor: color.action.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: "rgba(245,179,43,0.24)",
  },
  disabled: { opacity: 0.4 },
  row: { flexDirection: "row", alignItems: "center", gap: space[2] },
})
