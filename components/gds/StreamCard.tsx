import { Pressable, View, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Txt } from "@/components/ui/Txt"
import { StatusChip } from "./StatusChip"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"
import type { MakeStream } from "@/lib/make-data"

export function StreamCard({ stream, onPress }: { stream: MakeStream; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, glass.card]}>
      <LinearGradient colors={["rgba(36,43,54,0.9)", "rgba(18,22,31,0.9)"]} style={styles.thumb}>
        <Txt style={{ fontSize: 30 }}>🎪</Txt>
        <View style={styles.live}>
          <StatusChip type="live" />
        </View>
        <View style={styles.viewers}>
          <Txt style={{ fontFamily: font.mono, fontSize: 9, color: color.text.primary }}>
            {stream.viewers.toLocaleString()} 👁
          </Txt>
        </View>
      </LinearGradient>
      <View style={styles.pad}>
        <Txt style={{ fontFamily: font.headlineBold, fontSize: 12, color: color.text.primary }} numberOfLines={1}>
          {stream.host}
        </Txt>
        {stream.battle ? (
          <Txt style={{ fontFamily: font.body, fontSize: 10, color: color.action.primary, marginTop: 2 }}>
            ⚔ Battle active
          </Txt>
        ) : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { width: 136, borderRadius: 16, overflow: "hidden", flexShrink: 0 },
  thumb: { height: 88, alignItems: "center", justifyContent: "center" },
  live: { position: "absolute", top: 6, left: 6 },
  viewers: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pad: { paddingHorizontal: 10, paddingVertical: 8 },
})
