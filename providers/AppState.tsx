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
import { MONEY_FAIL, moneyBadgeFor, moneyMode } from "@/lib/money"
import {
  fiatToGoldMg,
  goldMgToFiat,
  LORD_FEE_FIAT,
  xauSpot,
  FiatCurrency,
} from "@/lib/gold"
import {
  DEMO_ACCOUNTS,
  DemoRole,
  demoBalance,
  demoLedger,
  isDemoAddress,
} from "@/lib/demo-accounts"
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
import {
  creditPeerBalance,
  fetchRemoteLedger,
  insertGiftRow,
  insertLedger,
  insertNotification,
  upsertProfile,
} from "@/lib/sync"
import { getAuthUser, getSession, onAuthStateChange, signOutAuth } from "@/lib/auth"
import {
  fetchProfileBalance,
  requestCashOutPayout,
  rpcHoldGold,
  rpcSendGoldGift,
} from "@/lib/money-api"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const KEY = "obol_vessel_v1"

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
  moneyMode: ReturnType<typeof moneyMode>
  say: (text: string) => void
  connect: (method?: string) => Promise<void>
  /** Load a fixed Supabase-seeded mock identity (vagrant or lord). */
  connectDemo: (role: DemoRole) => Promise<void>
  /** Hydrate AppState from Supabase Auth session + profiles row. */
  hydrateFromAuth: () => Promise<void>
  /** Pull gold_mg + ledger from server when authenticated. */
  refreshFromServer: () => Promise<void>
  disconnect: () => Promise<void>
  setTheme: (t: ThemeMode) => void
  setPrefs: (p: Partial<Prefs>) => void
  updateUser: (p: Partial<AppUser>) => void
  chooseVagrant: () => Promise<void>
  ascendLord: () => Promise<void>
  gift: (to: string, amountFiat: number, message?: string) => Promise<void>
  cashOut: (amountFiat: number) => Promise<void>
  addFundsMock: (amountFiat: number) => Promise<void>
  deposit: (
    amountFiat: number,
    currency?: FiatCurrency,
    opts?: { paymentIntentId?: string; awaitServerMint?: boolean },
  ) => Promise<void>
  /** Vagrant enters a challenge (mock entry stake). */
  enterChallenge: (title: string, entryFiat?: number) => Promise<void>
  /** Lord funds a bounty (mock escrow out). */
  fundBounty: (title: string, amountFiat: number) => Promise<void>
  demoRole: DemoRole | null
  /** Supabase auth user id when signed in via Apple/Google/email. */
  authUserId: string | null
}

const defaultUser: AppUser = {
  handle: "guest",
  displayName: "Guest",
  bio: "A coin for the crossing.",
  location: "",
  link: "obol.app",
  adult: false,
  address: null,
}

const defaultPrefs: Prefs = {
  nGifts: true,
  nLive: true,
  nCourt: false,
  priv: false,
  hideAmt: false,
  currency: "USD",
  massUnit: "g",
}

function withFiatMirrors(b: Omit<Balance, "total" | "available" | "hold" | "coinDust"> & { coinDust?: number }): Balance {
  const cur = b.displayCurrency
  return {
    ...b,
    coinDust: b.coinDust ?? 0,
    available: goldMgToFiat(b.gold_mg_available, cur),
    hold: goldMgToFiat(b.gold_mg_hold, cur),
    total: goldMgToFiat(b.gold_mg_total, cur),
  }
}

function migrateBalance(raw: Partial<Balance> | undefined): Balance {
  if (!raw) return SEED_BALANCE
  if (typeof raw.gold_mg_total === "number") {
    return withFiatMirrors({
      gold_mg_total: raw.gold_mg_total,
      gold_mg_available: raw.gold_mg_available ?? 0,
      gold_mg_hold: raw.gold_mg_hold ?? 0,
      hidden: !!raw.hidden,
      displayCurrency: raw.displayCurrency ?? "USD",
      massUnit: raw.massUnit ?? "g",
      coinDust: raw.coinDust,
    })
  }
  // Legacy USD-only seed
  const avail = Number(raw.available ?? SEED_BALANCE.available)
  const hold = Number(raw.hold ?? SEED_BALANCE.hold)
  const total = Number(raw.total ?? avail + hold)
  return withFiatMirrors({
    gold_mg_available: fiatToGoldMg(avail, "USD"),
    gold_mg_hold: fiatToGoldMg(hold, "USD"),
    gold_mg_total: fiatToGoldMg(total, "USD"),
    hidden: !!raw.hidden,
    displayCurrency: "USD",
    massUnit: "g",
    coinDust: raw.coinDust,
  })
}

