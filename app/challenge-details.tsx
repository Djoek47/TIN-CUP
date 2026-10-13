import { useMemo, useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Row,
  Hairline,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { challengeById } from "@/lib/challenges"
import { space } from "@/theme/vessel"

const RULES = [
  "Record yourself doing the task — start to finish, no cuts",
  "Post as a beg or go live within the time limit",
  "Lord picks winner. No appeals. Their gold, their call.",
  "Sheriff reviews all submissions. Harassment = instant ban.",
]

/** Challenge detail — enter (vagrant) or fund (lord) via AppState mock gold */
export default function ChallengeDetailsScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { enterChallenge, fundBounty, say } = useApp()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const challenge = useMemo(() => challengeById(id), [id])
  const bountyUsd = challenge.fundUsd
  const entryUsd = challenge.entryUsd

  const onPrimary = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (isLord) {
        await fundBounty(challenge.title, bountyUsd)
        setDone(true)
        Alert.alert("Bounty funded", `$${bountyUsd} held in mock escrow.`)
      } else {
        await enterChallenge(challenge.title, entryUsd)
        setDone(true)
        Alert.alert("Entered", "Stake held. Record via go-live or compose.")
      }
    } catch (e: any) {
      say(e?.message || "Failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="Bounty" onBack={() => router.back()} />
      <Label style={{ marginTop: 8 }}>
        BOUNTY · {challenge.endsIn} remaining · {challenge.kicker}
      </Label>
      <MonoNum style={{ color: v.amb, fontSize: 36, marginTop: 14 }}>
        ${bountyUsd.toLocaleString()}
      </MonoNum>
      <Label style={{ marginTop: 4 }}>TO THE WINNER (MOCK GOLD)</Label>
      <UiText weight="black" style={{ fontSize: 22, marginTop: 18 }}>
        {challenge.task}
      </UiText>
      <Label style={{ marginTop: 10, color: v.dim }}>@{challenge.hostHandle}</Label>

      <Label style={{ marginTop: space.sectionGap }}>RULES</Label>
      <Hairline />
      {RULES.map((rule, i) => (
        <View key={i}>
          <Row style={styles.ruleRow}>
            <Label style={{ width: 20 }}>{i + 1}.</Label>
            <UiText weight="reg" style={{ flex: 1, fontSize: 13, color: v.dim, lineHeight: 18 }}>
              {rule}
            </UiText>
          </Row>
          <Hairline />
        </View>
      ))}

      <View style={{ flex: 1, minHeight: 20 }} />
      {done ? (
        <>
          <PrimaryButton
            title={isLord ? "VIEW WALLET" : "GO RECORD (LIVE)"}
            onPress={() => router.replace(isLord ? "/(app)/wallet" : "/(app)/golive")}
          />
          {!isLord ? (
            <PrimaryButton
              title="POST A BEG INSTEAD"
              tone="lim"
              onPress={() => router.replace("/(app)/compose" as any)}
            />
          ) : null}
        </>
      ) : (
        <PrimaryButton
          title={isLord ? `FUND $${bountyUsd}` : `ENTER · STAKE $${entryUsd}`}
          onPress={onPrimary}
          disabled={busy}
        />
      )}
      <Label style={{ textAlign: "center", marginTop: 12, marginBottom: 8 }}>
        {isLord ? "Debits available gold → bounty hold" : "Debits entry stake → challenge hold"}
      </Label>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  ruleRow: { paddingVertical: space.rowPad, alignItems: "flex-start", gap: 8 },
})
