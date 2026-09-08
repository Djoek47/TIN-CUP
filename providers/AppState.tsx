import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { connectMockWallet } from "@/lib/mock-wallet"
import { MONEY_FAIL, moneyMode, TEST_BADGE, TESTNET_BADGE } from "@/lib/money"
import {
  AppUser,
  Balance,
  Caste,
  LedgerEntry,
  Prefs,
  SEED_BALANCE,
  SEED_LEDGER,
  ThemeMode,
} from "@/lib/vessel-types"
import { VesselThemeProvider } from "@/providers/VesselTheme"

const KEY = "tincup_vessel_v1"

type Toast = { id: number; text: string } | null

type AppCtx = {
  ready: boolean
  caste: Caste
  theme: ThemeMode
  user: AppUser
  balance: Balance
  ledger: LedgerEntry[]
  prefs: Prefs
  toast: Toast
  moneyBadge: string
  isMock: boolean
  say: (text: string) => void
  connect: (method?: string) => Promise<void>
  disconnect: () => Promise<void>
  setTheme: (t: ThemeMode) => void
  setPrefs: (p: Partial<Prefs>) => void
  updateUser: (p: Partial<AppUser>) => void
  chooseVagrant: () => Promise<void>
  ascendLord: () => Promise<void>
  gift: (to: string, amount: number, message?: string) => Promise<void>
  cashOut: (amount: number) => Promise<void>
  addFundsMock: (amount: number) => Promise<void>
}

const defaultUser: AppUser = {
  handle: "maverick",
  displayName: "Maverick",
  bio: "I don't follow trends, I start them.",
  location: "Toronto, CA",
  link: "tincup.app/maverick",
  adult: false,
  address: null,
}

const defaultPrefs: Prefs = {
  nGifts: true,
  nLive: true,
  nCourt: false,
  priv: false,
  hideAmt: false,
}

