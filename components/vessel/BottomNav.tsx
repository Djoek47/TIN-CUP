import { View, Pressable, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { usePathname, useRouter } from "expo-router"
import Svg, { Path, Rect, Circle } from "react-native-svg"
import { useVessel } from "@/providers/VesselTheme"
import { Label } from "./MonoNum"
import { pure } from "@/theme/vessel"
import { useApp } from "@/providers/AppState"

function IconHome({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" stroke={c} strokeWidth={1.3} />
    </Svg>
  )
}
function IconLive({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="7" width="13" height="10" rx="2" stroke={c} strokeWidth={1.3} />
      <Path d="M16 10l5-2v8l-5-2v-4z" stroke={c} strokeWidth={1.3} />
    </Svg>
  )
}
function IconWallet({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke={c} strokeWidth={1.3} />
      <Path d="M4 8V6.5A2.5 2.5 0 0 1 6.5 4H18" stroke={c} strokeWidth={1.3} />
      <Circle cx="16" cy="14" r="1.2" fill={c} />
    </Svg>
  )
}
function IconYou({ c }: { c: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="3.2" stroke={c} strokeWidth={1.3} />
      <Path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" stroke={c} strokeWidth={1.3} />
    </Svg>
  )
}

export function BottomNav() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const pathname = usePathname()
  const { v, isLord } = useVessel()
  const { say } = useApp()

  const go = (path: string) => {
    router.push(path as any)
  }

  const active = (key: string) => {
    if (key === "home") return pathname === "/" || pathname.endsWith("/index") || pathname.includes("/(app)") && !pathname.includes("live") && !pathname.includes("wallet") && !pathname.includes("profile") && !pathname.includes("send") && !pathname.includes("arena") && pathname.split("/").filter(Boolean).pop() === "index" || pathname.endsWith("(app)")
    return pathname.includes(key)
  }

  const item = (key: string, label: string, path: string, Icon: typeof IconHome) => {
    const on = pathname.includes(`/${key}`) || (key === "home" && (pathname === "/" || pathname.match(/\(app\)\/?$/)))
    // simplify home detection
    const isHome =
      key === "home" &&
      (pathname.endsWith("/(app)") ||
        pathname.endsWith("/(app)/") ||
        pathname.endsWith("/index") ||
        pathname === "/(app)/index")
    const lit = key === "home" ? isHome : pathname.includes(key)
    const c = lit ? v.ink : v.faint
    return (
      <Pressable key={key} onPress={() => go(path)} style={styles.item} hitSlop={8}>
        <Icon c={c} />
        <Label style={{ color: c, fontSize: 8, marginTop: 4 }}>{label}</Label>
      </Pressable>
    )
  }

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={[styles.pill, { backgroundColor: v.navbg, borderColor: v.line, borderRadius: v.radPill }]}>
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
        {item("home", "HOME", "/(app)", IconHome)}
        {item("live", "LIVE", "/(app)/live", IconLive)}
        <Pressable
          onPress={() => {
            if (isLord) go("/(app)/send")
            else go("/(app)/golive")
          }}
          style={[
            styles.orb,
            {
              borderColor: isLord ? v.amb : v.lim,
              shadowColor: isLord ? v.amb : v.lim,
            },
          ]}
        >
          <Label style={{ color: v.ink, fontSize: 14 }}>{isLord ? "↑" : "↓"}</Label>
        </Pressable>
        {item("wallet", "WALLET", "/(app)/wallet", IconWallet)}
        {item("profile", "YOU", "/(app)/profile", IconYou)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, bottom: 0, zIndex: 50 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  orb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    marginHorizontal: 4,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
})
