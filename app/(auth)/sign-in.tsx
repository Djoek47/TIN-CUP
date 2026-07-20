import { useState } from "react"
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import * as AppleAuthentication from "expo-apple-authentication"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Field } from "@/components/ui/Field"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/providers/AuthProvider"
import { color, space, radius } from "@/theme/tokens"

export default function SignIn() {
  const { signInWithEmail, signUpWithEmail, signInWithApple, configured } = useAuth()
  const [mode, setMode] = useState<"in" | "up">("in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    if (!configured) {
      setError("Supabase isn't connected yet. Add it in project settings.")
      return
    }
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of 6+ characters.")
      return
    }
    setBusy(true)
    const res =
      mode === "in"
        ? await signInWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password, name.trim() || undefined)
    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    if (mode === "up") {
      setError("Check yer email to confirm, then sign in.")
      setMode("in")
    }
    // On success the AuthProvider session listener routes onward via app/index.
  }

  const onApple = async () => {
    setError(null)
    setBusy(true)
    const res = await signInWithApple()
    setBusy(false)
    if (res.error) setError(res.error)
  }

  return (
    <Screen padded scroll edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color={color.text.secondary} />
        </Pressable>

        <View style={styles.header}>
          <Txt variant="displayL">{mode === "in" ? "Ride Back In" : "Stake Yer Claim"}</Txt>
          <Txt variant="bodyM" color={color.text.secondary}>
            {mode === "in"
              ? "The gulch has been waitin' for ya."
              : "Every outlaw needs a name. Make it count."}
          </Txt>
        </View>

        <View style={styles.form}>
          {mode === "up" ? (
            <Field
              label="Outlaw Name"
              icon="person-outline"
              placeholder="Dusty Pete"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          ) : null}
          <Field
            label="Email"
            icon="mail-outline"
            placeholder="you@frontier.co"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            label="Password"
            icon="lock-closed-outline"
            placeholder="At least 6 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? (
            <Txt variant="bodyS" color={color.action.danger}>
              {error}
            </Txt>
          ) : null}

          <Button title={mode === "in" ? "Enter the Gulch" : "Create Account"} onPress={submit} loading={busy} />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Txt variant="overline">or</Txt>
          <View style={styles.line} />
        </View>

        {Platform.OS === "ios" ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={radius.s}
            style={styles.apple}
            onPress={onApple}
          />
        ) : (
          <Button
            title="Sign in with Apple"
            variant="secondary"
            onPress={onApple}
            icon={<Ionicons name="logo-apple" size={18} color={color.action.primary} />}
          />
        )}

        <Pressable onPress={() => setMode((m) => (m === "in" ? "up" : "in"))} style={styles.switch}>
          <Txt variant="bodyS" color={color.text.secondary}>
            {mode === "in" ? "New to the frontier? " : "Already ride with us? "}
            <Txt variant="bodyS" color={color.action.primary}>
              {mode === "in" ? "Stake a claim" : "Sign in"}
            </Txt>
          </Txt>
        </Pressable>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  back: { marginTop: space[2], marginBottom: space[4], width: 32 },
  header: { gap: space[2], marginBottom: space[6] },
  form: { gap: space[4] },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: space[3], marginVertical: space[5] },
  line: { flex: 1, height: 1, backgroundColor: color.border.subtle },
  apple: { height: 54, width: "100%" },
  switch: { alignItems: "center", marginTop: space[6] },
})
