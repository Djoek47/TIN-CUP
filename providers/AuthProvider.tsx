import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/types"

const WALLET_KEY = "tinecup_wallet_address"
const PROJECT_WALLET = "0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb"

interface AuthState {
  wallet: string | null
  profile: Profile | null
  loading: boolean
  isLord: boolean
  connectWallet: () => Promise<{ error?: string }>
  disconnectWallet: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (patch: Partial<Profile>) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (walletAddress: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", walletAddress.toLowerCase())
      .maybeSingle()

    if (data) {
      setProfile(data as Profile)
    } else if (error?.code !== "PGRST116") {
      console.log("[v0] Profile load error:", error)
    } else {
      // Profile doesn't exist yet, create it
      const newProfile: Partial<Profile> = {
        id: walletAddress.toLowerCase(),
        display_name: walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4),
        handle: "outlaw_" + walletAddress.slice(2, 10),
        coins: 0,
        balance_cents: 0,
        onboarded: false,
      }
      const { data: created } = await supabase.from("profiles").insert(newProfile).select("*").maybeSingle()
      if (created) {
        setProfile(created as Profile)
      }
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (wallet) await loadProfile(wallet)
  }, [wallet, loadProfile])

  // Load wallet from storage on mount
  useEffect(() => {
    const initWallet = async () => {
      const stored = await AsyncStorage.getItem(WALLET_KEY)
      if (stored) {
        setWallet(stored)
        await loadProfile(stored)
      }
      setLoading(false)
    }

    initWallet()
  }, [loadProfile])

  const connectWallet = useCallback(async () => {
    try {
      // In production, this would use WalletConnect or a mobile wallet connector
      // For now, we'll use a placeholder that demonstrates the flow
      // You would integrate with MetaMask mobile, Rainbow, etc.
      console.log("[v0] Wallet connection triggered")
      return { error: "Wallet connector not yet implemented. Use placeholder for testing." }
    } catch (e: any) {
      return { error: e?.message ?? "Failed to connect wallet" }
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    await AsyncStorage.removeItem(WALLET_KEY)
    setWallet(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!wallet) return { error: "Not connected to wallet." }
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", wallet.toLowerCase())
        .select("*")
        .maybeSingle()

      if (!error && data) {
        setProfile(data as Profile)
      }
      return { error: error?.message }
    },
    [wallet],
  )

  const isLord = profile?.fate === "lord"

  return (
    <AuthContext.Provider
      value={{
        wallet,
        profile,
        loading,
        isLord,
        connectWallet,
        disconnectWallet,
        refreshProfile,
        updateProfile,
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
