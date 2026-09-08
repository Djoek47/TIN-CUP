import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  VesselCup,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd, fmtCompactUsd } from "@/lib/money"
import { pure, space } from "@/theme/vessel"

export default function WalletScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { balance, ledger, moneyBadge, say, prefs, setPrefs } = useApp()
  const hidden = balance.hidden || prefs.hideAmt
  const fill = Math.min(1, balance.available / Math.max(1, balance.total))

  const toggleHide = () => {
    const next = !prefs.hideAmt
    setPrefs({ hideAmt: next })
    say(next ? "Amounts hidden" : "Amounts visible")
  }

  return (
    <VesselScreen>
      <ScreenHeader
        title="Wallet"
        onBack={() => router.back()}
        right={
          <Pressable onPress={toggleHide}>
            <Label>{hidden ? "SHOW" : "HIDE"}</Label>
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ alignItems: "center", gap: 18, marginTop: 8 }}>
          <VesselCup fill={fill} width={72} height={120} />
          <View style={{ flex: 1 }}>
            <Label>TOTAL BALANCE</Label>
            <MonoNum style={{ fontSize: 32, marginTop: 6 }}>
              {hidden ? "••••" : fmtUsd(balance.total)}
            </MonoNum>
            <Label style={{ marginTop: 8, color: v.lim }}>
              {Math.round(fill * 100)}% LIQUID
            </Label>
          </View>
        </Row>

        <Row style={{ marginTop: 22, justifyContent: "space-between" }}>
          <View>
            <Label>AVAILABLE</Label>
            <MonoNum style={{ fontSize: 18, marginTop: 4, color: v.lim }}>
              {hidden ? "••••" : fmtUsd(balance.available)}
            </MonoNum>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Label>ON HOLD</Label>
            <MonoNum style={{ fontSize: 18, marginTop: 4, color: v.dim }}>
              {hidden ? "••••" : fmtUsd(balance.hold)}
            </MonoNum>
          </View>
        </Row>

        <View style={{ marginTop: 22 }}>
          {isLord ? (
            <PrimaryButton title="ADD FUNDS" onPress={() => router.push("/(app)/deposit")} />
          ) : (
            <PrimaryButton title="CASH OUT" tone="lim" onPress={() => router.push("/(app)/cash-out")} />
          )}
        </View>

        <Label style={{ marginTop: space.sectionGap }}>HISTORY</Label>
        {ledger.map((e) => (
          <View key={e.id}>
            <Hairline />
            <Row style={styles.row}>
              <Label style={{ color: e.dir === "in" ? v.lim : v.amb, width: 16 }}>
                {e.dir === "in" ? "↓" : "↑"}
              </Label>
              <View style={{ flex: 1 }}>
                <UiText weight="semi" style={{ fontSize: 13.5 }}>
                  {e.who}
                </UiText>
                <Label style={{ marginTop: 2 }}>{e.kind}</Label>
              </View>
              <MonoNum style={{ color: e.dir === "in" ? v.lim : v.amb }}>
                {e.dir === "in" ? "+" : "−"}
                {hidden ? "••" : fmtCompactUsd(e.amount)}
              </MonoNum>
            </Row>
          </View>
        ))}

        <View style={[styles.badge, { borderColor: v.line, backgroundColor: v.surf, borderRadius: v.radPill }]}>
          <Label style={{ color: pure.amber }}>{moneyBadge}</Label>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.rowPad, alignItems: "center", gap: 10 },
  badge: {
    marginTop: 22,
    marginBottom: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
})
