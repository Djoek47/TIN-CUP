import { useState } from "react"
import { View, Pressable, StyleSheet, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { PosterChip, StatusChip, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { MONEY_FAIL_COPY } from "@/lib/thirdweb"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const CHAT = [
  { user: "PonyExpress", text: "Go VAULTSWORTH!!!", gift: false },
  { user: "BaronVaultsworth", text: "250 coins on Molly — taste THAT!", gift: true, amt: 250, tier: 3 },
  { user: "TumbleweedTed", text: "This battle is absolutely insane", gift: false },
  { user: "TycoonBlackridge", text: "I'll match and raise — 500!", gift: true, amt: 500, tier: 4 },
  { user: "CactusDreams", text: "🤠🤠🤠 incredible", gift: false },
]

const GIFTS = [
  { amt: 10, emoji: "🪙", label: "×10", side: "left" as const },
  { amt: 50, emoji: "👜", label: "×50", side: "left" as const },
  { amt: 100, emoji: "💥", label: "×100", side: "right" as const },
  { amt: 500, emoji: "🚂", label: "×500", side: "right" as const },
]

/** S25 Live Stream battle — Make LiveStreamScreen */
export default function LiveStreamScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { giftUsdt } = useAuth()
  const [leftCoins, setLeftCoins] = useState(12400)
  const [rightCoins, setRightCoins] = useState(8900)
  const totalCoins = leftCoins + rightCoins
  const leftPct = Math.round((leftCoins / totalCoins) * 100)

  const handleGift = async (amt: number, side: "left" | "right") => {
    try {
      await giftUsdt("0x0000000000000000000000000000000000000001", amt * 100)
      if (side === "left") setLeftCoins((c) => c + amt)
      else setRightCoins((c) => c + amt)
      Alert.alert(
        `🪙 ${amt} coins thrown!`,
        side === "left" ? "Vaultsworth gains strength." : "Crimsonhat rises!"
      )
    } catch (e: any) {
      Alert.alert("Error", e?.message || MONEY_FAIL_COPY)
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#180a0e", "#2d1a3d"]} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <Txt style={{ fontSize: 80, opacity: 0.9 }}>🎩</Txt>
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0.75)", "transparent"]}
        style={[styles.top, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ico.Back c={color.text.primary} s={18} />
          </Pressable>
          <View style={styles.topMeta}>
            <PosterChip name="BaronVaultsworth" title="Baron" isLord />
            <StatusChip type="live" />
            <Txt style={{ fontFamily: font.mono, fontSize: 11, color: color.text.secondary }}>
              1,847 👁
            </Txt>
          </View>
          <View style={{ width: 34 }} />
        </View>

        <View style={[styles.battle, glass.nav]}>
          <View style={styles.battleLabels}>
            <Txt style={{ fontFamily: font.headlineBlack, fontSize: 10, color: color.action.primary }}>
              VAULTSWORTH
            </Txt>
            <Txt style={{ fontFamily: font.headlineBlack, fontSize: 10, color: color.text.tertiary }}>
              ⚔ BATTLE ⚔
            </Txt>
            <Txt style={{ fontFamily: font.headlineBlack, fontSize: 10, color: color.link }}>
              CRIMSONHAT
            </Txt>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${leftPct}%` }]} />
          </View>
          <View style={styles.battleCoins}>
            <Txt style={{ fontFamily: font.mono, fontSize: 12, color: color.action.primary }}>
              {leftCoins.toLocaleString()}
            </Txt>
            <Txt style={{ fontFamily: font.mono, fontSize: 12, color: color.link }}>
              {rightCoins.toLocaleString()}
            </Txt>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.giftRail}>
        {GIFTS.map((g) => (
          <Pressable
            key={g.amt}
            onPress={() => handleGift(g.amt, g.side)}
            style={[styles.giftBtn, glass.nav]}
          >
            <Txt style={{ fontSize: g.amt >= 100 ? 18 : 14 }}>{g.emoji}</Txt>
            <Txt style={{ fontFamily: font.mono, fontSize: 9, color: color.action.primary }}>
              {g.label}
            </Txt>
          </Pressable>
        ))}
      </View>

      <LinearGradient
        colors={["transparent", "rgba(11,14,20,0.92)"]}
        style={[styles.chat, { paddingBottom: insets.bottom + 24 }]}
      >
        {CHAT.map((msg, i) => (
          <View
            key={i}
            style={msg.gift ? [glass.gold, styles.giftMsg] : { paddingVertical: 1 }}
          >
            {msg.gift && "amt" in msg ? (
              <View style={styles.giftAmt}>
                <Txt style={{ fontSize: 14 }}>
                  {"tier" in msg && msg.tier === 4 ? "💥" : "👜"}
                </Txt>
                <Txt style={{ fontFamily: font.mono, fontSize: 13, color: color.action.primary }}>
                  +{msg.amt} coins
                </Txt>
              </View>
            ) : null}
            <Txt>
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 12,
                  color: msg.gift ? color.action.primaryHover : color.text.primary,
                }}
              >
                {msg.user}
              </Txt>
              <Txt
                style={{
                  fontFamily: font.body,
                  fontSize: 12,
                  color: msg.gift ? color.text.primary : color.text.secondary,
                }}
              >
                {" "}
                {msg.text}
              </Txt>
            </Txt>
          </View>
        ))}
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  top: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 14, paddingBottom: 60 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  topMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  battle: { borderRadius: 14, padding: 14 },
  battleLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: color.action.primary,
    borderRadius: 5,
  },
  battleCoins: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  giftRail: {
    position: "absolute",
    right: 12,
    bottom: 200,
    gap: 10,
  },
  giftBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chat: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 70,
    height: "42%",
    paddingHorizontal: 12,
    justifyContent: "flex-end",
    gap: 7,
  },
  giftMsg: { borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 },
  giftAmt: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
})
