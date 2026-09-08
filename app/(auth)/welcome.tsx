import { View, StyleSheet, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  VesselCup,
  PrimaryButton,
  UiText,
  Label,
  Hairline,
  Row,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { pure, space } from "@/theme/vessel"

const PROPS = [
  {
    title: "GIVE",
    body: "Make someone's day. Go live. Send. Be iconic.",
  },
  {
    title: "RECEIVE",
    body: "Ask. Perform. Inspire. Turn moments into opportunities.",
  },
  {
    title: "WATCH",
    body: "The best reality show happens here.",
  },
  {
    title: "LEVEL UP",
    body: "From nobody to legend. Your story, your rise.",
  },
] as const

/** Get Started — value props → connect */
export default function Welcome() {
  const router = useRouter()
  const { v } = useVessel()

  return (
    <VesselScreen nav={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <VesselCup fill={0.72} width={64} height={104} />
          <UiText weight="black" style={[styles.wordmark, { color: v.ink }]}>
            TIN CUP
          </UiText>
          <Label style={{ color: pure.amber, letterSpacing: 3, marginTop: 8 }}>
            LIVE GENEROSITY. REAL STORIES.
          </Label>
        </View>

        <View style={styles.props}>
          {PROPS.map((p) => (
            <Row key={p.title} style={styles.row}>
              <View style={[styles.dot, { borderColor: v.gls }]} />
              <View style={{ flex: 1 }}>
                <UiText weight="bold" style={{ fontSize: 13.5, color: v.ink }}>
                  {p.title}
                </UiText>
                <UiText
                  weight="reg"
                  style={{ fontSize: 11.5, color: v.dim, marginTop: 4, lineHeight: 17 }}
                >
                  {p.body}
                </UiText>
              </View>
            </Row>
          ))}
          <Hairline />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="GET STARTED"
            tone="amb"
            onPress={() => router.push("/(auth)/sign-in")}
          />
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 8,
    gap: space.sectionGap,
  },
  top: {
    alignItems: "center",
    paddingTop: 28,
    gap: 14,
  },
  wordmark: {
    fontSize: 28,
    letterSpacing: 4,
    marginTop: 8,
  },
  props: {
    flex: 1,
  },
  row: {
    gap: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderWidth: 1.2,
    borderRadius: 2,
    marginTop: 4,
  },
  footer: {
    marginTop: "auto" as unknown as number,
    paddingTop: 12,
  },
})
