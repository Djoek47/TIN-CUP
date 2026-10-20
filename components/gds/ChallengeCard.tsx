import { Pressable, View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { Ico } from "./icons"
import { PosterChip } from "./PosterChip"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"
import type { MakeChallenge } from "@/lib/make-data"

export function ChallengeCard({
  challenge,
  onPress,
}: {
  challenge: MakeChallenge
  onPress?: () => void
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, glass.card]}>
      <View style={styles.meta}>
        <Ico.Dynamite s={14} c={color.action.primary} />
        <Txt
          style={{
            fontFamily: font.headlineBlack,
            fontSize: 9,
            letterSpacing: 1,
            color: color.text.tertiary,
            textTransform: "uppercase",
          }}
        >
          BOUNTY · {challenge.deadline} remaining
        </Txt>
      </View>
      <View style={styles.fuseTrack}>
        <View style={styles.fuseFill} />
      </View>
      <Txt
        style={{
          fontFamily: font.display,
          fontSize: 26,
          color: color.action.primary,
          letterSpacing: 0.4,
          lineHeight: 30,
          marginBottom: 6,
        }}
      >
        {challenge.bounty.toLocaleString()} coins
      </Txt>
      <Txt
        style={{
          fontFamily: font.headlineSemi,
          fontSize: 13,
          color: color.text.primary,
          marginBottom: 10,
          lineHeight: 18,
        }}
      >
        {challenge.task}
      </Txt>
      <View style={styles.footer}>
        <PosterChip name={challenge.lord} title="Baron" isLord size="S" />
        <Txt style={{ fontFamily: font.body, fontSize: 11, color: color.text.secondary }}>
          {challenge.participants} attempting
        </Txt>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 14 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  fuseTrack: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    height: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  fuseFill: {
    width: "55%",
    height: "100%",
    backgroundColor: color.action.primary,
    borderRadius: 2,
  },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
})
