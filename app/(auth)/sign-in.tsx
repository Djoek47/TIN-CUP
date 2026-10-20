import { useState } from "react"
import { View, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform } from "react-native"
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
import {
  authConfigured,
  demoAuthAllowed,
  signInWithApple,
  signInWithEmailOtp,
  signInWithGoogle,
} from "@/lib/auth"
import { pure, space } from "@/theme/vessel"

/** CONNECT — real auth methods + optional demo seats */
export default function SignIn() {
  const router = useRouter()
  const { v } = useVessel()
  const { connectDemo, hydrateFromAuth, say } = useApp()
  const [busy, setBusy] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  const onDemo = async (role: DemoRole) => {
    if (busy) return
    if (!demoAuthAllowed()) {
      say("Demo seats are off in this build")
      return
    }
    setBusy(role)
    try {
      await connectDemo(role)
      router.replace("/(app)" as Href)
    } catch {
      say("Connect failed")
    } finally {
      setBusy(null)
    }
  }

  const afterAuth = async () => {
    await hydrateFromAuth()
    router.replace("/(onboarding)/choose-fate" as Href)
  }

  const onApple = async () => {
    if (busy) return
    if (!authConfigured()) {
      Alert.alert("Auth not configured", "Set Supabase URL + anon key first.")
      return
    }
    setBusy("apple")
    try {
      await signInWithApple()
      await afterAuth()
    } catch (e: any) {
      if (e?.code !== "ERR_REQUEST_CANCELED") {
        say(e?.message || "Apple sign-in failed")
      }
    } finally {
      setBusy(null)
    }
  }

  const onGoogle = async () => {
    if (busy) return
    if (!authConfigured()) {
      Alert.alert("Auth not configured", "Set Supabase URL + anon key first.")
      return
    }
    setBusy("google")
    try {
      await signInWithGoogle()
      await afterAuth()
    } catch (e: any) {
      say(e?.message || "Google sign-in failed")
    } finally {
      setBusy(null)
    }
  }

  const onEmail = async () => {
    if (busy) return
    const trimmed = email.trim().toLowerCase()
    if (!trimmed.includes("@")) {
      say("Enter a valid email")
      return
    }
    if (!authConfigured()) {
      Alert.alert("Auth not configured", "Set Supabase URL + anon key first.")
      return
    }
    setBusy("email")
    try {
      await signInWithEmailOtp(trimmed)
      router.push({ pathname: "/(auth)/verify", params: { email: trimmed } } as Href)
    } catch (e: any) {
      say(e?.message || "Could not send code")
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
          Sign in to stream, pour gold, and cash out.
        </UiText>

        {demoAuthAllowed() ? (
          <>
            <Label style={{ color: v.amb, marginBottom: 10 }}>QUICK START (QA)</Label>
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
              @{DEMO_ACCOUNTS.vagrant.user.handle} · go live / challenges / cash out
            </Label>
            <Label style={{ marginTop: 4, color: v.faint, lineHeight: 18 }}>
              @{DEMO_ACCOUNTS.lord.user.handle} · fund bounties / pour gifts
            </Label>
          </>
        ) : null}

        <Label style={{ marginTop: space.sectionGap, marginBottom: 8 }}>SIGN IN</Label>
        <View style={styles.list}>
          <Pressable
            disabled={!!busy}
            onPress={onApple}
            style={({ pressed }) => [{ opacity: pressed || busy === "apple" ? 0.7 : 1 }]}
          >
            <Row style={styles.row}>
              <View style={[styles.icon, { borderColor: v.line, backgroundColor: v.surf }]} />
              <UiText weight="semi" style={{ flex: 1, fontSize: 15, color: v.ink }}>
                Apple
              </UiText>
              <Label style={{ color: Platform.OS === "ios" ? pure.amber : v.faint }}>
                {Platform.OS === "ios" ? "READY" : "iOS"}
              </Label>
            </Row>
          </Pressable>
          <Hairline />
          <Pressable
            disabled={!!busy}
            onPress={onGoogle}
            style={({ pressed }) => [{ opacity: pressed || busy === "google" ? 0.7 : 1 }]}
          >
            <Row style={styles.row}>
              <View style={[styles.icon, { borderColor: v.line, backgroundColor: v.surf }]} />
              <UiText weight="semi" style={{ flex: 1, fontSize: 15, color: v.ink }}>
                Google
              </UiText>
              <Label style={{ color: pure.amber }}>OAUTH</Label>
            </Row>
          </Pressable>
          <Hairline />
        </View>

        <Label style={{ marginBottom: 8 }}>EMAIL</Label>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={v.faint}
          style={[
            styles.input,
            { color: v.ink, borderColor: v.line, backgroundColor: v.surf, borderRadius: v.rad },
          ]}
        />

        <View style={styles.footer}>
          <PrimaryButton
            title="CONTINUE WITH EMAIL"
            tone="amb"
            disabled={!!busy}
            onPress={onEmail}
          />
          {!authConfigured() ? (
            <Label style={{ marginTop: 10, color: v.faint, textAlign: "center" }}>
              Supabase Auth not configured — demo seats still work in QA builds.
            </Label>
          ) : null}
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
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto" as unknown as number,
    paddingTop: 12,
  },
})
