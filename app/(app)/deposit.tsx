import { useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  ObolMark,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  CashSlider,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fiatToGoldMg, fmtFiat, fmtGoldMg, FiatCurrency } from "@/lib/gold"
import { space } from "@/theme/vessel"

/** Deposit → platform escrow → mint gold_mg on ledger */
export default function DepositScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { deposit, prefs, setPrefs, moneyMode, isMock } = useApp()
  const [amount, setAmount] = useState(100)
  const [busy, setBusy] = useState(false)
  const currency = prefs.currency
  const mg = fiatToGoldMg(amount, currency)

  const confirm = async () => {
    if (busy || amount <= 0) return
    setBusy(true)
    try {
      await deposit(amount, currency)
      router.replace("/(app)/wallet")
    } finally {
      setBusy(false)
    }
  }

  const setCurrency = (c: FiatCurrency) => setPrefs({ currency: c })

  return (
    <VesselScreen>
      <ScreenHeader title="Add Gold" onBack={() => router.back()} />
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <ObolMark size={96} fill={0.7} moment="arrival" />
        <Label style={{ marginTop: 14, color: v.amb, letterSpacing: 2 }}>ESCROW MINT</Label>
        <UiText weight="semi" style={{ marginTop: 8, textAlign: "center", fontSize: 14, color: v.dim }}>
          Funds sit in platform escrow until gifted or cashed out. Gold is a reference weight — not physical metal.
        </UiText>
      </View>

      <Row style={{ marginTop: 22, gap: 10 }}>
        {(["USD", "CAD"] as FiatCurrency[]).map((c) => (
          <Pressable
            key={c}
            onPress={() => setCurrency(c)}
            style={[
              styles.chip,
              {
                borderColor: currency === c ? v.amb : v.line,
                backgroundColor: currency === c ? v.surf : "transparent",
                borderRadius: v.radPill,
              },
            ]}
          >
            <Label style={{ color: currency === c ? v.amb : v.dim }}>{c}</Label>
          </Pressable>
        ))}
      </Row>

      <Label style={{ marginTop: 18 }}>YOU SEND</Label>
      <MonoNum style={{ fontSize: 36, marginTop: 6 }}>{fmtFiat(amount, currency)}</MonoNum>
      <Label style={{ marginTop: 6, color: v.lim }}>
        ≈ {fmtGoldMg(mg, prefs.massUnit)} reference gold
      </Label>

      <CashSlider value={amount} onChange={setAmount} max={1000} />

      <Hairline />
      <Row style={styles.meta}>
        <Label>RAIL</Label>
        <MonoNum style={{ fontSize: 13 }}>{moneyMode.toUpperCase()}</MonoNum>
      </Row>
      <Hairline />
      <Row style={styles.meta}>
        <Label>ESCROW</Label>
        <Label style={{ color: v.lim }}>
          {isMock ? "MOCK HOLD" : moneyMode === "stripe" ? "STRIPE BALANCE" : "TREASURY WALLET"}
        </Label>
      </Row>

      <View style={{ flex: 1 }} />
      <PrimaryButton
        title={isMock ? "MINT INTO ESCROW" : "CONTINUE TO BANK"}
        onPress={confirm}
        disabled={busy || amount <= 0}
      />
      <Label style={{ textAlign: "center", marginTop: 12 }}>
        Card prices settle off-app when Stripe keys are set
      </Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  meta: {
    paddingVertical: space.rowPad,
    justifyContent: "space-between",
    alignItems: "center",
  },
})
