import { Redirect } from "expo-router"

/** Legacy discover → Vessel home */
export default function DiscoverRedirect() {
  return <Redirect href="/(app)" />
}
