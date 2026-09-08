import { ScrollView, View, StyleSheet } from "react-native"
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
import { space } from "@/theme/vessel"

const LADDER = [
  { lv: 9, name: "SOVEREIGN", xp: "50,000 XP", you: false, cleared: false },
  { lv: 8, name: "TYCOON", xp: "25,000 XP", you: false, cleared: false },
  { lv: 7, name: "BARON", xp: "2,650 / 10,000 XP", you: true, cleared: false },
  { lv: 6, name: "PATRON", xp: "CLEARED", you: false, cleared: true },
  { lv: 5, name: "REGULAR", xp: "CLEARED", you: false, cleared: true },
]

const PERKS = [
  { n: "+10%", l: "Gift impact" },
  { n: "+5%", l: "Court rewards" },
  { n: "ON", l: "Priority in feed" },
  { n: "ON", l: "Custom profile frame" },
  { n: "LV 8", l: "Run your own Court" },
]

export default function LevelScreen() {
  const router = useRouter()
  const { v } = useVessel()

  return (
    <VesselScreen>
      <ScreenHeader title="Your Level" onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {LADDER.map((r) => (
          <View key={r.lv}>
            <Hairline />
            <Row
              style={[
                styles.row,
                r.you ? { backgroundColor: v.surf, marginHorizontal: -8, paddingHorizontal: 8, borderRadius: v.rad } : null,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Label style={{ color: r.you ? v.amb : v.dim }}>
                  LV {r.lv}
                  {r.you ? " · YOU ARE HERE" : r.cleared ? " · CLEARED" : ` · ${r.xp}`}
                </Label>
                <UiText weight="black" style={{ fontSize: 22, marginTop: 6, color: r.you ? v.ink : v.dim }}>
                  {r.name}
                </UiText>
                {r.you ? <MonoNum style={{ marginTop: 6, color: v.amb }}>{r.xp}</MonoNum> : null}
              </View>
            </Row>
          </View>
        ))}

        <Label style={{ marginTop: space.sectionGap }}>Your Perks</Label>
        {PERKS.map((p) => (
          <View key={p.l}>
            <Hairline />
            <Row style={styles.row}>
              <MonoNum style={{ color: v.amb, width: 64, fontSize: 16 }}>{p.n}</MonoNum>
              <UiText weight="semi" style={{ fontSize: 14, flex: 1 }}>
                {p.l}
              </UiText>
            </Row>
          </View>
        ))}
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.rowPad, alignItems: "center" },
})