const Ctx = createContext<AppCtx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [caste, setCaste] = useState<Caste>("vagrant")
  const [theme, setThemeState] = useState<ThemeMode>("dark")
  const [user, setUser] = useState<AppUser>(defaultUser)
  const [balance, setBalance] = useState<Balance>(SEED_BALANCE)
  const [ledger, setLedger] = useState<LedgerEntry[]>(SEED_LEDGER)
  const [prefs, setPrefsState] = useState<Prefs>(defaultPrefs)
  const [toast, setToast] = useState<Toast>(null)

  const isMock = moneyMode() === "mock"
  const moneyBadge = isMock ? TEST_BADGE : TESTNET_BADGE

  const persist = useCallback(
    async (patch: Partial<{ caste: Caste; theme: ThemeMode; user: AppUser; balance: Balance; ledger: LedgerEntry[]; prefs: Prefs }>) => {
      const next = {
        caste: patch.caste ?? caste,
        theme: patch.theme ?? theme,
        user: patch.user ?? user,
        balance: patch.balance ?? balance,
        ledger: patch.ledger ?? ledger,
        prefs: patch.prefs ?? prefs,
      }
      await AsyncStorage.setItem(KEY, JSON.stringify(next))
    },
    [caste, theme, user, balance, ledger, prefs],
  )

  useEffect(() => {
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY)
        if (raw) {
          const data = JSON.parse(raw)
          if (data.caste === "lord" || data.caste === "vagrant") setCaste(data.caste)
          if (data.theme === "light" || data.theme === "dark") setThemeState(data.theme)
          if (data.user) setUser({ ...defaultUser, ...data.user })
          if (data.balance) setBalance({ ...SEED_BALANCE, ...data.balance })
          if (Array.isArray(data.ledger)) setLedger(data.ledger)
          if (data.prefs) setPrefsState({ ...defaultPrefs, ...data.prefs })
        }
      } finally {
        setReady(true)
      }
    })()
  }, [])

  const say = useCallback((text: string) => {
    const id = Date.now()
    setToast({ id, text })
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2000)
  }, [])

  const connect = useCallback(
    async (_method?: string) => {
      const acc = await connectMockWallet()
      const nextUser = { ...user, address: acc.address, handle: user.handle || `outlaw_${acc.address.slice(2, 8)}` }
      setUser(nextUser)
      await persist({ user: nextUser })
      say(_method ? `Connected via ${_method}` : "Wallet ready")
    },
    [persist, say, user],
  )

  const disconnect = useCallback(async () => {
    const nextUser = { ...defaultUser, address: null }
    setUser(nextUser)
    setCaste("vagrant")
    await AsyncStorage.removeItem(KEY)
    say("Signed out")
  }, [say])

  const setTheme = useCallback(
    (t: ThemeMode) => {
      setThemeState(t)
      persist({ theme: t })
    },
    [persist],
  )

  const setPrefs = useCallback(
    (p: Partial<Prefs>) => {
      setPrefsState((prev) => {
        const next = { ...prev, ...p }
        persist({ prefs: next })
        return next
      })
    },
    [persist],
  )

  const updateUser = useCallback(
    (p: Partial<AppUser>) => {
      setUser((prev) => {
        const next = { ...prev, ...p }
        persist({ user: next })
        return next
      })
    },
    [persist],
  )

  const chooseVagrant = useCallback(async () => {
    if (caste === "lord") {
      say("Lords never fall")
      return
    }
    setCaste("vagrant")
    await persist({ caste: "vagrant" })
    say("Welcome, Vagrant")
  }, [caste, persist, say])

  const ascendLord = useCallback(async () => {
    if (caste === "lord") {
      say("Already a Lord")
      return
    }
    if (balance.available < 100) {
      say(MONEY_FAIL)
      throw new Error(MONEY_FAIL)
    }
    const nextBal: Balance = {
      ...balance,
      available: +(balance.available - 100).toFixed(2),
      total: +(balance.total - 100).toFixed(2),
    }
    const entry: LedgerEntry = {
      id: `asc-${Date.now()}`,
      dir: "out",
      who: "Lord ascension",
      amount: 100,
      kind: "ascend",
      ts: Date.now(),
    }
    const nextLedger = [entry, ...ledger]
    setBalance(nextBal)
    setLedger(nextLedger)
    setCaste("lord")
    await persist({ caste: "lord", balance: nextBal, ledger: nextLedger })
    say("You are now a Lord")
  }, [balance, caste, ledger, persist, say])

  const gift = useCallback(
    async (to: string, amount: number, _message?: string) => {
      if (amount <= 0 || amount > balance.available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }
      const nextBal: Balance = {
        ...balance,
        available: +(balance.available - amount).toFixed(2),
        total: +(balance.total - amount).toFixed(2),
      }
      const entry: LedgerEntry = {
        id: `g-${Date.now()}`,
        dir: "out",
        who: to,
        amount,
        kind: "gift",
        ts: Date.now(),
      }
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      say(`Poured $${amount} to ${to}`)
    },
    [balance, ledger, persist, say],
  )

  const cashOut = useCallback(
    async (amount: number) => {
      if (caste === "lord") {
        say("Lords put in. Nothing comes out.")
        throw new Error("Lords cannot cash out")
      }
      if (amount <= 0 || amount > balance.available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }
      const nextBal: Balance = {
        ...balance,
        available: +(balance.available - amount).toFixed(2),
        total: +(balance.total - amount).toFixed(2),
      }
      const entry: LedgerEntry = {
        id: `c-${Date.now()}`,
        dir: "out",
        who: "Cash out to bank",
        amount,
        kind: "cash",
        ts: Date.now(),
      }
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      say(`Cash out $${amount} queued`)
    },
    [balance, caste, ledger, persist, say],
  )

  const addFundsMock = useCallback(
    async (amount: number) => {
      const nextBal: Balance = {
        ...balance,
        available: +(balance.available + amount).toFixed(2),
        total: +(balance.total + amount).toFixed(2),
      }
      setBalance(nextBal)
      await persist({ balance: nextBal })
      say(`Added $${amount} (test)`)
    },
    [balance, persist, say],
  )

  const value = useMemo(
    () => ({
      ready,
      caste,
      theme,
      user,
      balance,
      ledger,
      prefs,
      toast,
      moneyBadge,
      isMock,
      say,
      connect,
      disconnect,
      setTheme,
      setPrefs,
      updateUser,
      chooseVagrant,
      ascendLord,
      gift,
      cashOut,
      addFundsMock,
    }),
    [
      ready,
      caste,
      theme,
      user,
      balance,
      ledger,
      prefs,
      toast,
      moneyBadge,
      isMock,
      say,
      connect,
      disconnect,
      setTheme,
      setPrefs,
      updateUser,
      chooseVagrant,
      ascendLord,
      gift,
      cashOut,
      addFundsMock,
    ],
  )

  return (
    <Ctx.Provider value={value}>
      <VesselThemeProvider caste={caste} theme={theme}>
        {children}
      </VesselThemeProvider>
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within AppStateProvider")
  return ctx
}