function migrateLedger(raw: unknown): LedgerEntry[] {
  if (!Array.isArray(raw)) return SEED_LEDGER
  return raw.map((e: any, i) => {
    if (typeof e.gold_mg === "number") return e as LedgerEntry
    const amount = Number(e.amount ?? 0)
    return {
      id: String(e.id ?? i),
      dir: e.dir === "out" ? "out" : "in",
      who: String(e.who ?? "unknown"),
      gold_mg: fiatToGoldMg(amount, "USD"),
      fiat_cents: Math.round(amount * 100),
      currency: "USD" as FiatCurrency,
      xau_rate: xauSpot("USD"),
      rail: "mock" as const,
      escrow_status: e.dir === "out" ? "spent" : "held",
      kind: e.kind ?? "other",
      ts: Number(e.ts ?? Date.now()),
      amount,
    } satisfies LedgerEntry
  })
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
  const [authUserId, setAuthUserId] = useState<string | null>(null)

  const mode = moneyMode()
  const isMock = mode === "mock"
  const moneyBadge = moneyBadgeFor(mode)

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
          if (data.balance) setBalance(migrateBalance(data.balance))
          if (data.ledger) setLedger(migrateLedger(data.ledger))
          if (data.prefs) setPrefsState({ ...defaultPrefs, ...data.prefs })
        }
        const session = await getSession()
        if (session?.user?.id) setAuthUserId(session.user.id)
      } finally {
        setReady(true)
      }
    })()
    const { data } = onAuthStateChange((session) => {
      setAuthUserId(session?.user?.id ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const say = useCallback((text: string) => {
    const id = Date.now()
    setToast({ id, text })
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2000)
  }, [])

  const connect = useCallback(
    async (_method?: string) => {
      const acc = await connectMockWallet()
      const nextUser = {
        ...user,
        address: acc.address,
        handle: user.handle || `outlaw_${acc.address.slice(2, 8)}`,
      }
      setUser(nextUser)
      await persist({ user: nextUser })
      await upsertProfile({ address: acc.address, user: nextUser, caste, balance })
      say(_method ? `Connected via ${_method}` : "Wallet ready")
    },
    [balance, caste, persist, say, user],
  )

  const connectDemo = useCallback(
    async (role: DemoRole) => {
      const demo = DEMO_ACCOUNTS[role]
      const nextUser = { ...demo.user }
      const nextBal = demoBalance(role)
      const nextLedger = demoLedger(role)
      const nextPrefs = { ...defaultPrefs, currency: demo.seedFiat.currency }
      setUser(nextUser)
      setCaste(demo.caste)
      setBalance(nextBal)
      setLedger(nextLedger)
      setPrefsState(nextPrefs)
      await AsyncStorage.setItem(
        KEY,
        JSON.stringify({
          caste: demo.caste,
          theme,
          user: nextUser,
          balance: nextBal,
          ledger: nextLedger,
          prefs: nextPrefs,
        }),
      )
      await upsertProfile({
        address: demo.address,
        user: nextUser,
        caste: demo.caste,
        balance: nextBal,
      })
      await insertNotification({
        address: demo.address,
        kind: "system",
        title: `Signed in as ${demo.label}`,
        body: "Gold balance ready",
      })
      say(`Entered as ${demo.label}`)
    },
    [say, theme],
  )

  const refreshFromServer = useCallback(async () => {
    const uid = authUserId || user.address
    if (!uid) return
    const remote = await fetchProfileBalance(uid)
    if (remote) {
      setBalance(remote)
      await persist({ balance: remote })
    }
    const remoteLedger = await fetchRemoteLedger(uid)
    if (remoteLedger?.length) {
      setLedger(remoteLedger)
      await persist({ ledger: remoteLedger, balance: remote ?? balance })
    }
  }, [authUserId, balance, persist, user.address])

  const hydrateFromAuth = useCallback(async () => {
    const authUser = await getAuthUser()
    if (!authUser) {
      say("No auth session")
      return
    }
    setAuthUserId(authUser.id)
    const meta = authUser.user_metadata || {}
    const handleGuess =
      String(meta.preferred_username || meta.user_name || meta.full_name || "")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 16) || `user_${authUser.id.slice(0, 6)}`
    let profile: any = null
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle()
      profile = data
      if (!profile) {
        await supabase.from("profiles").upsert({
          id: authUser.id,
          handle: handleGuess,
          display_name: meta.full_name || meta.name || handleGuess,
          fate: "vagrant",
          is_lord: false,
          onboarded: false,
          auth_user_id: authUser.id,
          updated_at: new Date().toISOString(),
        })
        const again = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle()
        profile = again.data
      }
    }
    const nextUser: AppUser = {
      handle: profile?.handle || handleGuess,
      displayName: profile?.display_name || meta.full_name || handleGuess,
      bio: profile?.bio || defaultUser.bio,
      location: "",
      link: "obol.app",
      adult: false,
      address: authUser.id,
    }
    const nextCaste: Caste = profile?.is_lord || profile?.fate === "lord" ? "lord" : "vagrant"
    const nextBal =
      (await fetchProfileBalance(authUser.id)) ||
      withFiatMirrors({
        gold_mg_available: Number(profile?.gold_mg_available || 0),
        gold_mg_hold: Number(profile?.gold_mg_hold || 0),
        gold_mg_total: Number(profile?.gold_mg_total || 0),
        hidden: false,
        displayCurrency: (profile?.display_currency as FiatCurrency) || "USD",
        massUnit: (profile?.mass_unit as Balance["massUnit"]) || "g",
      })
    setUser(nextUser)
    setCaste(nextCaste)
    setBalance(nextBal)
    await persist({ user: nextUser, caste: nextCaste, balance: nextBal })
    say("Signed in")
  }, [persist, say])

  const disconnect = useCallback(async () => {
    await signOutAuth()
    setAuthUserId(null)
    const nextUser = { ...defaultUser, address: null }
    setUser(nextUser)
    setCaste("vagrant")
    setBalance(SEED_BALANCE)
    setLedger(SEED_LEDGER)
    setPrefsState(defaultPrefs)
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
        let nextBal = balance
        if (p.currency && p.currency !== prev.currency) {
          nextBal = withFiatMirrors({ ...balance, displayCurrency: p.currency })
          setBalance(nextBal)
        }
        if (p.massUnit && p.massUnit !== prev.massUnit) {
          nextBal = withFiatMirrors({ ...balance, massUnit: p.massUnit, displayCurrency: next.currency })
          setBalance(nextBal)
        }
        persist({ prefs: next, balance: nextBal })
        return next
      })
    },
    [balance, persist],
  )

  const updateUser = useCallback(
    (p: Partial<AppUser>) => {
      setUser((prev) => {
        const next = { ...prev, ...p }
        persist({ user: next })
        if (next.address) {
          void upsertProfile({ address: next.address, user: next, caste, balance })
        }
        return next
      })
    },
    [balance, caste, persist],
  )

  const chooseVagrant = useCallback(async () => {
    if (caste === "lord") {
      say("Lords never fall")
      return
    }
    setCaste("vagrant")
    await persist({ caste: "vagrant" })
    if (user.address) {
      await upsertProfile({ address: user.address, user, caste: "vagrant", balance })
    }
    say("Welcome, Vagrant")
  }, [balance, caste, persist, say, user])

  const makeEntry = useCallback(
    (
      partial: Omit<LedgerEntry, "currency" | "xau_rate" | "rail" | "fiat_cents" | "amount"> & {
        fiatAmount: number
      },
    ): LedgerEntry => {
      const currency = prefs.currency
      const fiatAmount = partial.fiatAmount
      return {
        id: partial.id,
        dir: partial.dir,
        who: partial.who,
        gold_mg: partial.gold_mg,
        fiat_cents: Math.round(fiatAmount * 100),
        currency,
        xau_rate: xauSpot(currency),
        rail: mode,
        escrow_status: partial.escrow_status,
        kind: partial.kind,
        ts: partial.ts,
        amount: fiatAmount,
      }
    },
    [mode, prefs.currency],
  )

  const ascendLord = useCallback(async () => {
    if (caste === "lord") {
      say("Already a Lord")
      return
    }
    const feeMg = fiatToGoldMg(LORD_FEE_FIAT, prefs.currency)
    if (balance.gold_mg_available < feeMg) {
      say(MONEY_FAIL)
      throw new Error(MONEY_FAIL)
    }
    const nextBal = withFiatMirrors({
      ...balance,
      gold_mg_available: balance.gold_mg_available - feeMg,
      gold_mg_total: balance.gold_mg_total - feeMg,
    })
    const entry = makeEntry({
      id: `asc-${Date.now()}`,
      dir: "out",
      who: "Lord ascension",
      gold_mg: feeMg,
      fiatAmount: LORD_FEE_FIAT,
      kind: "ascend",
      escrow_status: "spent",
      ts: Date.now(),
    })
    const nextLedger = [entry, ...ledger]
    setBalance(nextBal)
    setLedger(nextLedger)
    setCaste("lord")
    await persist({ caste: "lord", balance: nextBal, ledger: nextLedger })
    if (user.address) {
      await upsertProfile({ address: user.address, user, caste: "lord", balance: nextBal })
      await insertLedger(entry, user.address)
      await insertNotification({
        address: user.address,
        kind: "system",
        title: "You are a Lord",
        body: "Ascension complete",
      })
    }
    say("You are now a Lord")
  }, [balance, caste, ledger, makeEntry, persist, prefs.currency, say, user])

  const gift = useCallback(
    async (to: string, amountFiat: number, message?: string) => {
      const mg = fiatToGoldMg(amountFiat, prefs.currency)
      if (amountFiat <= 0 || mg > balance.gold_mg_available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }

      // Authenticated path: server dual-entry transfer
      if (authUserId) {
        try {
          await rpcSendGoldGift({
            toHandle: to,
            amountFiat,
            currency: prefs.currency,
            message,
          })
          await refreshFromServer()
          say(`Poured to ${to}`)
          return
        } catch (e) {
          console.warn("[gift] rpc failed, falling back to local dual-entry", e)
        }
      }

      const nextBal = withFiatMirrors({
        ...balance,
        gold_mg_available: balance.gold_mg_available - mg,
        gold_mg_total: balance.gold_mg_total - mg,
      })
      const entry = makeEntry({
        id: `g-${Date.now()}`,
        dir: "out",
        who: to,
        gold_mg: mg,
        fiatAmount: amountFiat,
        kind: "gift",
        escrow_status: "spent",
        ts: Date.now(),
      })
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      if (user.address) {
        await upsertProfile({ address: user.address, user, caste, balance: nextBal })
        await insertLedger(entry, user.address)
        await insertNotification({
          address: user.address,
          kind: "gift",
          title: "Gold poured",
          body: `${amountFiat} ${prefs.currency} → ${to}`,
        })
        const handle = to.replace(/^@/, "").toLowerCase()
        const peer =
          handle === DEMO_ACCOUNTS.vagrant.user.handle
            ? DEMO_ACCOUNTS.vagrant
            : handle === DEMO_ACCOUNTS.lord.user.handle
              ? DEMO_ACCOUNTS.lord
              : null
        if (peer && peer.address.toLowerCase() !== user.address.toLowerCase()) {
          await creditPeerBalance({
            peerAddress: peer.address,
            goldMg: mg,
            fiatCents: Math.round(amountFiat * 100),
            currency: prefs.currency,
          })
          await insertGiftRow({
            senderId: user.address,
            recipientId: peer.address,
            amountCents: Math.round(amountFiat * 100),
            message,
          })
          await insertNotification({
            address: peer.address,
            kind: "gift",
            title: "You received gold",
            body: `@${user.handle} poured ${amountFiat} ${prefs.currency}`,
          })
        }
      }
      say(`Poured to ${to}`)
    },
    [
      authUserId,
      balance,
      caste,
      ledger,
      makeEntry,
      persist,
      prefs.currency,
      refreshFromServer,
      say,
      user,
    ],
  )

  const enterChallenge = useCallback(
    async (title: string, entryFiat = 5) => {
      if (caste === "lord") {
        say("Lords fund bounties — they don't enter")
        throw new Error("Lords fund, not enter")
      }
      const mg = fiatToGoldMg(entryFiat, prefs.currency)
      if (mg > balance.gold_mg_available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }
      if (authUserId) {
        try {
          await rpcHoldGold({
            amountFiat: entryFiat,
            kind: "challenge",
            label: title,
            currency: prefs.currency,
          })
          await refreshFromServer()
          say(`Entered · ${title}`)
          return
        } catch (e) {
          console.warn("[enterChallenge] rpc", e)
        }
      }
      const nextBal = withFiatMirrors({
        ...balance,
        gold_mg_available: balance.gold_mg_available - mg,
        gold_mg_hold: balance.gold_mg_hold + mg,
      })
      const entry = makeEntry({
        id: `ch-${Date.now()}`,
        dir: "out",
        who: title,
        gold_mg: mg,
        fiatAmount: entryFiat,
        kind: "challenge",
        escrow_status: "held",
        ts: Date.now(),
      })
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      if (user.address) {
        await upsertProfile({ address: user.address, user, caste, balance: nextBal })
        await insertLedger(entry, user.address)
        await insertNotification({
          address: user.address,
          kind: "challenge",
          title: "Challenge entered",
          body: `${title} · stake ${entryFiat} ${prefs.currency}`,
        })
      }
      say(`Entered · ${title}`)
    },
    [
      authUserId,
      balance,
      caste,
      ledger,
      makeEntry,
      persist,
      prefs.currency,
      refreshFromServer,
      say,
      user,
    ],
  )

  const fundBounty = useCallback(
    async (title: string, amountFiat: number) => {
      if (caste !== "lord") {
        say("Only Lords fund bounties")
        throw new Error("Vagrants enter, Lords fund")
      }
      const mg = fiatToGoldMg(amountFiat, prefs.currency)
      if (amountFiat <= 0 || mg > balance.gold_mg_available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }
      if (authUserId) {
        try {
          await rpcHoldGold({
            amountFiat,
            kind: "bounty",
            label: title,
            currency: prefs.currency,
          })
          await refreshFromServer()
          say(`Bounty funded · ${title}`)
          return
        } catch (e) {
          console.warn("[fundBounty] rpc", e)
        }
      }
      const nextBal = withFiatMirrors({
        ...balance,
        gold_mg_available: balance.gold_mg_available - mg,
        gold_mg_hold: balance.gold_mg_hold + mg,
      })
      const entry = makeEntry({
        id: `b-${Date.now()}`,
        dir: "out",
        who: title,
        gold_mg: mg,
        fiatAmount: amountFiat,
        kind: "bounty",
        escrow_status: "held",
        ts: Date.now(),
      })
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      if (user.address) {
        await upsertProfile({ address: user.address, user, caste, balance: nextBal })
        await insertLedger(entry, user.address)
        await insertNotification({
          address: user.address,
          kind: "bounty",
          title: "Bounty funded",
          body: `${title} · ${amountFiat} ${prefs.currency}`,
        })
      }
      say(`Bounty funded · ${title}`)
    },
    [
      authUserId,
      balance,
      caste,
      ledger,
      makeEntry,
      persist,
      prefs.currency,
      refreshFromServer,
      say,
      user,
    ],
  )

  const cashOut = useCallback(
    async (amountFiat: number) => {
      if (caste === "lord") {
        say("Lords put in. Nothing comes out.")
        throw new Error("Lords cannot cash out")
      }
      const mg = fiatToGoldMg(amountFiat, prefs.currency)
      if (amountFiat <= 0 || mg > balance.gold_mg_available) {
        say(MONEY_FAIL)
        throw new Error(MONEY_FAIL)
      }

      if (authUserId && mode === "stripe") {
        try {
          await requestCashOutPayout(amountFiat, prefs.currency)
          await refreshFromServer()
          say("Cash out sent")
          return
        } catch (e: any) {
          // Fall through to local queue when Connect not ready
          console.warn("[cashOut] payout", e?.message || e)
          if (String(e?.message || "").includes("Connect")) {
            say(e.message)
            throw e
          }
        }
      }

      const nextBal = withFiatMirrors({
        ...balance,
        gold_mg_available: balance.gold_mg_available - mg,
        gold_mg_total: balance.gold_mg_total - mg,
      })
      const entry = makeEntry({
        id: `c-${Date.now()}`,
        dir: "out",
        who: mode === "stripe" ? "Cash out · Stripe" : mode === "thirdweb" ? "Cash out · thirdweb" : "Cash out to bank",
        gold_mg: mg,
        fiatAmount: amountFiat,
        kind: "cash",
        escrow_status: "released",
        ts: Date.now(),
      })
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      if (user.address) {
        await upsertProfile({ address: user.address, user, caste, balance: nextBal })
        await insertLedger(entry, user.address)
        await insertNotification({
          address: user.address,
          kind: "cashout",
          title: "Cash out queued",
          body: `Releasing ${amountFiat} ${prefs.currency}`,
        })
      }
      say(`Cash out queued`)
    },
    [
      authUserId,
      balance,
      caste,
      ledger,
      makeEntry,
      mode,
      persist,
      prefs.currency,
      refreshFromServer,
      say,
      user,
    ],
  )

  const deposit = useCallback(
    async (
      amountFiat: number,
      currency?: FiatCurrency,
      opts?: { paymentIntentId?: string; awaitServerMint?: boolean },
    ) => {
      const cur = currency ?? prefs.currency

      // Stripe path: prefer server webhook mint, then refresh
      if (opts?.awaitServerMint && authUserId) {
        for (let i = 0; i < 8; i++) {
          await new Promise((r) => setTimeout(r, 700))
          const remote = await fetchProfileBalance(authUserId)
          if (remote && remote.gold_mg_total > balance.gold_mg_total) {
            setBalance(remote)
            await persist({ balance: remote })
            const remoteLedger = await fetchRemoteLedger(authUserId)
            if (remoteLedger?.length) {
              setLedger(remoteLedger)
              await persist({ balance: remote, ledger: remoteLedger })
            }
            say("Escrow credited")
            return
          }
        }
        // Webhook slow — optimistic local mint once so UX isn't blocked
      }

      const mg = fiatToGoldMg(amountFiat, cur)
      const holdMg = mg * 0.3
      const availMg = mg - holdMg
      const nextBal = withFiatMirrors({
        ...balance,
        displayCurrency: cur,
        gold_mg_available: balance.gold_mg_available + availMg,
        gold_mg_hold: balance.gold_mg_hold + holdMg,
        gold_mg_total: balance.gold_mg_total + mg,
      })
      const entry = makeEntry({
        id: opts?.paymentIntentId || `d-${Date.now()}`,
        dir: "in",
        who: mode === "stripe" ? "Deposit · Stripe escrow" : mode === "thirdweb" ? "Deposit · treasury" : "Deposit · escrow",
        gold_mg: mg,
        fiatAmount: amountFiat,
        kind: "deposit",
        escrow_status: "held",
        ts: Date.now(),
      })
      const nextLedger = [entry, ...ledger]
      setBalance(nextBal)
      setLedger(nextLedger)
      await persist({ balance: nextBal, ledger: nextLedger })
      if (user.address) {
        await upsertProfile({ address: user.address, user, caste, balance: nextBal })
        await insertLedger(entry, user.address)
        await insertNotification({
          address: user.address,
          kind: "deposit",
          title: "Escrow credited",
          body: `Minted reference gold from ${amountFiat} ${cur}`,
        })
      }
      say(`Escrow credited`)
    },
    [authUserId, balance, caste, ledger, makeEntry, mode, persist, prefs.currency, say, user],
  )

  const addFundsMock = useCallback(
    async (amountFiat: number) => {
      await deposit(amountFiat, prefs.currency)
    },
    [deposit, prefs.currency],
  )

  const demoRole = isDemoAddress(user.address)

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
      moneyMode: mode,
      say,
      connect,
      connectDemo,
      hydrateFromAuth,
      refreshFromServer,
      disconnect,
      setTheme,
      setPrefs,
      updateUser,
      chooseVagrant,
      ascendLord,
      gift,
      cashOut,
      addFundsMock,
      deposit,
      enterChallenge,
      fundBounty,
      demoRole,
      authUserId,
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
      mode,
      say,
      connect,
      connectDemo,
      hydrateFromAuth,
      refreshFromServer,
      disconnect,
      setTheme,
      setPrefs,
      updateUser,
      chooseVagrant,
      ascendLord,
      gift,
      cashOut,
      addFundsMock,
      deposit,
      enterChallenge,
      fundBounty,
      demoRole,
      authUserId,
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
