import { useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Txt } from "@/components/ui/Txt"
import { TitleChip, Ico, GoldButton } from "@/components/gds"
import { glass } from "@/theme/glass"
import { color, font, primitive } from "@/theme/tokens"

/** S18 Wanted Poster — Make ProfileScreen */
export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [followed, setFollowed] = useState(false)

  const handleFollow = () => {
    setFollowed((f) => !f)
    Alert.alert(followed ? "Unfollowed DustyPete." : "Following DustyPete 🤠")
  }
  const handleMessage = () =>
    Alert.alert("Messaging not open yet — town's still being built.")
  const handleShare = () => Alert.alert("Wanted poster link copied 🪶")

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 110, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.poster, glass.parchment]}>
          <View style={styles.posterCenter}>
            <Txt style={styles.wanted}>WANTED</Txt>
            <Txt style={styles.drifterLine}>DRIFTER · PERDITION GULCH</Txt>
            <View style={styles.mugshot}>
              <Txt style={{ fontSize: 52 }}>🤠</Txt>
              {[
                { top: 0, left: 0 },
                { top: 0, right: 0 },
                { bottom: 0, left: 0 },
                { bottom: 0, right: 0 },
              ].map((pos, i) => (
                <View key={i} style={[styles.nail, pos]} />
              ))}
            </View>
            <Txt style={styles.name}>DUSTY PETE</Txt>
            <Txt style={styles.handle}>@DustyPete</Txt>
          </View>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ico.Star
                key={i}
                s={16}
                c={i <= 4 ? color.action.primary : color.parchmentEdge}
                filled={i <= 4}
              />
            ))}
            <Txt style={styles.trusted}>Trusted Vagrant</Txt>
          </View>

          <View style={styles.stats}>
            {[
              ["GIVEN", "0"],
              ["RECEIVED", "1,240"],
              ["STREAK", "7d"],
            ].map(([label, value]) => (
              <View key={label} style={{ alignItems: "center", flex: 1 }}>
                <Txt style={styles.statVal}>{value}</Txt>
                <Txt style={styles.statLabel}>{label}</Txt>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badges}>
            {["🏆", "⚡", "🌟", "🎯", "🔥"].map((badge, i) => (
              <View
                key={i}
                style={[
                  styles.badge,
                  {
                    backgroundColor: i < 3 ? "rgba(26,32,41,0.12)" : "rgba(228,218,192,0.5)",
                    borderColor: i < 3 ? "rgba(245,179,43,0.6)" : "rgba(228,218,192,0.8)",
                    opacity: i >= 3 ? 0.4 : 1,
                  },
                ]}
              >
                <Txt style={{ fontSize: 20 }}>{badge}</Txt>
              </View>
            ))}
          </ScrollView>

          <View style={styles.posterFoot}>
            <Txt style={styles.rank}>Gold Rush · Rank #412</Txt>
            <TitleChip title="Folk Hero" />
          </View>
        </View>

        <View style={styles.actions}>
          {[
            {
              label: followed ? "Following ✓" : "Follow",
              action: handleFollow,
              accent: followed,
            },
            {
              label: "Gift 🪙",
              action: () => router.push("/(app)/wallet"),
              accent: true,
            },
            { label: "Message", action: handleMessage, accent: false },
            { label: "Share", action: handleShare, accent: false },
          ].map((btn) => (
            <Pressable
              key={btn.label}
              onPress={btn.action}
              style={[
                styles.actionBtn,
                btn.accent ? glass.gold : glass.card,
                btn.accent && { borderColor: "rgba(245,179,43,0.3)" },
              ]}
            >
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 11,
                  color: btn.accent ? color.action.primary : color.text.secondary,
                }}
              >
                {btn.label}
              </Txt>
            </Pressable>
          ))}
        </View>

        <View style={[styles.ascension, glass.gold]}>
          <Txt style={styles.ascensionTitle}>👑 Rise to Lordship</Txt>
          <Txt style={styles.ascensionBody}>
            $100 buy-in. Permanent. Never beg again. Power never looked so good.
          </Txt>
          <GoldButton
            title="Begin the Ascension"
            onPress={() => router.push("/(app)/ascension")}
            style={{ height: 44, borderRadius: 12 }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  poster: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    overflow: "hidden",
  },
  posterCenter: { alignItems: "center", marginBottom: 14 },
  wanted: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "rgba(140,122,91,0.6)",
    marginBottom: 2,
  },
  drifterLine: {
    fontFamily: font.headlineBlack,
    fontSize: 9,
    letterSpacing: 4.8,
    textTransform: "uppercase",
    color: color.dust,
    marginBottom: 14,
  },
  mugshot: {
    width: 100,
    height: 122,
    marginBottom: 12,
    backgroundColor: "rgba(26,32,41,0.08)",
    borderRadius: 4,
    borderWidth: 3,
    borderColor: "rgba(23,19,12,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  nail: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: primitive.ink[900],
    opacity: 0.15,
  },
  name: {
    fontFamily: font.display,
    fontSize: 26,
    color: color.text.inverse,
    letterSpacing: 1,
    lineHeight: 30,
    marginBottom: 3,
  },
  handle: {
    fontFamily: font.headlineBold,
    fontSize: 12,
    color: color.dust,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    marginBottom: 16,
  },
  trusted: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.dust,
    marginLeft: 5,
  },
  stats: {
    flexDirection: "row",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(228,218,192,0.8)",
    marginBottom: 16,
  },
  statVal: {
    fontFamily: font.mono,
    fontSize: 18,
    color: color.text.inverse,
  },
  statLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: color.dust,
    marginTop: 3,
  },
  badges: { gap: 8, marginBottom: 16 },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  posterFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rank: { fontFamily: font.body, fontSize: 11, color: color.dust },
  actions: { flexDirection: "row", gap: 8, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ascension: {
    borderRadius: 16,
    padding: 18,
    shadowColor: color.action.primary,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  ascensionTitle: {
    fontFamily: font.headlineBold,
    fontSize: 14,
    color: color.action.primary,
    marginBottom: 4,
  },
  ascensionBody: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.secondary,
    lineHeight: 18,
    marginBottom: 14,
  },
})
