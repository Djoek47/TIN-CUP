import { useState } from "react"
import { View, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "../../lib/supabase"
import { Text, Button, Chip } from "../../components/ui"
import { Field } from "../../components/field"
import { Wordmark } from "../../components/wordmark"
import { colors, spacing } from "../../theme"

const SPORTS = ["Football", "Basketball", "Tennis", "Athletics", "Gymnastics", "Volleyball"]

export default function SignUp() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const toggle = (s: string) =>
    setInterests((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const onSubmit = async () => {
    setError(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim(), favorite_sports: interests },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // If email confirmation is required there's no active session yet
    if (!data.session) setSent(true)
    // otherwise root auth listener routes into the app
  }

  if (sent) {
    return (
      <View style={{ flex: 1, padding: spacing.xl, paddingTop: insets.top + spacing.xxl, gap: spacing.lg }}>
        <Wordmark size={24} />
        <View style={{ flex: 1, justifyContent: "center", gap: spacing.md }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.pink + "22", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="mail-outline" size={30} color={colors.pink} />
          </View>
          <Text variant="display">Check your inbox</Text>
          <Text variant="body">
            We sent a confirmation link to {email}. Tap it to activate your account, then sign in.
          </Text>
          <Button label="Go to sign in" onPress={() => router.replace("/(auth)/sign-in")} style={{ marginTop: spacing.md }} />
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.xl }} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>

        <Wordmark size={24} />
        <Text variant="display" style={{ marginTop: spacing.xl }}>
          Join the movement
        </Text>
        <Text variant="body" style={{ marginTop: 6 }}>
          Build your feed around the athletes and sports you love.
        </Text>

        <View style={{ gap: spacing.lg, marginTop: spacing.xxl }}>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={{ gap: spacing.sm }}>
            <Text variant="overline">Sports you follow</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {SPORTS.map((s) => (
                <Chip key={s} label={s} active={interests.includes(s)} onPress={() => toggle(s)} />
              ))}
            </View>
          </View>

          {error ? (
            <Text variant="caption" color={colors.pink}>
              {error}
            </Text>
          ) : null}
          <Button
            label="Create account"
            onPress={onSubmit}
            loading={loading}
            disabled={!name || !email || password.length < 6}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.xl, gap: 5 }}>
          <Text variant="body">Already have an account?</Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text variant="bodyStrong" color={colors.pink}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
