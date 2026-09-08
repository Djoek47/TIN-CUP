import { View, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  HoldButton,
  UiText,
  Label,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { motion, pure, space } from "@/theme/vessel"
import { fmtUsd } from "@/lib/money"

/** Point of No Return — hold 2000ms → ascendLord → coronation */
export default function Ponr() {
  const router = useRouter()
  const { v } = useVessel()
  const { ascendLord, say } = useApp()

  const onComplete = async () => {
    try {
      await ascendLord()
      router.replace("/(app)/coronation")
    } catch {
      say("Ascension failed")
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="" onBack={() => router.back()} />
      <View style={styles.body}>
        <Label style={{ color: pure.amber, letterSpacing: 3, textAlign: "center" }}>
          POINT OF NO RETURN
        </Label>
        <MonoNum
          style={{
            fontSize: 56,
            color: pure.amber,
            textAlign: "center",
            marginTop: 18,
            letterSpacing: -1,
          }}
        >
          {fmtUsd(100, { cents: false })}
        </MonoNum>
        <UiText
          weight="reg"
          style={{
            fontSize: 14,
            color: v.ink,
            lineHeight: 22,
            textAlign: "center",
            marginTop: 18,
            paddingHorizontal: 8,
          }}
        >
          This buys the title once and keeps it forever. There is no refund, no downgrade, no second
          attempt at being a Vagrant.
        </UiText>
      </View>

      <View style={styles.pay}>
        <Hairline />
        <Row>
          <View style={[styles.payIcon, { borderColor: v.line, backgroundColor: v.surf }]} />
          <UiText weight="semi" style={{ flex: 1, fontSize: 14, color: v.ink }}>
            Bank Transfer ···· 4567
          </UiText>
          <Pressable onPress={() => say("Payment method")}>
            <Label style={{ color: pure.amber }}>CHANGE</Label>
          </Pressable>
        </Row>
        <Hairline />
      </View>

      <View style={styles.footer}>
        <HoldButton
          label="HOLD TO ASCEND"
          durationMs={motion.holdPonrMs}
          accent="amb"
          onComplete={onComplete}
        />
        <Label style={{ textAlign: "center", marginTop: 14, color: v.faint }}>
          HOLD TWO SECONDS · SECURED BY THIRDWEB
        </Label>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
  },
  pay: {
    marginBottom: space.sectionGap,
  },
  payIcon: {
    width: 28,
    height: 20,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    paddingBottom: 4,
  },
})
