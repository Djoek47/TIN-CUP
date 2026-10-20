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
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts"
import { space } from "@/theme/vessel"

const PRESETS = [
  { label: "5%", pct: 0.05 },
  { label: "10%", pct: 0.1 },
  { label: "20%", pct: 0.2 },
  { label: "50%", pct: 0.5 },
]

const RECIPIENTS = [
  {
    handle: `@${DEMO_ACCOUNTS.vagrant.user.handle}`,
    name: DEMO_ACCOUNTS.vagrant.user.displayName,
    sub: "Test vagrant · escrow peer",
    letter: "D",
  },
  {
    handle: `@${DEMO_ACCOUNTS.lord.user.handle}`,
    name: DEMO_ACCOUNTS.lord.user.displayName,
    sub: "Test lord · escrow peer",
    letter: "B",
  },
]

export default function SendScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { gift, demoRole } = useApp()
  const max = 500
  const [amount, setAmount] = useState(25)
  const [busy, setBusy] = useState(false)
  const defaultIdx = demoRole === "lord" ? 0 : 1
  const [who, setWho] = useState(defaultIdx)
  const R = RECIPIENTS[who]

  const pour = async () => {
    if (busy) return
    setBusy(true)
    try {
      await gift(R.handle, amount)
      router.push({
        pathname: "/(app)/received",
        params: { amount: String(amount), from: "@you", to: R.handle },
      } as any)
    } catch {
      /* toast */
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen>
      <ScreenHeader title="Send a gift" onBack={() => router.back()} />
      <Label style={{ marginTop: 4 }}>RECIPIENT</Label>
      <Row style={{ gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {RECIPIENTS.map((r, i) => (
          <Pressable
            key={r.handle}
            onPress={() => setWho(i)}
            style={[
              styles.chip,
              {
                borderColor: who === i ? v.amb : v.line,
                borderRadius: v.radPill,
                backgroundColor: who === i ? "rgba(255,180,61,0.12)" : "transparent",
              },
            ]}
          >
            <Label style={{ color: who === i ? v.amb : v.dim }}>{r.handle}</Label>
          </Pressable>
        ))}
      </Row>

      <Row style={{ gap: 12, marginTop: 18, alignItems: "center" }}>
        <View style={{ width: 56 }}>
          <ImageSlot label={R.letter} height={56} radius={28} />
        </View>
        <View style={{ flex: 1 }}>
          <UiText weight="bold" style={{ fontSize: 18 }}>
            {R.name}
          </UiText>
          <Label style={{ marginTop: 2 }}>{R.sub}</Label>
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
      <PrimaryButton title={`POUR $${amount} → ${R.handle}`} onPress={pour} disabled={busy} />
      <Label style={{ textAlign: "center", marginTop: 12 }}>
        100% TO THE RECIPIENT · NO CUT
      </Label>
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
