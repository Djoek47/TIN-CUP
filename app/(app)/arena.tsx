import { useState } from "react"
import { View, Pressable, StyleSheet, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Row,
  Hairline,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { useApp } from "@/providers/AppState"
import { space } from "@/theme/vessel"

const TABS = ["Challenges", "Roulette", "Events"] as const

const ARENAS = [
  {
    k: "FEATURED · 4,102 ENTERED",
    t: "Spicy Truth",
    s: "Eat a ghost pepper in 60 seconds.",
    r: "$250",
    c: "02:15:42",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
  },
  {
    k: "ROULETTE · SPINS EVERY 5 MIN",
    t: "Blind Give",
    s: "Random stranger. Random amount. No takebacks.",
    r: "$25–$500",
    c: "00:04:18",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
  },
  {
    k: "EVENT · STARTS SATURDAY",
    t: "Midnight Marathon",
    s: "Six hours live. Highest total takes the pot.",
    r: "$5,000",
    c: "2D 06:00",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
  },
]

const LIVE_LIST = [
  { t: "Dance in public", r: "$120", c: "01:45:12" },
  { t: "Sing your ex a song", r: "$80", c: "00:52:03" },
]

export default function ArenaScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { say } = useApp()
  const [tab, setTab] = useState(0)
  const A = ARENAS[tab]
  const cta = isLord ? A.lord : A.vagrant

  return (
    <VesselScreen>
      <ScreenHeader title="Arena" onBack={() => router.back()} />
      <Row style={{ gap: 6, marginTop: 8 }}>
        {TABS.map((name, i) => (
          <Pressable
            key={name}
            onPress={() => setTab(i)}
            style={[
              styles.tab,
              {
                borderRadius: v.radPill,
                backgroundColor: i === tab ? v.ambfill : "transparent",
                borderColor: i === tab ? "transparent" : v.line,
              },
            ]}
          >
            <Label style={{ color: i === tab ? "#0a0a0a" : v.dim }}>{name}</Label>
          </Pressable>
        ))}
      </Row>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Label style={{ marginTop: space.sectionGap }}>{A.k}</Label>
        <UiText weight="black" style={{ fontSize: 28, marginTop: 10 }}>
          {A.t}
        </UiText>
        <UiText weight="reg" style={{ color: v.dim, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
          {A.s}
        </UiText>

        <Row style={{ marginTop: 22, justifyContent: "space-between" }}>
          <View>
            <Label>REWARD</Label>
            <MonoNum style={{ color: v.amb, fontSize: 22, marginTop: 4 }}>{A.r}</MonoNum>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Label>ENDS IN</Label>
            <MonoNum style={{ fontSize: 22, marginTop: 4 }}>{A.c}</MonoNum>
          </View>
        </Row>

        <View style={{ marginTop: 24 }}>
          <PrimaryButton title={cta} onPress={() => say(isLord ? "Bounty funded (test)" : "Entered challenge")} />
        </View>

        <Label style={{ marginTop: space.sectionGap }}>Live Now</Label>
        {LIVE_LIST.map((item) => (
          <View key={item.t}>
            <Hairline />
            <Row style={styles.row}>
              <View style={{ flex: 1 }}>
                <UiText weight="semi" style={{ fontSize: 14 }}>
                  {item.t}
                </UiText>
                <Label style={{ marginTop: 4 }}>{item.c}</Label>
              </View>
              <MonoNum style={{ color: v.lim, fontSize: 16 }}>{item.r}</MonoNum>
            </Row>
          </View>
        ))}
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
})
