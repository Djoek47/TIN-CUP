import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { Platform } from "react-native"
import { ethers } from "ethers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { supabase } from "@/lib/supabase"
import { RPC_URL } from "@/lib/thirdweb"
import { Profile } from "@/lib/types"

const WALLET_KEY = "tincup_wallet_address"
const DEMO_PK_KEY = "tincup_demo_private_key"

interface AuthState {
  wallet: string | null
  provider: ethers.providers.JsonRpcProvider | null
  signer: ethers.Signer | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  session: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (patch: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)

  // Initialize provider and restore wallet from storage on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Set up read-only provider for Polygon Mumbai testnet
        const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)
        setProvider(rpcProvider)

        // Restore wallet from storage if available
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
  }, [])

  const loadProfile = useCallback(async (walletAddress: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", walletAddress.toLowerCase())
        .maybeSingle()

      if (data) {
        setProfile(data as Profile)
      } else if (!error) {
        // Profile doesn't exist yet - will be created after wallet connect
        setProfile(null)
      }
    } catch (e) {
      console.log("[v0] Load profile error:", e)
    }
  }, [])

  const ensureProfile = useCallback(async (address: string) => {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", address)
      .maybeSingle()

    if (!existingProfile) {
      const handle = `outlaw_${address.slice(2, 10)}`
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          id: address,
          handle,
          display_name: address.slice(0, 6),
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
        setProfile(newProfile as Profile)
      }
    } else {
      setProfile(existingProfile as Profile)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      const ethereum =
        Platform.OS === "web" && typeof window !== "undefined"
          ? (window as any).ethereum
          : null

      // Web: MetaMask / injected wallet when available
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        const address = accounts[0].toLowerCase()
        const web3Provider = new ethers.providers.Web3Provider(ethereum)
        const walletSigner = web3Provider.getSigner()

        setWallet(address)
        setSigner(walletSigner)
        setProvider(web3Provider)
        await AsyncStorage.setItem(WALLET_KEY, address)
        await ensureProfile(address)
        return
      }

      // iPhone / Android (Expo Go): local demo wallet so testing works without MetaMask
      const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)
      let privateKey: string | null = null
      try {
        privateKey = await SecureStore.getItemAsync(DEMO_PK_KEY)
      } catch {
        privateKey = await AsyncStorage.getItem(DEMO_PK_KEY)
      }

      let demoWallet: ethers.Wallet
      if (privateKey) {
        demoWallet = new ethers.Wallet(privateKey, rpcProvider)
      } else {
        demoWallet = ethers.Wallet.createRandom().connect(rpcProvider)
        try {
          await SecureStore.setItemAsync(DEMO_PK_KEY, demoWallet.privateKey)
        } catch {
          await AsyncStorage.setItem(DEMO_PK_KEY, demoWallet.privateKey)
        }
      }

      const address = demoWallet.address.toLowerCase()
      setWallet(address)
      setSigner(demoWallet)
      setProvider(rpcProvider)
      await AsyncStorage.setItem(WALLET_KEY, address)
      await ensureProfile(address)
    } catch (e: any) {
      console.log("[v0] Wallet connect error:", e)
      throw e
    }
  }, [ensureProfile])

  const disconnectWallet = useCallback(async () => {
    setWallet(null)
    setSigner(null)
    setProfile(null)
    await AsyncStorage.removeItem(WALLET_KEY)
  }, [])

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!wallet) throw new Error("Not connected to wallet")

      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", wallet)
        .select()
        .single()

      if (error) throw error
      if (data) setProfile(data as Profile)
    },
    [wallet]
  )

  const refreshProfile = useCallback(async () => {
    if (wallet) await loadProfile(wallet)
  }, [wallet, loadProfile])

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
