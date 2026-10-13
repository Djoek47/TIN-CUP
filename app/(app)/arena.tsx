import { useState } from "react"
import { View, Pressable, StyleSheet, ScrollView, Alert } from "react-native"
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
    fund: 250,
    entry: 5,
    c: "02:15:42",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
    challengeId: "1",
  },
  {
    k: "ROULETTE · SPINS EVERY 5 MIN",
    t: "Blind Give",
    s: "Random stranger. Random amount. No takebacks.",
    r: "$25–$500",
    fund: 100,
    entry: 5,
    c: "00:04:18",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
    challengeId: "2",
  },
  {
    k: "EVENT · STARTS SATURDAY",
    t: "Midnight Marathon",
    s: "Six hours live. Highest total takes the pot.",
    r: "$5,000",
    fund: 500,
    entry: 10,
    c: "2D 06:00",
    vagrant: "ENTER CHALLENGE",
    lord: "FUND THIS BOUNTY",
    challengeId: "3",
  },
]

const LIVE_LIST = [
  { t: "Dance in public", r: "$120", c: "01:45:12", path: "/(app)/live" as const },
  { t: "Sing your ex a song", r: "$80", c: "00:52:03", path: "/(app)/live" as const },
]

export default function ArenaScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { enterChallenge, fundBounty, say } = useApp()
  const [tab, setTab] = useState(0)
  const [busy, setBusy] = useState(false)
  const A = ARENAS[tab]
  const cta = isLord ? A.lord : A.vagrant

  const onCta = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (isLord) {
        await fundBounty(A.t, A.fund)
        Alert.alert("Bounty funded", `${A.t} · $${A.fund} held in mock escrow.`)
        router.push("/(app)/wallet")
      } else {
        await enterChallenge(A.t, A.entry)
        Alert.alert("You're in", `Stake $${A.entry} held. Record & post to claim.`)
        router.push({ pathname: "/challenge-details", params: { id: A.challengeId } })
      }
    } catch (e: any) {
      say(e?.message || "Action failed")
    } finally {
      setBusy(false)
    }
  }

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
        <Pressable
          onPress={() =>
            router.push({ pathname: "/challenge-details", params: { id: A.challengeId } })
          }
        >
          <Label style={{ marginTop: space.sectionGap }}>{A.k}</Label>
          <UiText weight="black" style={{ fontSize: 28, marginTop: 10 }}>
            {A.t}
          </UiText>
          <UiText weight="reg" style={{ color: v.dim, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
            {A.s}
          </UiText>
        </Pressable>

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
          <PrimaryButton title={cta} onPress={onCta} disabled={busy} />
        </View>
        <Label style={{ marginTop: 10, textAlign: "center", color: v.faint }}>
          {isLord
            ? `Funds $${A.fund} from available → bounty escrow`
            : `Entry stake $${A.entry} held · then record via compose / go live`}
        </Label>

        <Label style={{ marginTop: space.sectionGap }}>Live Now</Label>
        {LIVE_LIST.map((item) => (
          <Pressable key={item.t} onPress={() => router.push(item.path)}>
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
          </Pressable>
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
