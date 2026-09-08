import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

type Size = "XL" | "L" | "M" | "S"
type Signed = "plus" | "minus" | "net" | "none"

const FS: Record<Size, number> = { XL: 38, L: 22, M: 16, S: 13 }
const CS: Record<Size, number> = { XL: 28, L: 18, M: 14, S: 11 }

export function CoinAmount({
  value,
  size = "M",
  signed = "none",
  usd,
}: {
  value: number | string
  size?: Size
  signed?: Signed
  usd?: string
}) {
  const col =
    signed === "plus" || signed === "net"
      ? color.money.positive
      : signed === "minus"
        ? color.text.secondary
        : color.money.amount
  const pre = signed === "plus" ? "+" : signed === "minus" ? "−" : ""
  const display = typeof value === "number" ? value.toLocaleString() : value

  return (
    <View>
      <View style={styles.row}>
        <Txt style={{ fontSize: CS[size], lineHeight: CS[size] + 2 }}>🪙</Txt>
        <Txt
          style={{
            fontFamily: font.mono,
            fontSize: FS[size],
            fontWeight: "500",
            color: col,
            letterSpacing: -0.2,
          }}
        >
          {pre}
          {display}
        </Txt>
      </View>
      {usd ? (
        <Txt
          style={{
            fontFamily: font.mono,
            fontSize: 11,
            color: color.text.secondary,
            marginTop: 2,
            paddingLeft: CS[size] + 8,
          }}
        >
          ≈ ${usd}
        </Txt>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
})
