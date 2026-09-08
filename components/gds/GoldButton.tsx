import { Pressable, StyleSheet, ActivityIndicator, ViewStyle } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

/** Primary gold CTA matching Make tin-press gold buttons. */
export function GoldButton({
  title,
  onPress,
  loading,
  disabled,
  style,
}: {
  title: string
  onPress?: () => void
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, (disabled || loading) && { opacity: 0.45 }, style]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={color.text.inverse} />
      ) : (
        <Txt
          style={{
            fontFamily: font.headlineBold,
            fontSize: 17,
            color: color.text.inverse,
          }}
        >
          {title}
        </Txt>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderTopColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: color.action.primary,
    shadowOpacity: 0.27,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
})
