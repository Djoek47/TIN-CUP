import { View, TextInput, StyleSheet, type TextInputProps } from "react-native"
import { Text } from "./ui"
import { colors, fonts, radius, spacing } from "../theme"

export function Field({
  label,
  style,
  ...props
}: TextInputProps & { label?: string }) {
  return (
    <View style={{ gap: 7 }}>
      {label ? <Text variant="overline">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textFaint}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 15.5,
  },
})
