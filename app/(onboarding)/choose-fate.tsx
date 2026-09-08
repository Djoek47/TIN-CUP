import { useState } from "react"
import { View, StyleSheet, Pressable, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  PrimaryButton,
  UiText,
  Label,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { pure, space } from "@/theme/vessel"

type Pick = "vagrant" | "lord"

const VAGRANT = {
  title: "VAGRANT",
  price: "FREE",
  blurb: "The drifter. Receives coin. Beg, perform, climb.",
  ok: ["Go live and ask", "Enter challenges for cash", "Cash out, zero fees"],
  no: ["Can't run Courts or set bounties"],
} as const

const LORD = {
  title: "LORD",
  price: "$100 ONCE",
  blurb: "The patron. Gives coin. Sets bounties, runs Courts, rains gold.",
  ok: [
    "Everything a Vagrant has",
    "Set bounties, run your own Court",
    "Gold name in every chat",
    "Paid once. Yours forever.",
  ],
  no: [] as string[],
} as const

/** Choose Fate — Vagrant vs Lord */
export default function ChooseFate() {
  const router = useRouter()
  const { v } = useVessel()
  const { chooseVagrant, say } = useApp()
  const [pick, setPick] = useState<Pick>("vagrant")
  const [busy, setBusy] = useState(false)

  const go = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (pick === "vagrant") {
        await chooseVagrant()
        router.replace("/(app)")
      } else {
        router.push("/(onboarding)/create")
      }
    } catch {
      say("Could not choose fate")
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Label style={{ color: v.faint, marginBottom: 10 }}>STEP 3 OF 3</Label>
        <UiText weight="black" style={{ fontSize: 28, color: v.ink, lineHeight: 32 }}>
          Choose{"\n"}your side
        </UiText>
        <UiText
          weight="reg"
          style={{ fontSize: 13, color: v.dim, lineHeight: 20, marginTop: 10, marginBottom: 22 }}
        >
          Two ways to hold the cup. You can climb from one to the other. You can never climb back.
        </UiText>

        <Panel
          data={VAGRANT}
          selected={pick === "vagrant"}
          color={pure.lime}
          onPress={() => setPick("vagrant")}
        />
        <Panel
          data={LORD}
          selected={pick === "lord"}
          color={pure.amber}
          onPress={() => setPick("lord")}
          style={{ marginTop: 12 }}
        />

        <View style={styles.footer}>
          <PrimaryButton
            title={
              pick === "vagrant" ? "START AS A VAGRANT" : "BECOME A LORD · $100"
            }
            tone={pick === "vagrant" ? "lim" : "amb"}
            disabled={busy}
            onPress={go}
          />
          <Label style={{ textAlign: "center", marginTop: 14, color: v.faint }}>
            LORDS NEVER FALL. AND NEVER GO BACK.
          </Label>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

function Panel({
  data,
  selected,
  color,
  onPress,
  style,
}: {
  data: typeof VAGRANT | typeof LORD
  selected: boolean
  color: string
  onPress: () => void
  style?: object
}) {
  const { v } = useVessel()
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.panel,
        {
          borderColor: selected ? color : v.line,
          backgroundColor: selected ? `${color}14` : v.surf,
          borderRadius: v.rad,
        },
        style,
      ]}
    >
      <View style={styles.panelHead}>
        <UiText weight="black" style={{ fontSize: 15, color, letterSpacing: 1 }}>
          {data.title}
        </UiText>
        <Label style={{ color }}>{data.price}</Label>
      </View>
      <UiText weight="reg" style={{ fontSize: 12.5, color: v.ink, marginTop: 8, lineHeight: 18 }}>
        {data.blurb}
      </UiText>
      <View style={{ marginTop: 12, gap: 8 }}>
        {data.ok.map((line) => (
          <View key={line} style={styles.bullet}>
            <UiText style={{ color, fontSize: 13, width: 16 }}>✓</UiText>
            <UiText weight="reg" style={{ flex: 1, fontSize: 12.5, color: v.ink }}>
              {line}
            </UiText>
          </View>
        ))}
        {data.no.map((line) => (
          <View key={line} style={styles.bullet}>
            <UiText style={{ color: v.faint, fontSize: 13, width: 16 }}>✕</UiText>
            <UiText weight="reg" style={{ flex: 1, fontSize: 12.5, color: v.faint }}>
              {line}
            </UiText>
          </View>
        ))}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  panel: {
    borderWidth: 1,
    padding: 16,
  },
  panelHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  footer: {
    marginTop: space.sectionGap,
  },
})
