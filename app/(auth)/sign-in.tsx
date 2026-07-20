import { useState } from "react"
import { View, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "../../lib/supabase"
import { Text, Button } from "../../components/ui"
import { Field } from "../../components/field"
import { Wordmark } from "../../components/wordmark"
import { colors, spacing } from "../../theme"

export default function SignIn() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) setError(error.message)
    // navigation handled by root auth listener
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.md, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.xl }} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>

        <Wordmark size={24} />
        <Text variant="display" style={{ marginTop: spacing.xl }}>
          Welcome back
        </Text>
        <Text variant="body" style={{ marginTop: 6 }}>
          Sign in to pick up where you left off.
        </Text>

        <View style={{ gap: spacing.lg, marginTop: spacing.xxl }}>
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
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
          />
          {error ? (
            <Text variant="caption" color={colors.pink}>
              {error}
            </Text>
          ) : null}
          <Button label="Sign in" onPress={onSubmit} loading={loading} disabled={!email || !password} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.xl, gap: 5 }}>
          <Text variant="body">New to Fanissima?</Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text variant="bodyStrong" color={colors.pink}>
              Create account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
