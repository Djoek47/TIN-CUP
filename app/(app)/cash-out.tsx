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
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

export default function CashOutScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { balance, cashOut } = useApp()
  const max = Math.floor(balance.available / 25) * 25
  const [amount, setAmount] = useState(Math.min(100, max))
  const [busy, setBusy] = useState(false)

  if (isLord) {
    return (
      <VesselScreen>
        <ScreenHeader title="Cash Out" onBack={() => router.back()} />
        <View style={styles.locked}>
          <Label style={{ textAlign: "center", color: v.amb }}>LORDS PUT IN. NOTHING COMES OUT.</Label>
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
      <Label style={{ marginTop: 12 }}>TAKING OUT</Label>
      <MonoNum style={{ fontSize: 40, color: v.lim, marginTop: 8 }}>{fmtUsd(amount, { cents: false })}</MonoNum>
      <Label style={{ marginTop: 6 }}>of {fmtUsd(balance.available)} available</Label>

      <CashSlider value={amount} onChange={setAmount} max={Math.max(25, max)} />

      <Hairline />
      <Row style={styles.meta}>
        <Label>FEE</Label>
        <MonoNum>$0.00</MonoNum>
      </Row>
      <Hairline />
      <Row style={styles.meta}>
        <Label>YOU RECEIVE</Label>
        <MonoNum style={{ color: v.lim }}>{fmtUsd(amount, { cents: false })}</MonoNum>
      </Row>

      <View style={{ flex: 1 }} />
      <PrimaryButton title="CASH OUT NOW" tone="lim" onPress={confirm} disabled={busy || amount <= 0} />
      <Label style={{ textAlign: "center", marginTop: 12 }}>CASH OUT IS 100% FREE · UP TO 1 BUSINESS DAY</Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  locked: { flex: 1, alignItems: "center", justifyContent: "center" },
  meta: { paddingVertical: space.rowPad, justifyContent: "space-between", alignItems: "center" },
})
