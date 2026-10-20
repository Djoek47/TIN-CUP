import { Redirect } from "expo-router"

/** Legacy Gulch feed → Vessel home */
export default function FeedRedirect() {
  return <Redirect href="/(app)" />
}
