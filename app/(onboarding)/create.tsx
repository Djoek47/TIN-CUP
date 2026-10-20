import { View, StyleSheet, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  UiText,
  Label,
  Hairline,
  Row,
  MonoNum,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { pure, space } from "@/theme/vessel"

const CHANGES = [
  { n: "01", title: "Set bounties", body: "Name the challenge. Name the price." },
  { n: "02", title: "Run a Court", body: "Your own room, your own regulars." },
  { n: "03", title: "Gold in every chat", body: "They see you coming." },
  { n: "04", title: "Priority everywhere", body: "Feed, leaderboard, gift rail." },
] as const

/** Ascension pitch (onboarding create remapped) → PONR */
export default function CreateAscension() {
  const router = useRouter()
  const { v } = useVessel()

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="ASCENSION" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Label style={{ color: pure.lime, marginBottom: 18 }}>YOU ARE A VAGRANT</Label>

        <UiText weight="black" style={{ fontSize: 42, color: pure.amber, letterSpacing: 1 }}>
          LORD
        </UiText>
        <UiText
          weight="reg"
          style={{ fontSize: 14, color: v.ink, lineHeight: 22, marginTop: 12, marginBottom: 28 }}
        >
          One payment. No subscription, no renewal, no way down. The cup stays full for as long as
          the app exists.
        </UiText>

        <Label style={{ color: v.faint, marginBottom: 4 }}>WHAT CHANGES</Label>
        {CHANGES.map((c, i) => (
          <View key={c.n}>
            {i === 0 ? <Hairline /> : null}
            <Row style={styles.row}>
              <MonoNum style={{ fontSize: 12, color: v.faint, width: 28 }}>{c.n}</MonoNum>
              <View style={{ flex: 1 }}>
                <UiText weight="bold" style={{ fontSize: 14, color: v.ink }}>
                  {c.title}
                </UiText>
                <UiText weight="reg" style={{ fontSize: 12, color: v.dim, marginTop: 3 }}>
                  {c.body}
                </UiText>
              </View>
            </Row>
            <Hairline />
          </View>
        ))}

        <View style={styles.footer}>
          <PrimaryButton
            title="ASCEND · $100 ONCE"
            tone="amb"
            onPress={() => router.push("/(app)/ponr")}
          />
          <Label style={{ textAlign: "center", marginTop: 14, color: v.faint }}>
            ONE TIME · NO REFUND · NO WAY BACK
          </Label>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  row: {
    alignItems: "flex-start",
  },
  footer: {
    marginTop: space.sectionGap,
  },
})
