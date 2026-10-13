import { useState } from "react"
import { View, StyleSheet, Pressable, ScrollView } from "react-native"
import { useRouter, type Href } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  UiText,
  Label,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { DEMO_ACCOUNTS, type DemoRole } from "@/lib/demo-accounts"
import { pure, space } from "@/theme/vessel"

const METHODS: { id: string; label: string; to: "verify" | "fate" }[] = [
  { id: "email", label: "Email", to: "verify" },
  { id: "google", label: "Google", to: "fate" },
  { id: "apple", label: "Apple", to: "fate" },
  { id: "passkey", label: "Passkey", to: "fate" },
  { id: "wallet", label: "Wallet", to: "fate" },
]

/** CONNECT — demo dual accounts + auth methods → verify or fate */
export default function SignIn() {
  const router = useRouter()
  const { v } = useVessel()
  const { connect, connectDemo, say } = useApp()
  const [busy, setBusy] = useState<string | null>(null)

  const onDemo = async (role: DemoRole) => {
    if (busy) return
    setBusy(role)
    try {
      await connectDemo(role)
      // Demo accounts already have caste set — skip fate picker, enter app
      router.replace("/(app)" as Href)
    } catch {
      say("Demo connect failed")
    } finally {
      setBusy(null)
    }
  }

  const onMethod = async (method: (typeof METHODS)[number]) => {
    if (busy) return
    setBusy(method.id)
    try {
      await connect(method.id)
      if (method.to === "verify") {
        router.push("/(auth)/verify" as Href)
      } else {
        router.push("/(onboarding)/choose-fate")
      }
    } catch {
      say("Connect failed")
    } finally {
      setBusy(null)
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="CONNECT" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <UiText weight="black" style={{ fontSize: 28, color: v.ink, marginBottom: 6 }}>
          Connect
        </UiText>
        <UiText weight="reg" style={{ fontSize: 13, color: v.dim, lineHeight: 20, marginBottom: 18 }}>
          Start with mock gold — two seeded accounts (peasant + lord). Real rails later.
        </UiText>

        <Label style={{ color: v.amb, marginBottom: 10 }}>MOCK QA · FAKE MONEY</Label>
        <PrimaryButton
          title="ENTER AS VAGRANT (PEASANT)"
          tone="lim"
          disabled={!!busy}
          onPress={() => onDemo("vagrant")}
        />
        <View style={{ height: 10 }} />
        <PrimaryButton
          title="ENTER AS LORD"
          tone="amb"
          disabled={!!busy}
          onPress={() => onDemo("lord")}
        />
        <Label style={{ marginTop: 10, color: v.faint, lineHeight: 18 }}>
          @{DEMO_ACCOUNTS.vagrant.user.handle} · $
          {DEMO_ACCOUNTS.vagrant.seedFiat.available + DEMO_ACCOUNTS.vagrant.seedFiat.hold} mock · go live /
          challenges / cash out
        </Label>
        <Label style={{ marginTop: 4, color: v.faint, lineHeight: 18 }}>
          @{DEMO_ACCOUNTS.lord.user.handle} · $
          {DEMO_ACCOUNTS.lord.seedFiat.available + DEMO_ACCOUNTS.lord.seedFiat.hold} mock · fund bounties /
          pour gifts
        </Label>

        <Label style={{ marginTop: space.sectionGap, marginBottom: 8 }}>OTHER METHODS</Label>
        <View style={styles.list}>
          {METHODS.map((m, i) => (
            <Pressable
              key={m.id}
              disabled={!!busy}
              onPress={() => onMethod(m)}
              style={({ pressed }) => [{ opacity: pressed || busy === m.id ? 0.7 : 1 }]}
            >
              {i === 0 ? null : <Hairline />}
              <Row style={styles.row}>
                <View style={[styles.icon, { borderColor: v.line, backgroundColor: v.surf }]} />
                <UiText weight="semi" style={{ flex: 1, fontSize: 15, color: v.ink }}>
                  {m.label}
                </UiText>
                {m.id === "email" ? (
                  <Label style={{ color: pure.amber }}>CODE</Label>
                ) : (
                  <UiText weight="reg" style={{ color: v.faint, fontSize: 18 }}>
                    ›
                  </UiText>
                )}
              </Row>
            </Pressable>
          ))}
          <Hairline />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title="CONTINUE WITH EMAIL"
            tone="amb"
            disabled={!!busy}
            onPress={() => onMethod(METHODS[0])}
          />
          <Label style={{ textAlign: "center", marginTop: 18, color: v.faint }}>
            MOCK FIRST · STRIPE / THIRDWEB WHEN KEYS SET
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
  list: {
    marginBottom: space.sectionGap,
  },
  row: {
    minHeight: 52,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    marginTop: "auto" as unknown as number,
    paddingTop: 12,
  },
})
