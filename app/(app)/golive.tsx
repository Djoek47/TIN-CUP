import { useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  HoldButton,
  PrimaryButton,
  ImageSlot,
  Label,
  UiText,
  MonoNum,
  Row,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { motion, space } from "@/theme/vessel"

const CATEGORIES = ["STORY", "MUSIC", "CHALLENGE", "ASK"]
const AUDIENCES = ["PUBLIC", "FOLLOWERS", "COURT"]
const GOALS = [500, 1000, 2000, 5000]

export default function GoLiveScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const [cat, setCat] = useState(0)
  const [aud, setAud] = useState(0)
  const [goal, setGoal] = useState(2)

  if (isLord) {
    return (
      <VesselScreen nav={false}>
        <ScreenHeader title="Go Live" onBack={() => router.back()} />
        <View style={styles.locked}>
          <UiText weight="black" style={{ fontSize: 28, textAlign: "center", lineHeight: 34 }}>
            Lords don't{"\n"}go live.
          </UiText>
          <Label style={{ marginTop: 16, textAlign: "center", color: v.dim }}>
            LORDS NEVER FALL. AND NEVER GO BACK.
          </Label>
          <View style={{ marginTop: 32, width: "100%" }}>
            <PrimaryButton title="POUR INTO SOMEONE" onPress={() => router.replace("/(app)/send" as any)} />
          </View>
        </View>
      </VesselScreen>
    )
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="Go Live" onBack={() => router.back()} />
      <ImageSlot label="PREVIEW · NOT LIVE" height={220} />
      <UiText weight="black" style={{ fontSize: 28, marginTop: 22, lineHeight: 34 }}>
        What's your{"\n"}moment?
      </UiText>

      <Cycle
        label="CATEGORY"
        value={CATEGORIES[cat]}
        onPress={() => setCat((c) => (c + 1) % CATEGORIES.length)}
      />
      <Cycle
        label="AUDIENCE"
        value={AUDIENCES[aud]}
        onPress={() => setAud((a) => (a + 1) % AUDIENCES.length)}
      />
      <Cycle
        label="GOAL"
        value={`$${GOALS[goal].toLocaleString()}`}
        onPress={() => setGoal((g) => (g + 1) % GOALS.length)}
        mono
      />

      <View style={{ flex: 1 }} />
      <HoldButton
        label="HOLD TO GO LIVE"
        durationMs={motion.holdGoLiveMs}
        onComplete={() => router.replace("/(app)/broadcast" as any)}
        accent="lim"
      />
      <Label style={{ textAlign: "center", marginTop: 12 }}>HOLD {motion.holdGoLiveMs / 1000}S TO START</Label>
    </VesselScreen>
  )
}

function Cycle({
  label,
  value,
  onPress,
  mono,
}: {
  label: string
  value: string
  onPress: () => void
  mono?: boolean
}) {
  const { v } = useVessel()
  return (
    <Pressable onPress={onPress} style={[styles.cycle, { borderColor: v.line }]}>
      <Label>{label}</Label>
      <Row style={{ justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        {mono ? (
          <MonoNum style={{ fontSize: 18 }}>{value}</MonoNum>
        ) : (
          <UiText weight="semi" style={{ fontSize: 16 }}>
            {value}
          </UiText>
        )}
        <Label style={{ color: v.amb }}>TAP</Label>
      </Row>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  locked: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  cycle: {
    marginTop: space.sectionGap - 8,
    paddingVertical: space.rowPad,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
})
