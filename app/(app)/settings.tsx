import { ScrollView, View, Pressable, Switch, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  Label,
  UiText,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { space } from "@/theme/vessel"

export default function SettingsScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { user, caste, theme, prefs, setTheme, setPrefs, disconnect, say } = useApp()

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="Settings" onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <UiText weight="semi" style={{ fontSize: 16 }}>
            @{user.handle}
          </UiText>
          <Pressable onPress={() => router.push("/(app)/edit-profile" as any)}>
            <Label style={{ color: v.amb }}>EDIT PROFILE</Label>
          </Pressable>
        </Row>

        <Label style={{ marginTop: space.sectionGap }}>ACCOUNT</Label>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Caste
          </UiText>
          <Label style={{ color: caste === "lord" ? v.amb : v.lim }}>{caste.toUpperCase()}</Label>
        </Row>
        {caste !== "lord" ? (
          <>
            <Hairline />
            <Pressable onPress={() => router.push("/(app)/ascension" as any)} style={styles.row}>
              <View style={{ flex: 1 }}>
                <UiText weight="semi" style={{ fontSize: 14 }}>
                  Ascend to Lord
                </UiText>
                <Label style={{ marginTop: 4 }}>$100 ONCE</Label>
              </View>
              <Label style={{ color: v.amb }}>→</Label>
            </Pressable>
          </>
        ) : null}
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Wallet address
          </UiText>
          <Label>{user.address ? `${user.address.slice(0, 6)}···${user.address.slice(-4)}` : "—"}</Label>
        </Row>

        <Label style={{ marginTop: space.sectionGap }}>APPEARANCE</Label>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Theme
          </UiText>
          <Pressable
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={[styles.themeBtn, { borderColor: v.line, borderRadius: v.radPill }]}
          >
            <Label>{theme === "dark" ? "DARK" : "LIGHT"}</Label>
          </Pressable>
        </Row>

        <Label style={{ marginTop: space.sectionGap }}>NOTIFICATIONS</Label>
        <Toggle
          label="Gifts received"
          value={prefs.nGifts}
          onChange={(nGifts) => setPrefs({ nGifts })}
        />
        <Toggle
          label="Someone goes live"
          value={prefs.nLive}
          onChange={(nLive) => setPrefs({ nLive })}
        />
        <Toggle
          label="Court activity"
          value={prefs.nCourt}
          onChange={(nCourt) => setPrefs({ nCourt })}
        />

        <Label style={{ marginTop: space.sectionGap }}>PRIVACY</Label>
        <Toggle
          label="Private profile"
          hint="ONLY FOLLOWERS SEE YOUR FEED"
          value={prefs.priv}
          onChange={(priv) => setPrefs({ priv })}
        />
        <Toggle
          label="Hide my amounts"
          hint="GIVE ANONYMOUSLY"
          value={prefs.hideAmt}
          onChange={(hideAmt) => setPrefs({ hideAmt })}
        />

        <Label style={{ marginTop: space.sectionGap }}>SUPPORT</Label>
        <Hairline />
        <Pressable onPress={() => say("Help coming soon")} style={styles.row}>
          <UiText weight="semi" style={{ fontSize: 14 }}>
            Help
          </UiText>
        </Pressable>
        <Hairline />
        <Pressable onPress={() => say("Terms · Privacy")} style={styles.row}>
          <UiText weight="semi" style={{ fontSize: 14 }}>
            Terms & privacy
          </UiText>
        </Pressable>

        <Pressable
          onPress={async () => {
            await disconnect()
            router.replace("/(auth)/welcome")
          }}
          style={{ marginTop: 28, marginBottom: 8 }}
        >
          <Label style={{ textAlign: "center", color: "#E5484D", letterSpacing: 2 }}>SIGN OUT</Label>
        </Pressable>
        <Label style={{ textAlign: "center", marginBottom: 24 }}>TIN CUP · V1.0 · SECURED BY THIRDWEB</Label>
      </ScrollView>
    </VesselScreen>
  )
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  const { v } = useVessel()
  return (
    <>
      <Hairline />
      <Row style={styles.row}>
        <View style={{ flex: 1 }}>
          <UiText weight="semi" style={{ fontSize: 14 }}>
            {label}
          </UiText>
          {hint ? <Label style={{ marginTop: 4 }}>{hint}</Label> : null}
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: v.line, true: v.ambfill }}
          thumbColor="#fff"
        />
      </Row>
    </>
  )
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.rowPad, alignItems: "center" },
  themeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth },
})
