import { useMemo, useState } from "react"
import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"
import type { LedgerEntry } from "@/lib/vessel-types"

const FILTERS = ["ALL", "RECEIVED", "SENT", "CHALLENGE"] as const

function ago(ts: number) {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60_000))
  if (m < 60) return `${m}M`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}H`
  return `${Math.round(h / 24)}D`
}

export default function ActivityScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { ledger } = useApp()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL")

  const rows = useMemo(() => {
    return ledger.filter((e) => {
      if (filter === "ALL") return true
      if (filter === "RECEIVED") return e.dir === "in"
      if (filter === "SENT") return e.dir === "out"
      return e.kind === "challenge" || e.kind === "bounty"
    })
  }, [ledger, filter])

  const today = rows.filter((e) => Date.now() - e.ts < 24 * 3600_000)
  const earlier = rows.filter((e) => Date.now() - e.ts >= 24 * 3600_000)

  return (
    <VesselScreen>
      <ScreenHeader title="Activity" onBack={() => router.back()} />
      <Row style={{ gap: 6, marginTop: 8 }}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.chip,
              {
                borderRadius: v.radPill,
                backgroundColor: filter === f ? v.ink : "transparent",
                borderColor: filter === f ? "transparent" : v.line,
              },
            ]}
          >
            <Label style={{ color: filter === f ? v.bg : v.dim, fontSize: 8 }}>{f}</Label>
          </Pressable>
        ))}
      </Row>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Section title="TODAY" items={today} />
        <Section title="EARLIER" items={earlier} />
        {rows.length === 0 ? (
          <Label style={{ marginTop: 40, textAlign: "center" }}>Nothing here yet</Label>
        ) : null}
      </ScrollView>
    </VesselScreen>
  )
}

function Section({ title, items }: { title: string; items: LedgerEntry[] }) {
  const { v } = useVessel()
  if (!items.length) return null
  return (
    <View style={{ marginTop: space.sectionGap }}>
      <Label style={{ marginBottom: 4 }}>{title}</Label>
      {items.map((e) => (
        <View key={e.id}>
          <Hairline />
          <Row style={styles.row}>
            <View style={{ flex: 1 }}>
              <UiText weight="semi" style={{ fontSize: 13.5 }}>
                {e.who}
              </UiText>
              <Label style={{ marginTop: 3 }}>
                {e.dir === "in" ? "Sent you a gift" : e.kind === "challenge" ? "Challenge" : "You sent a gift"}
              </Label>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <MonoNum style={{ color: e.dir === "in" ? v.lim : v.amb, fontSize: 14 }}>
                {e.dir === "in" ? "+" : "−"}
                {fmtUsd(e.amount, { cents: false })}
              </MonoNum>
              <Label style={{ marginTop: 4 }}>{ago(e.ts)}</Label>
            </View>
          </Row>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
})
