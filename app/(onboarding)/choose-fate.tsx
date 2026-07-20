import { useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"
import * as Haptics from "expo-haptics"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { color, primitive, space, radius, font } from "@/theme/tokens"

type Fate = "drifter" | "lord"

export default function ChooseFate() {
  const router = useRouter()
  const [selected, setSelected] = useState<Fate | null>(null)

  function pick(f: Fate) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelected(f)
  }

  function confirm() {
    if (!selected) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.push({ pathname: "/(onboarding)/create", params: { fate: selected } })
  }

  return (
    <Screen scroll contentStyle={styles.content} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Txt variant="overline" color={color.text.tertiary}>
          {"THE CROSSROADS"}
        </Txt>
        <Txt variant="displayL" style={styles.title}>
          {"CHOOSE YER FATE"}
        </Txt>
        <Txt variant="bodyM" color={color.text.secondary} style={styles.sub}>
          {"Every soul that rolls into Perdition Gulch picks a side. There ain't no takin' it back."}
        </Txt>
      </View>

      <FateCard
        selected={selected === "drifter"}
        onPress={() => pick("drifter")}
        eyebrow="THE HONEST ROAD — FREE"
        icon="bag-personal"
        heading="THE DRIFTER"
        blurb="Broke, dusty, and full of nerve. Beg for coin, put on a show, and claw yer way up from the gutter."
        perks={["Post begs to the whole gulch", "Earn coin from gifts", "Climb the outlaw ranks"]}
        light
      />

      <FateCard
        selected={selected === "lord"}
        onPress={() => pick("lord")}
        eyebrow="THE HIGH ROAD — $100 BUY-IN"
        icon="crown"
        heading="THE LORD"
        blurb="Roll in rich and let 'em know it. Rain coin on the desperate, take yer Monarch's Cut, and rule the street."
        perks={["Gilded profile & tophat", "Bonus starting gold", "The Monarch's Cut on begs"]}
      />

      <View style={{ height: space[3] }} />
      <Button
        title={selected === "lord" ? "Buy in as a Lord — $100" : "Take the honest road"}
        variant="primary"
        size="lg"
        disabled={!selected}
        onPress={confirm}
      />
      <Txt variant="caption" color={color.text.tertiary} center style={styles.footnote}>
        {"You can earn or buy yer way to the other side later — but it'll cost ya."}
      </Txt>
    </Screen>
  )
}

function FateCard({
  selected,
  onPress,
  eyebrow,
  icon,
  heading,
  blurb,
  perks,
  light,
}: {
  selected: boolean
  onPress: () => void
  eyebrow: string
  icon: any
  heading: string
  blurb: string
  perks: string[]
  light?: boolean
}) {
  const bg = light ? primitive.parchment[100] : color.bg.card
  const fg = light ? primitive.ink[900] : color.text.primary
  const subFg = light ? "#5B4B36" : color.text.secondary
  const ring = selected ? primitive.gold[500] : light ? primitive.parchment[300] : color.border.subtle

  return (
    <Pressable onPress={onPress} style={{ marginBottom: space[4] }}>
      <View
        style={[
          styles.card,
          { backgroundColor: bg, borderColor: ring, borderWidth: selected ? 2 : 1 },
          selected && styles.cardSelected,
        ]}
      >
        <View style={styles.cardTopRow}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: light ? primitive.parchment[300] : "rgba(245,179,43,0.14)" },
            ]}
          >
            <MaterialCommunityIcons name={icon} size={26} color={primitive.gold[500]} />
          </View>
          {selected && (
            <View style={styles.checkPill}>
              <MaterialCommunityIcons name="check-bold" size={14} color={primitive.ink[900]} />
            </View>
          )}
        </View>

        <Txt style={[styles.cardEyebrow, { color: primitive.gold[600] }]}>{eyebrow}</Txt>
        <Txt variant="headlineXL" style={[styles.cardHeading, { color: fg }]}>
          {heading}
        </Txt>
        <Txt variant="bodyM" style={{ color: subFg, marginTop: space[2] }}>
          {blurb}
        </Txt>

        {selected && (
          <View style={styles.perks}>
            {perks.map((p) => (
              <View key={p} style={styles.perkRow}>
                <MaterialCommunityIcons name="star-four-points" size={13} color={primitive.gold[500]} />
                <Txt variant="bodyS" style={{ color: subFg, flex: 1 }}>
                  {p}
                </Txt>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space[5], paddingBottom: space[8] },
  header: { marginTop: space[4], marginBottom: space[6] },
  title: { marginTop: space[2] },
  sub: { marginTop: space[3], maxWidth: 340 },
  card: { borderRadius: radius.l, padding: space[5] },
  cardSelected: {
    shadowColor: primitive.gold[500],
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  iconWrap: { width: 52, height: 52, borderRadius: radius.m, alignItems: "center", justifyContent: "center" },
  checkPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: primitive.gold[500],
    alignItems: "center",
    justifyContent: "center",
  },
  cardEyebrow: { marginTop: space[4], fontFamily: font.mono, fontSize: 11, letterSpacing: 1 },
  cardHeading: { marginTop: space[1] },
  perks: { marginTop: space[4], gap: space[2] },
  perkRow: { flexDirection: "row", alignItems: "center", gap: space[2] },
  footnote: { marginTop: space[3] },
})
