import { Redirect, useLocalSearchParams } from "expo-router"

/** Deep link obol://live/:handle → live viewer. */
export default function LiveDeepLink() {
  const { handle } = useLocalSearchParams<{ handle?: string }>()
  return <Redirect href={{ pathname: "/(app)/live", params: { host: handle || "" } }} />
}
