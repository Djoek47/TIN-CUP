import { Pressable, View, StyleSheet } from "react-native"
import Svg, { Circle, Text as SvgText } from "react-native-svg"
import { Txt } from "@/components/ui/Txt"
import { CoinAmount } from "./CoinAmount"
import { GoalBar } from "./GoalBar"
import { GiverStack } from "./GiverStack"
import { TitleChip } from "./TitleChip"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"
import type { MakeBeg } from "@/lib/make-data"

export function BegCard({ beg, onPress }: { beg: MakeBeg; onPress?: () => void }) {
  const urgent = beg.timeLeft < 6
  const r = 15
  const circ = 2 * Math.PI * r
  const dash = (beg.timeLeft / 24) * circ

  return (
    <Pressable onPress={onPress} style={[styles.card, glass.card]}>
      <View style={styles.top}>
        <View style={styles.cat}>
          <Txt
            style={{
              fontFamily: font.headlineBlack,
              fontSize: 8,
              letterSpacing: 1,
              color: color.dust,
              textTransform: "uppercase",
            }}
          >
            {beg.cat}
          </Txt>
        </View>
        <Svg width={38} height={38}>
          <Circle cx="19" cy="19" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <Circle
            cx="19"
            cy="19"
            r={r}
            fill="none"
            stroke={urgent ? color.action.danger : color.action.primary}
            strokeWidth="2"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            rotation="-90"
            origin="19, 19"
          />
          <SvgText
            x="19"
            y="23"
            textAnchor="middle"
            fill={color.text.secondary}
            fontSize="8"
            fontFamily="IBMPlexMono_500Medium"
          >
            {beg.timeLeft}h
          </SvgText>
        </Svg>
      </View>
      <View style={styles.body}>
        <View style={[styles.portrait, glass.elevated]}>
          <Txt style={{ fontSize: 22 }}>🤠</Txt>
        </View>
        <View style={{ flex: 1 }}>
          <Txt
            style={{
              fontFamily: font.headlineBold,
              fontSize: 12,
              color: color.text.primary,
              lineHeight: 16,
              marginBottom: 3,
            }}
            numberOfLines={3}
          >
            {beg.beg}
          </Txt>
          <View style={styles.handleRow}>
            <Txt style={{ fontFamily: font.body, fontSize: 10, color: color.text.secondary }}>{beg.handle}</Txt>
            <TitleChip title={beg.title} small />
          </View>
        </View>
      </View>
      {beg.goal ? (
        <View style={{ marginBottom: 8 }}>
          <GoalBar current={beg.coins} goal={beg.goal} />
        </View>
      ) : null}
      <View style={styles.footer}>
        <GiverStack count={beg.givers} />
        <CoinAmount value={beg.coins} size="S" />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 12, overflow: "hidden" },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cat: {
    backgroundColor: "rgba(140,122,91,0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  body: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  portrait: {
    width: 38,
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  handleRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
})
