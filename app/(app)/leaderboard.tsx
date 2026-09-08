import { useState } from "react"
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
import { useVessel } from "@/providers/VesselTheme"
import { pure, space } from "@/theme/vessel"

const PERIODS = ["DAY", "WEEK", "MONTH", "ALL"] as const

const DATA = [
  {
    podium: [
      { n: "@nova", a: "$1.2K" },
      { n: "@kai", a: "$1.8K" },
      { n: "@zed", a: "$0.9K" },
    ],
    list: [
      { n: "@ace", a: "$720" },
      { n: "@luna", a: "$580" },
      { n: "@phantom", a: "$430" },
      { n: "@stella", a: "$360" },
      { n: "@kingx", a: "$320" },
    ],
    yr: "31",
    ya: "$95",
  },
  {
    podium: [
      { n: "@kingx", a: "$4.1K" },
      { n: "@stella", a: "$6.7K" },
      { n: "@zed", a: "$3.2K" },
    ],
    list: [
      { n: "@kai", a: "$2.9K" },
      { n: "@nova", a: "$2.1K" },
      { n: "@ace", a: "$1.8K" },
      { n: "@luna", a: "$1.4K" },
      { n: "@phantom", a: "$1.1K" },
    ],
    yr: "18",
    ya: "$640",
  },
  {
    podium: [
      { n: "@stella", a: "$12K" },
      { n: "@kai", a: "$18K" },
      { n: "@kingx", a: "$9.4K" },
    ],
    list: [
      { n: "@zed", a: "$7.2K" },
      { n: "@nova", a: "$6.1K" },
      { n: "@ace", a: "$4.8K" },
      { n: "@luna", a: "$3.9K" },
      { n: "@phantom", a: "$3.1K" },
    ],
    yr: "12",
    ya: "$2.1K",
  },
  {
    podium: [
      { n: "@zed", a: "$42K" },
      { n: "@kai", a: "$61K" },
      { n: "@stella", a: "$38K" },
    ],
    list: [
      { n: "@kingx", a: "$29K" },
      { n: "@nova", a: "$24K" },
      { n: "@ace", a: "$19K" },
      { n: "@luna", a: "$15K" },
      { n: "@phantom", a: "$12K" },
    ],
    yr: "47",
    ya: "$8.4K",
  },
]

export default function LeaderboardScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const [period, setPeriod] = useState(0)
  const D = DATA[period]
  // podium visual order: 2nd, 1st, 3rd
  const [second, first, third] = [D.podium[0], D.podium[1], D.podium[2]]

  return (
    <VesselScreen>
      <ScreenHeader title="Top Givers" onBack={() => router.back()} />
      <Row style={{ gap: 6, marginTop: 8 }}>
        {PERIODS.map((p, i) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(i)}
            style={[
              styles.period,
              {
                borderRadius: v.radPill,
                backgroundColor: i === period ? v.ambfill : "transparent",
                borderColor: i === period ? "transparent" : v.line,
              },
            ]}
          >
            <Label style={{ color: i === period ? pure.fillInk : v.dim }}>{p}</Label>
          </Pressable>
        ))}
      </Row>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={styles.podium}>
          <PodiumPlace place={2} name={second.n} amt={second.a} h={96} />
          <PodiumPlace place={1} name={first.n} amt={first.a} h={150} highlight />
          <PodiumPlace place={3} name={third.n} amt={third.a} h={70} />
        </Row>

        {D.list.map((row, i) => (
          <View key={row.n}>
            <Hairline />
            <Row style={styles.row}>
              <MonoNum style={{ width: 28, color: v.dim }}>{String(i + 4).padStart(2, "0")}</MonoNum>
              <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
                {row.n}
              </UiText>
              <MonoNum style={{ color: v.amb }}>{row.a}</MonoNum>
            </Row>
          </View>
        ))}

        <View style={[styles.you, { borderColor: v.amb, backgroundColor: v.surf, borderRadius: v.rad }]}>
          <Row style={{ alignItems: "center" }}>
            <Label style={{ color: v.amb }}>YOUR RANK</Label>
            <View style={{ flex: 1 }} />
            <MonoNum style={{ color: v.amb, marginRight: 12 }}>#{D.yr}</MonoNum>
            <MonoNum>{D.ya}</MonoNum>
          </Row>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

function PodiumPlace({
  place,
  name,
  amt,
  h,
  highlight,
}: {
  place: number
  name: string
  amt: string
  h: number
  highlight?: boolean
}) {
  const { v } = useVessel()
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
      <Label style={{ color: highlight ? v.amb : v.dim }}>{name}</Label>
      <MonoNum style={{ color: highlight ? v.amb : v.dim, fontSize: highlight ? 13 : 11 }}>{amt}</MonoNum>
      <View
        style={{
          width: "100%",
          height: h,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: 0,
          borderColor: highlight ? "rgba(255,180,61,0.5)" : v.gls,
          backgroundColor: highlight ? "rgba(255,180,61,0.28)" : "rgba(255,180,61,0.1)",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <MonoNum style={{ fontSize: highlight ? 23 : 19 }}>{place}</MonoNum>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  period: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  podium: { alignItems: "flex-end", gap: 12, marginTop: 36, height: 220 },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
  you: {
    marginTop: 18,
    marginBottom: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
})
