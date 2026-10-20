import { Redirect, useLocalSearchParams } from "expo-router"

/** Deep link obol://profile/:handle → profile (self for now). */
export default function ProfileDeepLink() {
  useLocalSearchParams<{ handle?: string }>()
  return <Redirect href="/(app)/profile" />
}
