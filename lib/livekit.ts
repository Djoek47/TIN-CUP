/**
 * @deprecated LiveKit is not used. Live video uses Apple camera via expo-camera.
 * Kept as no-op stubs so old imports do not break.
 */
export function livekitConfigured(): boolean {
  return false
}

export function livekitUrl(): string | null {
  return null
}

export async function fetchLiveToken(_room: string, _identity: string): Promise<string | null> {
  return null
}
