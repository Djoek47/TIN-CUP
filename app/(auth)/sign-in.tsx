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
import { pure, space } from "@/theme/vessel"

const METHODS: { id: string; label: string; to: "verify" | "fate" }[] = [
  { id: "email", label: "Email", to: "verify" },
  { id: "google", label: "Google", to: "fate" },
  { id: "apple", label: "Apple", to: "fate" },
  { id: "passkey", label: "Passkey", to: "fate" },
  { id: "wallet", label: "Wallet", to: "fate" },
]

/** CONNECT — auth methods → verify or fate */
export default function SignIn() {
  const router = useRouter()
  const { v } = useVessel()
  const { connect, say } = useApp()
  const [busy, setBusy] = useState<string | null>(null)

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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <UiText weight="black" style={{ fontSize: 28, color: v.ink, marginBottom: 6 }}>
          Connect
        </UiText>
        <UiText weight="reg" style={{ fontSize: 13, color: v.dim, lineHeight: 20, marginBottom: 22 }}>
          One tap and you&apos;re in. We make the wallet for you — no seed phrase, nothing to lose.
        </UiText>

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
            SECURED BY THIRDWEB
          </Label>
          <Label style={{ textAlign: "center", marginTop: 6, color: v.faint }}>
            WE NEVER HOLD YOUR KEYS
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
