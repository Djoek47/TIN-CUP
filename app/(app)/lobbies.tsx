import { Redirect } from "expo-router"

/** Legacy lobbies → Vessel arena */
export default function LobbiesRedirect() {
  return <Redirect href="/(app)/arena" />
}
