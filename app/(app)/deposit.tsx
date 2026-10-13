import { useState } from "react"
import { View, StyleSheet, Pressable, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useStripe } from "@stripe/stripe-react-native"
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
import { stripeDeposit, ensureStripeReady } from "@/lib/rails"
import { stripeConfigured } from "@/lib/stripe"
import { space } from "@/theme/vessel"

/** Deposit → Stripe test PaymentSheet (when configured) → escrow mint gold_mg */
export default function DepositScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { deposit, prefs, setPrefs, moneyMode } = useApp()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [amount, setAmount] = useState(100)
  const [busy, setBusy] = useState(false)
  const currency = prefs.currency
  const mg = fiatToGoldMg(amount, currency)
  const stripeOn = stripeConfigured()

  const confirm = async () => {
    if (busy || amount <= 0) return
    setBusy(true)
    try {
      if (stripeOn || moneyMode === "stripe") {
        await ensureStripeReady()
        const intent = await stripeDeposit(amount, currency)
        if (intent.ok && intent.clientSecret) {
          const { error: initErr } = await initPaymentSheet({
            paymentIntentClientSecret: intent.clientSecret,
            merchantDisplayName: "0bol",
          })
          if (initErr) throw new Error(initErr.message)
          const { error: presentErr } = await presentPaymentSheet()
          if (presentErr) {
            if (presentErr.code !== "Canceled") {
              Alert.alert("Payment failed", presentErr.message)
            }
            return
          }
        } else {
          Alert.alert(
            "Card deposit unavailable",
            "Couldn’t reach the payment service. Adding gold to escrow locally instead.",
          )
        }
      }
      await deposit(amount, currency)
      router.replace("/(app)/wallet")
    } catch (e: any) {
      Alert.alert("Deposit failed", e?.message || "Try again")
    } finally {
      setBusy(false)
    }
  }

  const setCurrency = (c: FiatCurrency) => setPrefs({ currency: c })

  return (
    <VesselScreen>
      <ScreenHeader title="Add Gold" onBack={() => router.back()} />
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <ObolMark size={96} fill={0.7} moment="arrival" useRaster />
        <Label style={{ marginTop: 14, color: v.amb, letterSpacing: 2 }}>
          {stripeOn ? "STRIPE ESCROW" : "ESCROW"}
        </Label>
        <UiText weight="semi" style={{ marginTop: 8, textAlign: "center", fontSize: 14, color: v.dim }}>
          Funds sit in platform escrow until gifted or cashed out. Gold is reference weight — not physical metal.
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
      <Label style={{ marginTop: 6, color: v.lim }}>≈ {fmtGoldMg(mg, prefs.massUnit)} reference gold</Label>

      <CashSlider value={amount} onChange={setAmount} max={1000} />

      <Hairline />
      <Row style={styles.meta}>
        <Label>RAIL</Label>
        <MonoNum style={{ fontSize: 13 }}>{moneyMode.toUpperCase()}</MonoNum>
      </Row>
      <Hairline />
      <Row style={styles.meta}>
        <Label>STRIPE</Label>
        <Label style={{ color: stripeOn ? v.lim : v.dim }}>
          {stripeOn ? "TEST MODE READY" : "ADD pk_test_ SECRET"}
        </Label>
      </Row>

      <View style={{ flex: 1 }} />
      <PrimaryButton
        title={stripeOn ? "PAY WITH STRIPE" : "ADD TO ESCROW"}
        onPress={confirm}
        disabled={busy || amount <= 0}
      />
      <Label style={{ textAlign: "center", marginTop: 12 }}>
        {stripeOn ? "Use card 4242 4242 4242 4242 in test mode" : "Local escrow until Stripe pk_test is set"}
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
