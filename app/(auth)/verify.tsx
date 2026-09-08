import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, TextInput, Pressable } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  UiText,
  Label,
  MonoNum,
  Hairline,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { pure, space } from "@/theme/vessel"

/** VERIFY — fake 6-digit OTP (any 6 digits ok) */
export default function Verify() {
  const router = useRouter()
  const { v } = useVessel()
  const { say } = useApp()
  const [code, setCode] = useState("")
  const [secs, setSecs] = useState(34)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (secs <= 0) return
    const t = setTimeout(() => setSecs((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])

  const digits = Array.from({ length: 6 }, (_, i) => code[i] ?? "")
  const ready = code.length === 6

  const resend = () => {
    setSecs(24)
    say("New code sent")
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="VERIFY" onBack={() => router.back()} />

      <Pressable style={styles.body} onPress={() => inputRef.current?.focus()}>
        <UiText weight="black" style={{ fontSize: 28, color: v.ink, lineHeight: 34 }}>
          Check your{"\n"}email
        </UiText>
        <UiText weight="reg" style={{ fontSize: 13, color: v.dim, marginTop: 10 }}>
          Six digits sent to{" "}
          <UiText weight="semi" style={{ color: v.ink }}>
            kai@tincup.app
          </UiText>
        </UiText>

        <View style={styles.boxes}>
          {digits.map((d, i) => {
            const active = i === code.length && code.length < 6
            return (
              <View
                key={i}
                style={[
                  styles.box,
                  {
                    borderColor: active ? pure.amber : v.line,
                    backgroundColor: v.surf,
                    borderRadius: v.rad,
                  },
                ]}
              >
                <MonoNum style={{ fontSize: 22, color: v.ink }}>{d}</MonoNum>
              </View>
            )
          })}
        </View>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoFocus
          style={styles.hidden}
          maxLength={6}
        />

        {secs > 0 ? (
          <Label style={{ color: v.faint, marginTop: 14 }}>
            RESEND IN 00:{String(secs).padStart(2, "0")}
          </Label>
        ) : (
          <Pressable onPress={resend} style={{ marginTop: 14 }}>
            <Label style={{ color: pure.amber }}>RESEND CODE</Label>
          </Pressable>
        )}

        <Hairline style={{ marginTop: 28, marginBottom: 18 }} />

        <View style={styles.status}>
          <View style={[styles.pulse, { backgroundColor: pure.lime }]} />
          <View>
            <UiText weight="semi" style={{ fontSize: 13, color: v.ink }}>
              Creating your wallet
            </UiText>
            <Label style={{ marginTop: 4, color: v.faint }}>
              NO SEED PHRASE · GAS COVERED
            </Label>
          </View>
        </View>
      </Pressable>

      <View style={styles.footer}>
        <PrimaryButton
          title="CONTINUE"
          tone="amb"
          disabled={!ready}
          onPress={() => router.push("/(onboarding)/choose-fate")}
        />
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 8,
  },
  boxes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 28,
  },
  box: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hidden: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingTop: space.sectionGap,
  },
})
