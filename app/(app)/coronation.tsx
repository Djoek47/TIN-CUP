import { View, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ObolMark,
  PrimaryButton,
  UiText,
  Label,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { font, pure, space } from "@/theme/vessel"

/** Coronation — you are now Lord → enter app */
export default function Coronation() {
  const router = useRouter()
  const { v } = useVessel()

  return (
    <VesselScreen nav={false}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <ObolMark size={108} fill={1} moment="idle" useRaster />
          <Label style={{ color: pure.amber, letterSpacing: 4, marginTop: 28 }}>
            YOU ARE NOW
          </Label>
          <UiText
            weight="black"
            style={{
              fontSize: 48,
              color: pure.amber,
              letterSpacing: 2,
              marginTop: 8,
              fontFamily: font.display,
            }}
          >
            LORD
          </UiText>
          <UiText
            weight="reg"
            style={{ fontSize: 14, color: pure.amber, marginTop: 12, opacity: 0.85 }}
          >
            Lords never fall. And never go back.
          </UiText>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="ENTER"
            tone="amb"
            onPress={() => router.replace("/(app)")}
          />
          <Label style={{ textAlign: "center", marginTop: 12, color: v.faint }}>
            TAKE YOUR SEAT
          </Label>
        </View>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingTop: space.sectionGap,
  },
})
