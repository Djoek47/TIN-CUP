import "react-native-url-polyfill/auto"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import Constants from "expo-constants"

const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? ""
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? ""

/** True only when both credentials are present. Screens use this to show a setup prompt. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

const isWeb = Platform.OS === "web"

/**
 * A single shared client. On native we persist the session in AsyncStorage;
 * on web we let supabase-js use its default (localStorage) and detect the
 * session from the URL for OAuth redirects.
 */
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "public-anon-placeholder",
  {
    auth: {
      storage: isWeb ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,
    },
  },
)
