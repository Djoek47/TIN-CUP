import { useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PourSlider,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Row,
  ImageSlot,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { space } from "@/theme/vessel"

const PRESETS = [
  { label: "5%", pct: 0.05 },
  { label: "10%", pct: 0.1 },
  { label: "20%", pct: 0.2 },
  { label: "50%", pct: 0.5 },
]

export default function SendScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { gift } = useApp()
  const max = 500
  const [amount, setAmount] = useState(25)
  const [busy, setBusy] = useState(false)

  const pour = async () => {
    if (busy) return
    setBusy(true)
    try {
      await gift("@kai", amount)
      router.push({ pathname: "/(app)/received", params: { amount: String(amount), from: "@you" } } as any)
    } catch {
      /* toast */
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen>
      <ScreenHeader title="Send a gift" onBack={() => router.back()} />
      <Row style={{ gap: 12, marginTop: 8, alignItems: "center" }}>
        <View style={{ width: 56 }}>
          <ImageSlot label="K" height={56} radius={28} />
        </View>
        <View style={{ flex: 1 }}>
          <UiText weight="bold" style={{ fontSize: 18 }}>
            Kai
          </UiText>
          <Label style={{ marginTop: 2 }}>@kai.creates · LIVE</Label>
        </View>
        <Label style={{ color: v.lim }}>100% · NO CUT</Label>
      </Row>

      <View style={{ marginTop: space.sectionGap }}>
        <PourSlider value={amount} onChange={setAmount} max={max} />
      </View>

      <Row style={{ gap: 8, marginTop: 18, flexWrap: "wrap" }}>
        {PRESETS.map((p) => {
          const n = Math.max(5, Math.round((p.pct * max) / 5) * 5)
          return (
            <Pressable
              key={p.label}
              onPress={() => setAmount(n)}
              style={[
                styles.chip,
                {
                  borderColor: amount === n ? v.amb : v.line,
                  borderRadius: v.radPill,
                  backgroundColor: amount === n ? "rgba(255,180,61,0.12)" : "transparent",
                },
              ]}
            >
              <Label style={{ color: amount === n ? v.amb : v.dim }}>{p.label}</Label>
              <MonoNum style={{ fontSize: 12, marginTop: 2 }}>${n}</MonoNum>
            </Pressable>
          )
        })}
      </Row>

      <View style={{ flex: 1 }} />
      <PrimaryButton title={`POUR $${amount}`} onPress={pour} disabled={busy} />
      <Label style={{ textAlign: "center", marginTop: 12 }}>DRAG THE VESSEL · MIN $5</Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 72,
    alignItems: "center",
  },
})
