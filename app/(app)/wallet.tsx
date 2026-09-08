import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, CoinAmount, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { LEDGER } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const cactusGlass = {
  backgroundColor: "rgba(63,155,91,0.15)",
  borderWidth: 1,
  borderColor: "rgba(63,155,91,0.28)",
  borderTopColor: "rgba(63,155,91,0.38)",
} as const

/** S19 Wallet — Make WalletScreen */
export default function WalletScreen() {
  const router = useRouter()

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Wallet" overline="YOUR GOLD" onBack={() => router.back()} />

        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <View style={[styles.balanceCard, glass.gold]}>
            <Txt style={styles.balanceLabel}>YOUR GOLD</Txt>
            <CoinAmount value={1240} size="XL" usd="1,240.00" />
            <View style={styles.btnRow}>
              <Pressable
                onPress={() => router.push("/(app)/deposit")}
                style={styles.addGold}
              >
                <Txt style={styles.addGoldTxt}>Add Gold</Txt>
              </Pressable>
              <Pressable
                onPress={() => router.push("/(app)/cash-out")}
                style={[styles.cashOut, cactusGlass]}
              >
                <Ico.Cactus s={14} c={color.money.positive} />
                <Txt style={styles.cashOutTxt}>Cash Out</Txt>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.infoRow, glass.card]}>
          <Ico.Sheriff s={18} c={color.text.tertiary} />
          <View style={{ flex: 1 }}>
            <Txt style={styles.infoTitle}>No holds right now</Txt>
            <Txt style={styles.infoSub}>{"The Sheriff's watching but you're clear."}</Txt>
          </View>
        </View>

        <View style={[styles.cutRow, glass.card]}>
          <Txt style={{ fontSize: 20 }}>🦅</Txt>
          <View style={{ flex: 1 }}>
            <Txt style={[styles.infoTitle, { marginBottom: 3 }]}>{"The Monarch's Cut"}</Txt>
            <Txt style={styles.cutBody}>
              1% when gold comes in · 10% when Vagrants cash out. He never misses his coin.
            </Txt>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Txt style={styles.sectionLabel}>RECENT ACTIVITY</Txt>
          {LEDGER.map((row) => (
            <View key={row.id} style={styles.ledgerRow}>
              <View style={styles.ledgerLeft}>
                <Txt style={{ fontSize: 18 }}>{row.icon}</Txt>
                <View style={{ flex: 1 }}>
                  <Txt
                    style={{
                      fontFamily: font.body,
                      fontSize: 13,
                      color: row.fee ? color.text.tertiary : color.text.primary,
                      lineHeight: 17,
                    }}
                  >
                    {row.desc}
                  </Txt>
                  <Txt style={{ fontFamily: font.body, fontSize: 10, color: color.text.tertiary }}>
                    {row.time}
                  </Txt>
                </View>
              </View>
              <Txt
                style={{
                  fontFamily: font.mono,
                  fontSize: 14,
                  color: row.fee
                    ? color.text.tertiary
                    : row.coins.startsWith("+")
                      ? color.money.positive
                      : color.text.primary,
                }}
              >
                {row.coins}
              </Txt>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => Alert.alert("Tax Center opens in your browser ↗")}
          style={[styles.taxRow, glass.card]}
        >
          <Txt style={{ fontFamily: font.body, fontSize: 13, color: color.text.primary }}>
            Tax Center & 1099-K
          </Txt>
          <Txt style={{ color: color.action.primary }}>→</Txt>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  balanceCard: {
    borderRadius: 22,
    padding: 24,
    overflow: "hidden",
    shadowColor: color.action.primary,
    shadowOpacity: 0.1,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 8 },
  },
  balanceLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: color.text.tertiary,
    marginBottom: 12,
  },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  addGold: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderTopColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  addGoldTxt: {
    fontFamily: font.headlineBold,
    fontSize: 14,
    color: color.text.inverse,
  },
  cashOut: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cashOutTxt: {
    fontFamily: font.headlineBold,
    fontSize: 14,
    color: color.money.positive,
  },
  infoRow: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoTitle: {
    fontFamily: font.headlineBold,
    fontSize: 12,
    color: color.text.primary,
  },
  infoSub: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.text.tertiary,
  },
  cutRow: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  cutBody: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.text.secondary,
    lineHeight: 17,
  },
  sectionLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 11,
    color: color.text.secondary,
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  ledgerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, marginRight: 12 },
  taxRow: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
