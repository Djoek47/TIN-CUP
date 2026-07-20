import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { Platform } from "react-native"
import { Session } from "@supabase/supabase-js"
import * as AppleAuthentication from "expo-apple-authentication"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Profile } from "@/lib/types"

interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  refreshProfile: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>
  signInWithApple: () => Promise<{ error?: string }>
  updateProfile: (patch: Partial<Profile>) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
    setProfile((data as Profile) ?? null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) await loadProfile(session.user.id)
  }, [session, loadProfile])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session?.user?.id) await loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      if (s?.user?.id) await loadProfile(s.user.id)
      else setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: displayName ? { display_name: displayName } : undefined },
    })
    return { error: error?.message }
  }, [])

  const signInWithApple = useCallback(async () => {
    try {
      if (Platform.OS !== "ios") {
        return { error: "Sign in with Apple runs on a real iPhone (Expo Go / TestFlight). Use email here on web." }
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      if (!credential.identityToken) return { error: "No identity token from Apple." }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      })
      // Capture the name Apple gives us only on first sign-in.
      if (!error && credential.fullName?.givenName) {
        const name = [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(" ")
        await supabase.auth.updateUser({ data: { display_name: name } })
      }
      return { error: error?.message }
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return { error: undefined }
      return { error: e?.message ?? "Apple sign-in failed." }
    }
  }, [])

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!session?.user?.id) return { error: "Not signed in." }
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", session.user.id)
        .select("*")
        .maybeSingle()
      if (!error && data) setProfile(data as Profile)
      return { error: error?.message }
    },
    [session],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        configured: isSupabaseConfigured,
        refreshProfile,
        signInWithEmail,
        signUpWithEmail,
        signInWithApple,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
