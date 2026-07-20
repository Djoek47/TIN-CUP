import { useEffect, useRef, type ReactNode } from "react"
import {
  Text as RNText,
  View,
  Pressable,
  StyleSheet,
  Animated,
  type TextProps,
  type ViewProps,
  type PressableProps,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, fonts, radius, spacing } from "../theme"

type Variant =
  | "display"
  | "displaySmall"
  | "title"
  | "heading"
  | "body"
  | "bodyStrong"
  | "caption"
  | "overline"
  | "stat"

const variantStyle: Record<Variant, object> = {
  display: { fontFamily: fonts.serifBold, fontSize: 34, lineHeight: 38, color: colors.text },
  displaySmall: { fontFamily: fonts.serifBold, fontSize: 26, lineHeight: 30, color: colors.text },
  title: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 27, color: colors.text },
  heading: { fontFamily: fonts.sansBold, fontSize: 17, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.textDim },
  bodyStrong: { fontFamily: fonts.sansMedium, fontSize: 15, lineHeight: 21, color: colors.text },
  caption: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 17, color: colors.textFaint },
  overline: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.textFaint,
  },
  stat: { fontFamily: fonts.mono, fontSize: 20, lineHeight: 24, color: colors.text },
}

export function Text({
  variant = "body",
  color,
  style,
  ...props
}: TextProps & { variant?: Variant; color?: string }) {
  return <RNText style={[variantStyle[variant], color ? { color } : null, style]} {...props} />
}

export function Card({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}

export function Chip({
  label,
  active,
  color = colors.pink,
  onPress,
}: {
  label: string
  active?: boolean
  color?: string
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
        pressed && { opacity: 0.7 },
      ]}
    >
      <RNText
        style={[
          { fontFamily: fonts.sansMedium, fontSize: 13.5 },
          { color: active ? "#fff" : colors.textDim },
        ]}
      >
        {label}
      </RNText>
    </Pressable>
  )
}

export function Badge({ label, color = colors.pink, tint }: { label: string; color?: string; tint?: boolean }) {
  return (
    <View
      style={[
        styles.badge,
        tint ? { backgroundColor: color + "22" } : { backgroundColor: color },
      ]}
    >
      <RNText style={{ fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 0.6, color: tint ? color : "#fff", textTransform: "uppercase" }}>
        {label}
      </RNText>
    </View>
  )
}

export function LiveDot({ size = 7 }: { size?: number }) {
  const pulse = useRef(new Animated.Value(1)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])
  return <Animated.View style={{ width: size, height: size, borderRadius: size, backgroundColor: colors.live, opacity: pulse }} />
}

export function Avatar({ name, color = colors.pink, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <LinearGradient
      colors={[color, color + "99"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      <RNText style={{ fontFamily: fonts.sansBold, fontSize: size * 0.36, color: "#fff" }}>{initials}</RNText>
    </LinearGradient>
  )
}

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  style,
  disabled,
  loading,
  ...props
}: PressableProps & {
  label: string
  variant?: "primary" | "secondary" | "ghost"
  icon?: ReactNode
  loading?: boolean
}) {
  const isPrimary = variant === "primary"
  const isGhost = variant === "ghost"
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isPrimary && { backgroundColor: colors.pink },
        variant === "secondary" && { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
        isGhost && { backgroundColor: "transparent" },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        style as object,
      ]}
      {...props}
    >
      {icon}
      <RNText
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 15,
          color: isPrimary ? "#fff" : isGhost ? colors.pink : colors.text,
        }}
      >
        {loading ? "Please wait…" : label}
      </RNText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
})
