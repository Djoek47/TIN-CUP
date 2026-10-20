/**
 * Supabase Auth — Apple, Google, Email OTP.
 * Demo seats remain available when EXPO_PUBLIC_ALLOW_DEMO_AUTH=1 or __DEV__.
 */
import { Platform } from "react-native"
import * as AppleAuthentication from "expo-apple-authentication"
import * as WebBrowser from "expo-web-browser"
import { makeRedirectUri } from "expo-auth-session"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

WebBrowser.maybeCompleteAuthSession()

export function authConfigured(): boolean {
  return isSupabaseConfigured
}

export function demoAuthAllowed(): boolean {
  if (typeof __DEV__ !== "undefined" && __DEV__) return true
  const flag = process.env.EXPO_PUBLIC_ALLOW_DEMO_AUTH ?? ""
  return flag === "1" || flag.toLowerCase() === "true"
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getAuthUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function signOutAuth(): Promise<void> {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function signInWithEmailOtp(email: string): Promise<void> {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
  if (error) throw error
}

export async function verifyEmailOtp(email: string, token: string): Promise<Session> {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })
  if (error) throw error
  if (!data.session) throw new Error("No session returned")
  return data.session
}

export async function signInWithApple(): Promise<Session> {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")
  if (Platform.OS !== "ios") throw new Error("Apple Sign In is available on iOS")

  const available = await AppleAuthentication.isAvailableAsync()
  if (!available) throw new Error("Apple Sign In is not available on this device")

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })
  if (!credential.identityToken) throw new Error("No Apple identity token")

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
  })
  if (error) throw error
  if (!data.session) throw new Error("No session returned")
  return data.session
}

export async function signInWithGoogle(): Promise<Session> {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured")

  const redirectTo = makeRedirectUri({ scheme: "obol", path: "auth/callback" })
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })
  if (error) throw error
  if (!data.url) throw new Error("No Google OAuth URL")

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
  if (result.type !== "success" || !("url" in result) || !result.url) {
    throw new Error("Google sign-in cancelled")
  }

  const url = new URL(result.url)
  const params = new URLSearchParams(url.hash.replace(/^#/, "") || url.search.replace(/^\?/, ""))
  const access_token = params.get("access_token")
  const refresh_token = params.get("refresh_token")
  if (!access_token || !refresh_token) {
    // PKCE code exchange path
    const code = params.get("code")
    if (code) {
      const { data: exchanged, error: exErr } = await supabase.auth.exchangeCodeForSession(code)
      if (exErr) throw exErr
      if (!exchanged.session) throw new Error("No session after code exchange")
      return exchanged.session
    }
    throw new Error("Missing tokens from Google redirect")
  }

  const { data: setData, error: setErr } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })
  if (setErr) throw setErr
  if (!setData.session) throw new Error("No session returned")
  return setData.session
}

export function onAuthStateChange(cb: (session: Session | null) => void) {
  if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange((_event, session) => cb(session))
}
