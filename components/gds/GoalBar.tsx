import { View, StyleSheet } from "react-native"
import { Txt } from "@/components/ui/Txt"
import { color, font } from "@/theme/tokens"

export function GoalBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, (current / goal) * 100)
  return (
    <View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: pct >= 100 ? color.money.positive : color.action.primary,
            },
          ]}
        />
      </View>
      <View style={styles.meta}>
        <Txt style={{ fontFamily: font.mono, fontSize: 10, color: color.text.tertiary }}>
          {current.toLocaleString()} / {goal.toLocaleString()}
        </Txt>
        {pct >= 100 ? (
          <Txt
            style={{
              fontFamily: font.headlineBlack,
              fontSize: 8,
              color: color.money.positive,
              letterSpacing: 1,
            }}
          >
            FUNDED ✓
          </Txt>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    height: 5,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
  meta: { flexDirection: "row", justifyContent: "space-between", marginTop: 3 },
})
