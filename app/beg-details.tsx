import { useMemo, useState } from "react"
import { View, StyleSheet, Alert, Pressable } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Row,
  Hairline,
  CashSlider,
  ImageSlot,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { space } from "@/theme/vessel"

const PRESETS = [10, 25, 50, 100]

/** Beg detail — gift with mock AppState gold */
export default function BegDetailsScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { gift, say, caste } = useApp()
  const params = useLocalSearchParams<{
    name?: string
    title?: string
    story?: string
    raised?: string
    goal?: string
  }>()
  const name = params.name || "Luna"
  const title = params.title || "Rent is due."
  const story = params.story || "Help a girl breathe this month."
  const raised = Number(params.raised || 1235)
  const goal = Number(params.goal || 2000)
  const [amount, setAmount] = useState(25)
  const [busy, setBusy] = useState(false)
  const pct = useMemo(() => Math.min(100, Math.round((raised / goal) * 100)), [raised, goal])
  const handle = `@${name.toLowerCase()}`

  const pour = async () => {
    if (busy) return
    setBusy(true)
    try {
      await gift(handle, amount, title)
      Alert.alert("Gold poured", `${amount} → ${handle}`)
      router.replace("/(app)/wallet")
    } catch (e: any) {
      say(e?.message || "Gift failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="Beg" onBack={() => router.back()} />
      <ImageSlot label={`${name} · beg`} height={220} radius={v.rad} />
      <Label style={{ marginTop: 16 }}>{name.toUpperCase()} · LIVE BEG</Label>
      <UiText weight="black" style={{ fontSize: 26, marginTop: 8 }}>
        {title}
      </UiText>
      <UiText weight="reg" style={{ color: v.dim, marginTop: 8, lineHeight: 20 }}>
        {story}
      </UiText>

      <Row style={{ marginTop: 20, justifyContent: "space-between" }}>
        <View>
          <Label>RAISED</Label>
          <MonoNum style={{ color: v.lim, fontSize: 22, marginTop: 4 }}>${raised}</MonoNum>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Label>GOAL</Label>
          <MonoNum style={{ fontSize: 22, marginTop: 4 }}>${goal}</MonoNum>
        </View>
      </Row>
      <View style={[styles.track, { backgroundColor: v.line, marginTop: 10 }]}>
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: v.limfill }} />
      </View>

      <Hairline style={{ marginTop: space.sectionGap }} />
      <Label style={{ marginTop: 12 }}>POUR {caste === "lord" ? "(LORD)" : "(ANYONE)"}</Label>
      <MonoNum style={{ fontSize: 32, marginTop: 6 }}>${amount}</MonoNum>
      <CashSlider value={amount} onChange={setAmount} max={500} step={5} />
      <Row style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        {PRESETS.map((p) => (
          <Pressable
            key={p}
            onPress={() => setAmount(p)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: amount === p ? v.amb : v.line,
              borderRadius: v.radPill,
            }}
          >
            <Label style={{ color: amount === p ? v.amb : v.dim }}>${p}</Label>
          </Pressable>
        ))}
      </Row>

      <View style={{ flex: 1, minHeight: 24 }} />
      <PrimaryButton title={`GIFT ${handle}`} onPress={pour} disabled={busy || amount <= 0} />
      <View style={{ height: 10 }} />
      <PrimaryButton title="WATCH LIVE" tone="lim" onPress={() => router.push("/(app)/live")} />
      <Label style={{ textAlign: "center", marginTop: 10, marginBottom: 8 }}>
        Poured from your available gold
      </Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  track: { height: 4, borderRadius: 2, overflow: "hidden" },
})
