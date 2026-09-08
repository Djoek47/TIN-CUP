/**
 * Live video helper — LiveKit when configured, else camera/placeholder.
 * Secrets never required in the client for MVP; token URL is optional.
 */
export function livekitConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_LIVEKIT_URL ?? ""
  return Boolean(url) && !url.includes("your_")
}

export function livekitUrl(): string | null {
  return livekitConfigured() ? (process.env.EXPO_PUBLIC_LIVEKIT_URL as string) : null
}

/** Tonight: token endpoint optional. Without it, UI uses camera fallback. */
export async function fetchLiveToken(room: string, identity: string): Promise<string | null> {
  const endpoint = process.env.EXPO_PUBLIC_LIVEKIT_TOKEN_URL
  if (!endpoint || !livekitConfigured()) return null
  try {
    const res = await fetch(`${endpoint}?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.token ?? null
  } catch {
    return null
  }
}
