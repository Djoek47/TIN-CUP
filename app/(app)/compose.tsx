import { useState } from "react"
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, BegCard, GoldButton } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { BEGS } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const STEPS = ["1. Write", "2. Show", "3. Preview"] as const

/** S26 Beg Composer — Make ComposerScreen */
export default function ComposeScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [hasGoal, setHasGoal] = useState(false)
  const [goalAmt, setGoalAmt] = useState("500")

  const handlePost = () => {
    Alert.alert(
      "🪙 Beg posted! The Sheriff's scanning it now.",
      "Goes live after a quick safety check."
    )
    router.back()
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TopAppBar title="New Beg" overline="COMPOSER" onBack={() => router.back()} />

      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={[
                styles.stepBar,
                {
                  backgroundColor:
                    step > i + 1 || step === i + 1 ? color.action.primary : "rgba(255,255,255,0.08)",
                  opacity: step === i + 1 ? 1 : step > i + 1 ? 0.6 : 0.3,
                },
              ]}
            />
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 10,
                color: step === i + 1 ? color.action.primary : color.text.tertiary,
              }}
            >
              {s}
            </Txt>
          </View>
        ))}
      </View>

      {step === 1 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.guidance, glass.parchment]}>
            <Txt style={styles.guidanceTitle}>Keep it legal & fun, partner. 🤠</Txt>
            <Txt style={styles.guidanceBody}>
              {`✔ "Best outlaw dance for $50"  ✔ "Fund my mustache wax"\n✘ Scams  ✘ Danger  ✘ Genuine emergencies`}
            </Txt>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Txt style={styles.label}>Your Pitch ({60 - title.length} left)</Txt>
            <TextInput
              value={title}
              onChangeText={(t) => t.length <= 60 && setTitle(t)}
              placeholder="Fund my championship mustache wax..."
              placeholderTextColor={color.text.tertiary}
              multiline
              style={[styles.input, glass.card, { height: 76 }]}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Txt style={styles.label}>Your Story ({280 - story.length} left)</Txt>
            <TextInput
              value={story}
              onChangeText={(t) => t.length <= 280 && setStory(t)}
              placeholder="The full saga of why the town owes you this..."
              placeholderTextColor={color.text.tertiary}
              multiline
              style={[styles.input, glass.card, { height: 96 }]}
            />
          </View>

          <View style={styles.goalBlock}>
            <View style={[styles.goalHead, hasGoal && { marginBottom: 12 }]}>
              <View>
                <Txt
                  style={{
                    fontFamily: font.headlineBold,
                    fontSize: 14,
                    color: color.text.primary,
                  }}
                >
                  Set a Goal
                </Txt>
                <Txt style={{ fontFamily: font.body, fontSize: 12, color: color.text.secondary }}>
                  Give givers a finish line
                </Txt>
              </View>
              <Pressable
                onPress={() => setHasGoal(!hasGoal)}
                style={[
                  styles.toggle,
                  { backgroundColor: hasGoal ? color.action.primary : "rgba(255,255,255,0.1)" },
                ]}
              >
                <View style={[styles.knob, { left: hasGoal ? 23 : 3 }]} />
              </Pressable>
            </View>
            {hasGoal ? (
              <View style={styles.goalChips}>
                {["100", "250", "500", "1000", "2500"].map((amt) => (
                  <Pressable
                    key={amt}
                    onPress={() => setGoalAmt(amt)}
                    style={[
                      styles.goalChip,
                      goalAmt === amt && {
                        borderColor: color.action.primary,
                        backgroundColor: "rgba(245,179,43,0.15)",
                      },
                    ]}
                  >
                    <Txt
                      style={{
                        fontFamily: font.mono,
                        fontSize: 12,
                        color: goalAmt === amt ? color.action.primary : color.text.secondary,
                      }}
                    >
                      {parseInt(amt, 10).toLocaleString()}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
      ) : null}

      {step === 2 ? (
        <View style={styles.showStep}>
          <Txt style={{ fontSize: 64 }}>📹</Txt>
          <Txt style={styles.showTitle}>Show them what you have</Txt>
          <Txt style={styles.showSub}>60 seconds max. Make it count.</Txt>
          <Pressable
            onPress={() => Alert.alert("Camera opens on your device 📷")}
            style={[styles.recordBtn, glass.card]}
          >
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 15,
                color: color.text.primary,
              }}
            >
              Record Video
            </Txt>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert("AI dramatization unlocks post-review 🎭")}
            style={[styles.aiCard, glass.card]}
          >
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 12,
                color: color.text.tertiary,
                marginBottom: 3,
              }}
            >
              Dramatize with AI
            </Txt>
            <Txt style={{ fontFamily: font.body, fontSize: 12, color: color.text.tertiary }}>
              The Sheriff checks it first. Unlocks after safety scan.
            </Txt>
          </Pressable>
        </View>
      ) : null}

      {step === 3 ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <Txt style={styles.previewLabel}>How it will look</Txt>
          <BegCard
            beg={{
              ...BEGS[0],
              beg: title || "Fund my championship mustache wax regionals",
              goal: hasGoal ? parseInt(goalAmt, 10) : null,
            }}
          />
        </ScrollView>
      ) : null}

      <View style={styles.footer}>
        {step > 1 ? (
          <Pressable onPress={() => setStep(step - 1)} style={[styles.backBtn, glass.card]}>
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 15,
                color: color.text.primary,
              }}
            >
              Back
            </Txt>
          </Pressable>
        ) : null}
        <View style={{ flex: 2 }}>
          <GoldButton
            title={step === 3 ? "Post it" : "Continue →"}
            onPress={() => (step < 3 ? setStep(step + 1) : handlePost())}
            style={{ height: 52, borderRadius: 12 }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  stepRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 10,
  },
  stepBar: { height: 3, borderRadius: 2, width: "100%", marginBottom: 4 },
  guidance: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(228,218,192,0.7)",
  },
  guidanceTitle: {
    fontFamily: font.headlineBold,
    fontSize: 12,
    color: color.text.inverse,
    marginBottom: 5,
  },
  guidanceBody: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.dust,
    lineHeight: 18,
  },
  label: {
    fontFamily: font.headlineBlack,
    fontSize: 11,
    color: color.text.secondary,
    marginBottom: 6,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: color.text.primary,
    fontFamily: font.body,
    fontSize: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  goalBlock: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  goalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 999,
    position: "relative",
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.text.primary,
    position: "absolute",
    top: 3,
  },
  goalChips: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  goalChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  showStep: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  showTitle: {
    fontFamily: font.headlineBold,
    fontSize: 20,
    color: color.text.primary,
    textAlign: "center",
  },
  showSub: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.text.secondary,
    textAlign: "center",
  },
  recordBtn: {
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  aiCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    width: "100%",
  },
  previewLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 11,
    color: color.text.secondary,
    marginBottom: 10,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    flexDirection: "row",
    gap: 10,
  },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
})
