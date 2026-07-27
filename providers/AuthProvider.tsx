import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Crypto from "expo-crypto"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/lib/types"
import {
  connectInAppGuest,
  isThirdwebConfigured,
  MONEY_FAIL_COPY,
  sendUsdt,
  stakeLordBuyIn,
  type WalletAccount,
} from "@/lib/thirdweb"

const WALLET_KEY = "tincup_wallet_address"
const DEMO_ADDR_KEY = "tincup_demo_address"

interface AuthState {
  wallet: string | null
  account: WalletAccount | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  session: boolean
  thirdwebReady: boolean
  connectWallet: () => Promise<Profile | null>
  disconnectWallet: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (patch: Partial<Profile>) => Promise<void>
  giftUsdt: (recipient: string, cents: number) => Promise<string>
  ascendLord: () => Promise<string>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

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
    display_name: "Dusty Pete",
    fate: "drifter",
    hat: "stetson",
    face: "🤠",
    accent: "gold",
    coins: 1240,
    balance_cents: 124000,
    is_lord: false,
    onboarded: false,
    created_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWalletState] = useState<string | null>(null)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)
  const walletRef = useRef<string | null>(null)
  const accountRef = useRef<WalletAccount | null>(null)

  const setWallet = useCallback((address: string | null) => {
    walletRef.current = address
    setWalletState(address)
  }, [])

  const loadProfile = useCallback(async (walletAddress: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", walletAddress.toLowerCase())
        .maybeSingle()

      if (data) setProfile(data as Profile)
      else setProfile(localProfile(walletAddress))
      if (error) console.log("[v0] profile fetch:", error.message)
    } catch (e) {
      console.log("[v0] Load profile error:", e)
      setProfile(localProfile(walletAddress))
    }
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
  }, [setWallet, loadProfile])

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
          coins: stub.coins,
          balance_cents: stub.balance_cents,
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

      setProfile(stub)
      return stub
    } catch {
      const stub = localProfile(address)
      setProfile(stub)
      return stub
    }
  }, [])

  const connectWallet = useCallback(async (): Promise<Profile | null> => {
    if (isThirdwebConfigured) {
      try {
        const acc = await connectInAppGuest()
        const address = acc.address.toLowerCase()
        accountRef.current = acc
        setAccount(acc)
        setWallet(address)
        await AsyncStorage.setItem(WALLET_KEY, address)
        return ensureProfile(address)
      } catch (e) {
        console.log("[v0] Thirdweb connect failed, demo fallback:", e)
      }
    }

    let address = await AsyncStorage.getItem(DEMO_ADDR_KEY)
    if (!address) {
      address = await createDemoAddress()
      await AsyncStorage.setItem(DEMO_ADDR_KEY, address)
    }
    address = address.toLowerCase()
    accountRef.current = null
    setAccount(null)
    setWallet(address)
    await AsyncStorage.setItem(WALLET_KEY, address)
    return ensureProfile(address)
  }, [ensureProfile, setWallet])

  const disconnectWallet = useCallback(async () => {
    setWallet(null)
    setAccount(null)
    accountRef.current = null
    setProfile(null)
    await AsyncStorage.removeItem(WALLET_KEY)
  }, [setWallet])

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

  const giftUsdt = useCallback(
    async (recipient: string, cents: number) => {
      const acc = accountRef.current
      if (!acc || !isThirdwebConfigured) {
        const bal = profile?.balance_cents ?? 0
        if (bal < cents) throw new Error(MONEY_FAIL_COPY)
        await updateProfile({
          balance_cents: bal - cents,
          coins: (profile?.coins ?? 0) + Math.floor(cents / 100),
        })
        return `demo-gift-${Date.now()}`
      }
      try {
        return await sendUsdt(acc, recipient, cents)
      } catch (e) {
        console.log("[v0] giftUsdt failed:", e)
        throw new Error(MONEY_FAIL_COPY)
      }
    },
    [profile, updateProfile],
  )

  const ascendLord = useCallback(async () => {
    const acc = accountRef.current
    if (!acc || !isThirdwebConfigured) {
      await updateProfile({ is_lord: true, fate: "lord" })
      return `demo-lord-${Date.now()}`
    }
    try {
      const hash = await stakeLordBuyIn(acc)
      await updateProfile({ is_lord: true, fate: "lord" })
      return hash
    } catch (e) {
      console.log("[v0] ascendLord failed:", e)
      throw new Error(MONEY_FAIL_COPY)
    }
  }, [updateProfile])

  return (
    <AuthContext.Provider
      value={{
        wallet,
        account,
        profile,
        loading,
        configured,
        session: !!wallet,
        thirdwebReady: isThirdwebConfigured,
        connectWallet,
        disconnectWallet,
        refreshProfile,
        updateProfile,
        giftUsdt,
        ascendLord,
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

export { MONEY_FAIL_COPY }
