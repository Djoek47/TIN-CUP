import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Crypto from "expo-crypto"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/types"

const WALLET_KEY = "tincup_wallet_address"
const DEMO_ADDR_KEY = "tincup_demo_address"

interface AuthState {
  wallet: string | null
  provider: unknown
  signer: unknown
  profile: Profile | null
  loading: boolean
  configured: boolean
  session: boolean
  connectWallet: () => Promise<Profile | null>
  disconnectWallet: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (patch: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

/** Expo Go–safe random 0x address — uses expo-crypto, never ethers. */
async function createDemoAddress(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(20)
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `0x${hex}`.toLowerCase()
}

function localProfile(address: string): Profile {
  return {
    id: address,
    handle: `outlaw_${address.slice(2, 10)}`,
    display_name: address.slice(0, 6),
    fate: "drifter",
    hat: "stetson",
    face: "🤠",
    accent: "gold",
    coins: 0,
    balance_cents: 0,
    is_lord: false,
    onboarded: false,
    created_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWalletState] = useState<string | null>(null)
  const [provider, setProvider] = useState<unknown>(null)
  const [signer, setSigner] = useState<unknown>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)
  const walletRef = useRef<string | null>(null)

  const setWallet = useCallback((address: string | null) => {
    walletRef.current = address
    setWalletState(address)
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const storedWallet = await AsyncStorage.getItem(WALLET_KEY)
        if (storedWallet) {
          setWallet(storedWallet.toLowerCase())
          await loadProfile(storedWallet.toLowerCase())
        }
      } catch (e) {
        console.log("[v0] Auth init error:", e)
      } finally {
        setConfigured(true)
        setLoading(false)
      }
    }

    init()
  }, [setWallet])

  const loadProfile = useCallback(async (walletAddress: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", walletAddress.toLowerCase())
        .maybeSingle()

      if (data) {
        setProfile(data as Profile)
      } else if (error) {
        setProfile(localProfile(walletAddress))
      } else {
        setProfile(null)
      }
    } catch (e) {
      console.log("[v0] Load profile error:", e)
      setProfile(localProfile(walletAddress))
    }
  }, [])

  const ensureProfile = useCallback(async (address: string): Promise<Profile> => {
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", address)
        .maybeSingle()

      if (existingProfile) {
        const p = existingProfile as Profile
        setProfile(p)
        return p
      }

      const stub = localProfile(address)
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          id: address,
          handle: stub.handle,
          display_name: stub.display_name,
          fate: "drifter",
          hat: "stetson",
          face: "🤠",
          accent: "gold",
          coins: 0,
          balance_cents: 0,
          is_lord: false,
          onboarded: false,
        })
        .select()
        .single()

      if (!error && newProfile) {
        const p = newProfile as Profile
        setProfile(p)
        return p
      }

      console.log("[v0] Profile insert skipped, using local stub:", error?.message)
      setProfile(stub)
      return stub
    } catch (e) {
      console.log("[v0] ensureProfile error:", e)
      const stub = localProfile(address)
      setProfile(stub)
      return stub
    }
  }, [])

  const connectDemoWallet = useCallback(async (): Promise<Profile> => {
    let address = await AsyncStorage.getItem(DEMO_ADDR_KEY)
    if (!address) {
      address = await createDemoAddress()
      await AsyncStorage.setItem(DEMO_ADDR_KEY, address)
    }
    address = address.toLowerCase()

    setWallet(address)
    setSigner(null)
    setProvider(null)
    await AsyncStorage.setItem(WALLET_KEY, address)
    return ensureProfile(address)
  }, [ensureProfile])

  const connectWallet = useCallback(async (): Promise<Profile | null> => {
    // Mobile (Expo Go): always local demo seat — no Chrome / MetaMask / ethers random
    if (Platform.OS !== "web") {
      return connectDemoWallet()
    }

    try {
      const ethereum = typeof window !== "undefined" ? (window as any).ethereum : null
      if (ethereum) {
        try {
          const { ethers } = await import("ethers")
          const accounts = await ethereum.request({ method: "eth_requestAccounts" })
          const address = accounts[0].toLowerCase()
          const web3Provider = new ethers.providers.Web3Provider(ethereum)
          setWallet(address)
          setSigner(web3Provider.getSigner())
          setProvider(web3Provider)
          await AsyncStorage.setItem(WALLET_KEY, address)
          return ensureProfile(address)
        } catch (e) {
          console.log("[v0] MetaMask failed, falling back to demo wallet:", e)
        }
      }
      return await connectDemoWallet()
    } catch (e) {
      console.log("[v0] Wallet connect error:", e)
      return await connectDemoWallet()
    }
  }, [connectDemoWallet, ensureProfile])

  const disconnectWallet = useCallback(async () => {
    setWallet(null)
    setSigner(null)
    setProvider(null)
    setProfile(null)
    await AsyncStorage.removeItem(WALLET_KEY)
  }, [])

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    const address = walletRef.current
    if (!address) throw new Error("Not connected to wallet")

    setProfile((prev) => {
      if (prev) return { ...prev, ...patch } as Profile
      return { ...localProfile(address), ...patch } as Profile
    })

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", address)
        .select()
        .single()

      if (!error && data) setProfile(data as Profile)
    } catch (e) {
      console.log("[v0] updateProfile sync error (kept local):", e)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const address = walletRef.current
    if (address) await loadProfile(address)
  }, [loadProfile])

  return (
    <AuthContext.Provider
      value={{
        wallet,
        provider,
        signer,
        profile,
        loading,
        configured,
        session: !!wallet,
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
