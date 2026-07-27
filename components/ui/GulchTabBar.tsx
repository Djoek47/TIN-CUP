import { View, Pressable, StyleSheet, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { BlurView } from "expo-blur"
import { Ico } from "@/components/gds/icons"
import { color, space } from "@/theme/tokens"
import { useAuth } from "@/providers/AuthProvider"

type TabRoute = { key: string; name: string }
type TabNavState = { index: number; routes: TabRoute[] }
type GulchTabBarProps = {
  state: TabNavState
  navigation: { navigate: (name: string) => void }
}

/** Make NavBar: Main St · Feed · Lobbies · Poster + caste ActionOrb */
const VISIBLE = ["index", "feed", "lobbies", "profile"] as const

export function GulchTabBar({ state, navigation }: GulchTabBarProps) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const isLord = Boolean(profile?.is_lord)

  const routes = state.routes.filter((r) => (VISIBLE as readonly string[]).includes(r.name))

  const iconFor = (name: string, active: boolean) => {
    const c = active ? color.action.primary : color.text.tertiary
    if (name === "index") return <Ico.Sheriff c={c} />
    if (name === "feed") return <Ico.Lasso c={c} />
    if (name === "lobbies") return <Ico.Saloon c={c} />
    return <Ico.Poster c={c} />
  }

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.pill}>
        <BlurView intensity={48} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.pillInner}>
          {routes.slice(0, 2).map((route) => {
            const focused = state.index === state.routes.findIndex((r) => r.key === route.key)
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
              >
                {iconFor(route.name, focused)}
                {focused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
              </Pressable>
            )
          })}

          <Pressable
            onPress={() => router.push("/(app)/compose")}
            style={styles.orb}
            accessibilityLabel={isLord ? "Post challenge" : "Post beg"}
          >
            {isLord ? <Ico.Dynamite c={color.text.inverse} /> : <Ico.Cup c={color.text.inverse} />}
          </Pressable>

          {routes.slice(2).map((route) => {
            const focused = state.index === state.routes.findIndex((r) => r.key === route.key)
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
              >
                {iconFor(route.name, focused)}
                {focused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 12, right: 12, bottom: 0 },
  pill: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    backgroundColor: "rgba(9,12,18,0.88)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 16 },
      default: {},
    }),
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space[4],
    paddingVertical: 10,
  },
  tab: { minWidth: 48, alignItems: "center", gap: 3, paddingVertical: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: color.action.primary },
  dotSpacer: { width: 4, height: 4 },
  orb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderTopColor: "rgba(255,255,255,0.4)",
    ...Platform.select({
      ios: {
        shadowColor: color.action.primary,
        shadowOpacity: 0.45,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
})
