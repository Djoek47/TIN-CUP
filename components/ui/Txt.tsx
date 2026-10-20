import { Text, TextProps, StyleSheet } from "react-native"
import { type } from "@/theme/type"

type Variant = keyof typeof type

interface TxtProps extends TextProps {
  variant?: Variant
  color?: string
  center?: boolean
}

/** Themed text. Defaults to bodyM. Pass `variant` to hit the GDS type scale. */
export function Txt({ variant = "bodyM", color, center, style, ...rest }: TxtProps) {
  return (
    <Text
      {...rest}
      style={[
        type[variant],
        color ? { color } : null,
        center ? styles.center : null,
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
})
