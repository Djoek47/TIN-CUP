import { useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { glass } from "@/theme/glass"
import { color, font, primitive } from "@/theme/tokens"

const cactusGlass = {
  backgroundColor: "rgba(63,155,91,0.15)",
  borderWidth: 1,
  borderColor: "rgba(63,155,91,0.35)",
  borderTopColor: "rgba(63,155,91,0.38)",
} as const

/** S21 Cash Out — Make CashOutScreen */
export default function CashOutScreen() {
  const router = useRouter()
  const [amount, setAmount] = useState("100")
  const num = parseInt(amount, 10) || 0
  const fee = Math.floor(num * 0.1)
  const net = num - fee

  const handleClaim = () => {
    Alert.alert(`🎉 Claim submitted — ${net} coins incoming!`, "Counted within 24 hours, partner.")
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Cash Out" onBack={() => router.back()} />
        <View style={{ paddingHorizontal: 16 }}>
          <View style={[styles.amountCard, glass.card]}>
            <Txt style={styles.amountLabel}>AMOUNT TO CLAIM</Txt>
            <View style={styles.amountRow}>
              <Txt style={{ fontSize: 24 }}>🪙</Txt>
              <Txt style={styles.amountVal}>{amount || "0"}</Txt>
            </View>
            <View style={styles.chips}>
              {["50", "100", "500", "MAX"].map((v) => {
                const val = v === "MAX" ? "1240" : v
                const on = amount === val
                return (
                  <Pressable
                    key={v}
                    onPress={() => setAmount(val)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: on ? "rgba(245,179,43,0.2)" : "rgba(255,255,255,0.05)",
                        borderColor: on ? color.action.primary : "rgba(255,255,255,0.08)",
                      },
                    ]}
                  >
                    <Txt
                      style={{
                        fontFamily: font.mono,
                        fontSize: 12,
                        color: on ? color.action.primary : color.text.secondary,
                      }}
                    >
                      {v}
                    </Txt>
                  </Pressable>
                )
              })}
            </View>
          </View>

          <View style={[styles.receipt, glass.parchment]}>
            <Txt style={styles.receiptLabel}>RECEIPT</Txt>
            <View style={{ gap: 10 }}>
              <View style={styles.receiptRow}>
                <Txt style={styles.inkBody}>Amount requested</Txt>
                <Txt style={styles.inkMono}>🪙 {num.toLocaleString()}</Txt>
              </View>
              <View style={[styles.receiptRow, styles.dashed]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Txt style={{ fontSize: 16 }}>🦅</Txt>
                  <Txt style={styles.feeTxt}>{"Monarch's Cut (10%)"}</Txt>
                </View>
                <Txt style={styles.feeMono}>−{fee.toLocaleString()}</Txt>
              </View>
              <View style={[styles.receiptRow, styles.solid]}>
                <Txt style={styles.youReceive}>You receive</Txt>
                <Txt style={styles.netMono}>🪙 {net.toLocaleString()}</Txt>
              </View>
            </View>
          </View>

          <Pressable onPress={handleClaim} style={[styles.claimBtn, cactusGlass]}>
            <Ico.Cactus s={18} c={color.money.positive} />
            <Txt style={styles.claimTxt}>Claim Your Money</Txt>
          </Pressable>
          <Txt style={styles.foot}>Face ID required above 100 coins. Counted within 24h.</Txt>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  amountCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  amountLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: color.text.tertiary,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12,
  },
  amountVal: {
    fontFamily: font.mono,
    fontSize: 42,
    color: color.text.primary,
  },
  chips: { flexDirection: "row", gap: 6, justifyContent: "center", flexWrap: "wrap" },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  receipt: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  receiptLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: color.dust,
    textAlign: "center",
    marginBottom: 14,
  },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dashed: {
    borderTopWidth: 1,
    borderTopColor: "rgba(228,218,192,0.8)",
    borderStyle: "dashed",
    paddingTop: 10,
  },
  solid: {
    borderTopWidth: 2,
    borderTopColor: "rgba(23,19,12,0.15)",
    paddingTop: 10,
  },
  inkBody: { fontFamily: font.body, fontSize: 13, color: color.text.inverse },
  inkMono: { fontFamily: font.mono, fontSize: 14, color: color.text.inverse },
  feeTxt: { fontFamily: font.body, fontSize: 13, color: primitive.oxblood[500] },
  feeMono: { fontFamily: font.mono, fontSize: 14, color: primitive.oxblood[500] },
  youReceive: {
    fontFamily: font.headlineBold,
    fontSize: 14,
    color: color.text.inverse,
  },
  netMono: {
    fontFamily: font.mono,
    fontSize: 18,
    color: color.money.positive,
    fontWeight: "700",
  },
  claimBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  claimTxt: {
    fontFamily: font.headlineBold,
    fontSize: 17,
    color: color.money.positive,
  },
  foot: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: font.body,
    fontSize: 11,
    color: color.text.tertiary,
  },
})
