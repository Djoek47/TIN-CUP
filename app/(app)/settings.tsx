import { useEffect, useState } from "react"
import { ScrollView, View, Pressable, Switch, StyleSheet, Alert, Linking } from "react-native"
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
import { DEMO_ACCOUNTS, type DemoRole } from "@/lib/demo-accounts"
import { demoAuthAllowed } from "@/lib/auth"
import { stripeConfigured } from "@/lib/stripe"
import { fetchConnectStatus, startConnectOnboarding } from "@/lib/money-api"
import { registerPushToken } from "@/lib/push"
import { livekitConfigured } from "@/lib/livekit"
import { space } from "@/theme/vessel"

export default function SettingsScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const {
    user,
    caste,
    theme,
    prefs,
    setTheme,
    setPrefs,
    disconnect,
    connectDemo,
    demoRole,
    say,
    moneyBadge,
    authUserId,
    refreshFromServer,
  } = useApp()
  const [connectStatus, setConnectStatus] = useState<string>("—")

  useEffect(() => {
    ;(async () => {
      const id = authUserId || user.address
      if (!id) return
      const st = await fetchConnectStatus(id)
      if (!st?.stripe_account_id) setConnectStatus("NOT LINKED")
      else if (st.stripe_payouts_enabled) setConnectStatus("PAYOUTS ON")
      else setConnectStatus("ONBOARDING")
      if (prefs.nGifts || prefs.nLive || prefs.nCourt) {
        await registerPushToken(id)
      }
    })()
  }, [authUserId, user.address, prefs.nGifts, prefs.nLive, prefs.nCourt])

  const switchDemo = (role: DemoRole) => {
    Alert.alert(
      `Switch to ${DEMO_ACCOUNTS[role].label}?`,
      "Loads that account’s gold balance. Current session is replaced.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: async () => {
            await connectDemo(role)
            router.replace("/(app)")
          },
        },
      ],
    )
  }

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
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Display currency
          </UiText>
          <Pressable
            onPress={() => setPrefs({ currency: prefs.currency === "USD" ? "CAD" : "USD" })}
            style={[styles.themeBtn, { borderColor: v.line, borderRadius: v.radPill }]}
          >
            <Label>{prefs.currency}</Label>
          </Pressable>
        </Row>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Gold unit
          </UiText>
          <Pressable
            onPress={() => {
              const order = ["mg", "g", "kg", "lb", "oz"] as const
              const i = order.indexOf(prefs.massUnit)
              setPrefs({ massUnit: order[(i + 1) % order.length] })
            }}
            style={[styles.themeBtn, { borderColor: v.line, borderRadius: v.radPill }]}
          >
            <Label>{prefs.massUnit.toUpperCase()}</Label>
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

        <Label style={{ marginTop: space.sectionGap }}>INBOX & CREATION</Label>
        <Hairline />
        <Pressable onPress={() => router.push("/(app)/notifications" as any)} style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Notifications
          </UiText>
          <Label style={{ color: v.amb }}>→</Label>
        </Pressable>
        <Hairline />
        <Pressable onPress={() => router.push("/(app)/compose" as any)} style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Compose beg
          </UiText>
          <Label style={{ color: v.amb }}>→</Label>
        </Pressable>
        <Hairline />
        <Pressable onPress={() => router.push("/(app)/activity" as any)} style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Activity ledger
          </UiText>
          <Label style={{ color: v.amb }}>→</Label>
        </Pressable>

        <Label style={{ marginTop: space.sectionGap }}>MONEY RAIL</Label>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Mode
          </UiText>
          <Label style={{ color: v.amb }}>{moneyBadge}</Label>
        </Row>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Stripe publishable
          </UiText>
          <Label style={{ color: stripeConfigured() ? v.lim : v.dim }}>
            {stripeConfigured() ? "READY" : "NOT SET"}
          </Label>
        </Row>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Stripe Connect
          </UiText>
          <Label style={{ color: v.dim }}>{connectStatus}</Label>
        </Row>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            LiveKit
          </UiText>
          <Label style={{ color: livekitConfigured() ? v.lim : v.dim }}>
            {livekitConfigured() ? "READY" : "NOT SET"}
          </Label>
        </Row>
        <Hairline />
        {caste !== "lord" ? (
          <>
            <Pressable
              onPress={async () => {
                try {
                  const url = await startConnectOnboarding("obol://wallet")
                  await Linking.openURL(url)
                } catch (e: any) {
                  say(e?.message || "Connect onboarding failed")
                }
              }}
              style={styles.row}
            >
              <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
                Set up cash-out (Connect)
              </UiText>
              <Label style={{ color: v.amb }}>→</Label>
            </Pressable>
            <Hairline />
          </>
        ) : null}
        <Pressable
          onPress={async () => {
            await refreshFromServer()
            say("Balance refreshed")
          }}
          style={styles.row}
        >
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Refresh balance from server
          </UiText>
          <Label style={{ color: v.amb }}>↻</Label>
        </Pressable>
        <Hairline />
        <Pressable onPress={() => router.push("/(app)/deposit")} style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            Add gold
          </UiText>
          <Label style={{ color: v.amb }}>→</Label>
        </Pressable>

        {demoAuthAllowed() ? (
          <>
            <Label style={{ marginTop: space.sectionGap }}>SWITCH ACCOUNT</Label>
            <Hairline />
            <Pressable
              onPress={() => switchDemo("vagrant")}
              style={styles.row}
              disabled={demoRole === "vagrant"}
            >
              <View style={{ flex: 1 }}>
                <UiText weight="semi" style={{ fontSize: 14 }}>
                  Enter as Vagrant
                </UiText>
                <Label style={{ marginTop: 4 }}>@{DEMO_ACCOUNTS.vagrant.user.handle} · peasant</Label>
              </View>
              <Label style={{ color: demoRole === "vagrant" ? v.lim : v.amb }}>
                {demoRole === "vagrant" ? "ACTIVE" : "SWITCH"}
              </Label>
            </Pressable>
            <Hairline />
            <Pressable onPress={() => switchDemo("lord")} style={styles.row} disabled={demoRole === "lord"}>
              <View style={{ flex: 1 }}>
                <UiText weight="semi" style={{ fontSize: 14 }}>
                  Enter as Lord
                </UiText>
                <Label style={{ marginTop: 4 }}>@{DEMO_ACCOUNTS.lord.user.handle} · lord</Label>
              </View>
              <Label style={{ color: demoRole === "lord" ? v.amb : v.lim }}>
                {demoRole === "lord" ? "ACTIVE" : "SWITCH"}
              </Label>
            </Pressable>
          </>
        ) : null}

        <Label style={{ marginTop: space.sectionGap }}>SUPPORT</Label>
        <Hairline />
        <Pressable
          onPress={() =>
            Alert.alert(
              "0bol help",
              "Vagrant: go live, enter challenges, cash out, ascend.\nLord: fund bounties, pour gifts.\nSwitch accounts under Switch Account.",
            )
          }
          style={styles.row}
        >
          <UiText weight="semi" style={{ fontSize: 14 }}>
            Help
          </UiText>
        </Pressable>
        <Hairline />
        <Pressable
          onPress={() =>
            Alert.alert(
              "Terms & privacy",
              "Reference gold is not physical metal. Contact the project owner for production terms.",
              [{ text: "OK" }],
            )
          }
          style={styles.row}
        >
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
        <Label style={{ textAlign: "center", marginBottom: 8 }}>{moneyBadge}</Label>
        <Label style={{ textAlign: "center", marginBottom: 24 }}>0bol · V1.0 · A COIN FOR THE CROSSING</Label>
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
