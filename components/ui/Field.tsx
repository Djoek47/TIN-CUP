import { useState } from "react"
import { View, TextInput, TextInputProps, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { color, radius, space, font } from "@/theme/tokens"
import { Txt } from "./Txt"

interface FieldProps extends TextInputProps {
  label?: string
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
}

export function Field({ label, icon, error, style, secureTextEntry, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false)
  const [hide, setHide] = useState(!!secureTextEntry)

  return (
    <View style={{ gap: space[1] }}>
      {label ? <Txt variant="overline">{label}</Txt> : null}
      <View
        style={[
          styles.wrap,
          { borderColor: error ? color.action.danger : focused ? color.action.primary : color.border.subtle },
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18} color={focused ? color.action.primary : color.text.tertiary} />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={color.text.tertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hide}
          autoCapitalize="none"
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHide((h) => !h)} hitSlop={10}>
            <Ionicons name={hide ? "eye-outline" : "eye-off-outline"} size={18} color={color.text.tertiary} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Txt variant="bodyS" color={color.action.danger}>
          {error}
        </Txt>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
    backgroundColor: color.bg.card,
    borderWidth: 1,
    borderRadius: radius.s,
    paddingHorizontal: space[4],
    height: 52,
  },
  input: {
    flex: 1,
    color: color.text.primary,
    fontFamily: font.body,
    fontSize: 16,
    height: "100%",
  },
})
