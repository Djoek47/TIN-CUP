import { useMemo, useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { TopAppBar, PosterChip, GoldButton } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { CHALLENGES } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const RULES = [
  "Record yourself doing the task — start to finish, no cuts",
  "Post as a beg or reply video within the time limit",
  "Lord picks winner. No appeals. Their gold, their call.",
  "Sheriff reviews all submissions. Harassment = instant ban.",
]

/** S31 Challenge Detail — Make ChallengeDetailScreen */
export default function ChallengeDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [entered, setEntered] = useState(false)

  const challenge = useMemo(() => {
    const n = Number(id)
    return CHALLENGES.find((c) => c.id === n) ?? CHALLENGES[0]
  }, [id])

  const handleEnter = () => {
    setEntered(true)
    Alert.alert("🤠 You're in the running!", "Post your video to claim the bounty.")
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Bounty" overline="CHALLENGE" onBack={() => router.back()} />
        <View style={{ paddingHorizontal: 16 }}>
          <View style={[styles.card, glass.card]}>
            <Txt style={styles.deadline}>
              BOUNTY · {challenge.deadline} remaining
            </Txt>
            <View style={styles.fuseTrack}>
              <View style={styles.fuseFill} />
            </View>
            <Txt style={styles.bounty}>{challenge.bounty.toLocaleString()}</Txt>
            <Txt style={styles.coinsLabel}>COINS TO THE WINNER</Txt>
            <Txt style={styles.task}>{challenge.task}</Txt>
            <View style={styles.cardFoot}>
              <PosterChip name={challenge.lord} title="Baron" isLord />
              <Txt style={{ fontFamily: font.body, fontSize: 12, color: color.text.secondary }}>
                {challenge.participants} attempting
              </Txt>
            </View>
          </View>

          <View style={[styles.rules, glass.card]}>
            <Txt style={styles.rulesTitle}>Rules of the Gulch</Txt>
            {RULES.map((rule, i) => (
              <View key={i} style={styles.ruleRow}>
                <Txt style={styles.ruleNum}>{i + 1}.</Txt>
                <Txt style={styles.ruleTxt}>{rule}</Txt>
              </View>
            ))}
          </View>

          {entered ? (
            <Pressable style={styles.enteredBtn}>
              <Txt style={styles.enteredTxt}>{"✓ You're entered — go record it"}</Txt>
            </Pressable>
          ) : (
            <GoldButton title="Enter this Bounty" onPress={handleEnter} />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  card: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    overflow: "hidden",
  },
  deadline: {
    fontFamily: font.headlineBlack,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: color.text.tertiary,
    marginBottom: 8,
  },
  fuseTrack: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    height: 4,
    marginBottom: 14,
    overflow: "hidden",
  },
  fuseFill: {
    height: "100%",
    width: "55%",
    backgroundColor: color.action.primary,
  },
  bounty: {
    fontFamily: font.display,
    fontSize: 44,
    color: color.action.primary,
    marginBottom: 8,
  },
  coinsLabel: {
    fontFamily: font.headlineBold,
    fontSize: 11,
    color: color.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 18,
  },
  task: {
    fontFamily: font.headlineBold,
    fontSize: 17,
    color: color.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rules: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  rulesTitle: {
    fontFamily: font.headlineBold,
    fontSize: 13,
    color: color.text.primary,
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  ruleNum: {
    fontFamily: font.mono,
    fontSize: 11,
    color: color.action.primary,
  },
  ruleTxt: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.secondary,
    lineHeight: 18,
    flex: 1,
  },
  enteredBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,179,43,0.27)",
    alignItems: "center",
    justifyContent: "center",
  },
  enteredTxt: {
    fontFamily: font.headlineBold,
    fontSize: 17,
    color: color.action.primary,
  },
})
