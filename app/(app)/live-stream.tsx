import { Redirect } from "expo-router"

/** Legacy live-stream → Vessel live */
export default function LiveStreamRedirect() {
  return <Redirect href="/(app)/live" />
}
