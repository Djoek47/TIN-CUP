import { View, Pressable, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  VesselScreen,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

export default function ReceivedScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const params = useLocalSearchParams<{ amount?: string; from?: string }>()
  const amount = Number(params.amount ?? 250) || 250
  const from = (params.from ?? "MAVERICK").replace("@", "").toUpperCase()

  return (
    <VesselScreen nav={false}>
      <View style={styles.wrap}>
        <Label style={{ letterSpacing: 4 }}>{from}</Label>
        <UiText weight="semi" style={{ marginTop: 10, color: v.dim, fontSize: 14, letterSpacing: 2 }}>
          SENT YOU
        </UiText>
        <MonoNum style={{ color: v.limfill, fontSize: 56, marginTop: 18 }}>
          {fmtUsd(amount, { cents: false })}
        </MonoNum>
        <UiText
          weight="reg"
          style={{
            color: v.dim,
            fontSize: 15,
            textAlign: "center",
            marginTop: 28,
            lineHeight: 22,
            paddingHorizontal: 12,
          }}
        >
          "Keep going. You're the reason I still watch."
        </UiText>

        <View style={{ width: "100%", marginTop: 48 }}>
          <PrimaryButton title="SAY THANKS ON AIR" tone="lim" onPress={() => router.replace("/(app)/live")} />
        </View>
        <Pressable onPress={() => router.replace("/(app)")} style={{ marginTop: space.sectionGap }}>
          <Label style={{ textAlign: "center" }}>DISMISS</Label>
        </Pressable>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 40 },
})
