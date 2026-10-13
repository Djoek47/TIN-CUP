import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  CashSlider,
  PrimaryButton,
  Label,
  MonoNum,
  Row,
  Hairline,
  ObolMark,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fiatToGoldMg, fmtFiat, fmtGoldMg } from "@/lib/gold"
import { space } from "@/theme/vessel"

export default function CashOutScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { balance, cashOut, prefs, moneyMode } = useApp()
  const max = Math.floor(balance.available / 25) * 25
  const [amount, setAmount] = useState(Math.min(100, Math.max(0, max)))
  const [busy, setBusy] = useState(false)
  const mg = fiatToGoldMg(amount, prefs.currency)

  if (isLord) {
    return (
      <VesselScreen>
        <ScreenHeader title="Cash Out" onBack={() => router.back()} />
        <View style={styles.locked}>
          <ObolMark size={80} fill={0.9} moment="milled" useRaster />
          <Label style={{ textAlign: "center", color: v.amb, marginTop: 18 }}>
            LORDS PUT IN. NOTHING COMES OUT.
          </Label>
        </View>
      </VesselScreen>
    )
  }

  const confirm = async () => {
    if (busy || amount <= 0) return
    setBusy(true)
    try {
      await cashOut(amount)
      router.replace("/(app)/wallet")
    } catch {
      /* toast */
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen>
      <ScreenHeader title="Cash Out" onBack={() => router.back()} />
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <ObolMark size={72} fill={0.4} moment="crossing" useRaster />
      </View>
      <Label style={{ marginTop: 12 }}>RELEASING FROM ESCROW</Label>
      <MonoNum style={{ fontSize: 36, color: v.lim, marginTop: 8 }}>
        {fmtGoldMg(mg, prefs.massUnit)}
      </MonoNum>
      <Label style={{ marginTop: 6 }}>
        {fmtFiat(amount, prefs.currency)} of {fmtFiat(balance.available, prefs.currency)} available
      </Label>

      <CashSlider value={amount} onChange={setAmount} max={Math.max(25, max)} />

      <Hairline />
      <Row style={styles.meta}>
        <Label>FEE</Label>
        <MonoNum style={{ fontSize: 14 }}>{fmtFiat(0, prefs.currency)}</MonoNum>
      </Row>
      <Hairline />
      <Row style={styles.meta}>
        <Label>RAIL</Label>
        <Label>
          {moneyMode === "stripe"
            ? "STRIPE CONNECT"
            : moneyMode === "thirdweb"
              ? "THIRDWEB USDT"
              : "ESCROW QUEUE"}
        </Label>
      </Row>
      <Hairline />
      <Row style={styles.meta}>
        <Label>YOU RECEIVE</Label>
        <MonoNum style={{ color: v.lim, fontSize: 14 }}>
          {fmtFiat(amount, prefs.currency)}
        </MonoNum>
      </Row>

      <View style={{ flex: 1 }} />
      <PrimaryButton title="CASH OUT NOW" tone="lim" onPress={confirm} disabled={busy || amount <= 0} />
      <Label style={{ textAlign: "center", marginTop: 12 }}>
        CASH OUT IS FREE · UP TO 1 BUSINESS DAY
      </Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  locked: { flex: 1, alignItems: "center", justifyContent: "center" },
  meta: { paddingVertical: space.rowPad, justifyContent: "space-between", alignItems: "center" },
})
