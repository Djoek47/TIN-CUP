import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  ObolMark,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtCompactUsd } from "@/lib/money"
import { fmtFiat, fmtGoldMg } from "@/lib/gold"
import { pure, space } from "@/theme/vessel"

export default function WalletScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { balance, ledger, moneyBadge, say, prefs, setPrefs } = useApp()
  const hidden = balance.hidden || prefs.hideAmt
  const fill = Math.min(
    1,
    balance.gold_mg_available / Math.max(1, balance.gold_mg_total),
  )
  const unit = prefs.massUnit
  const currency = prefs.currency

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
          <ObolMark size={88} fill={fill} moment="idle" useRaster />
          <View style={{ flex: 1 }}>
            <Label>TOTAL GOLD (REFERENCE)</Label>
            <MonoNum style={{ fontSize: 28, marginTop: 6 }}>
              {hidden ? "••••" : fmtGoldMg(balance.gold_mg_total, unit)}
            </MonoNum>
            <Label style={{ marginTop: 6, color: v.dim }}>
              {hidden ? "••••" : fmtFiat(balance.total, currency)}
            </Label>
            <Label style={{ marginTop: 8, color: v.lim }}>
              {Math.round(fill * 100)}% AVAILABLE · {Math.round((1 - fill) * 100)}% ESCROW
            </Label>
          </View>
        </Row>

        <Row style={{ marginTop: 22, justifyContent: "space-between" }}>
          <View>
            <Label>AVAILABLE</Label>
            <MonoNum style={{ fontSize: 16, marginTop: 4, color: v.lim }}>
              {hidden ? "••••" : fmtGoldMg(balance.gold_mg_available, unit)}
            </MonoNum>
            <Label style={{ marginTop: 4 }}>
              {hidden ? "••••" : fmtFiat(balance.available, currency)}
            </Label>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Label>ESCROW HOLD</Label>
            <MonoNum style={{ fontSize: 16, marginTop: 4, color: v.dim }}>
              {hidden ? "••••" : fmtGoldMg(balance.gold_mg_hold, unit)}
            </MonoNum>
            <Label style={{ marginTop: 4 }}>
              {hidden ? "••••" : fmtFiat(balance.hold, currency)}
            </Label>
          </View>
        </Row>

        <View style={{ marginTop: 22, gap: 10 }}>
          {isLord ? (
            <PrimaryButton title="ADD FUNDS" onPress={() => router.push("/(app)/deposit")} />
          ) : (
            <>
              <PrimaryButton title="CASH OUT" tone="lim" onPress={() => router.push("/(app)/cash-out")} />
              <PrimaryButton title="ADD FUNDS" onPress={() => router.push("/(app)/deposit")} />
            </>
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
                <Label style={{ marginTop: 2 }}>
                  {e.kind} · {e.escrow_status} · {e.rail}
                </Label>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <MonoNum style={{ color: e.dir === "in" ? v.lim : v.amb }}>
                  {e.dir === "in" ? "+" : "−"}
                  {hidden ? "••" : fmtGoldMg(e.gold_mg, unit)}
                </MonoNum>
                <Label style={{ marginTop: 2 }}>
                  {hidden ? "••" : fmtCompactUsd(e.amount)}
                </Label>
              </View>
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
