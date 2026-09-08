import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard"
import { Alert } from "react-native"

// Base URL for deep links (update with your domain)
const DEEP_LINK_BASE = "tincup://app"
const WEB_BASE = "https://tincup.app" // Update with your deployed domain

export interface ShareOptions {
  title?: string
  message: string
  url?: string
  type?: "text/plain" | "text/uri-list"
}

// Generate deep link for a beg
export function generateBegDeepLink(begId: string): string {
  return `${DEEP_LINK_BASE}/beg/${begId}`
}

// Generate deep link for a profile
export function generateProfileDeepLink(walletAddress: string): string {
  return `${DEEP_LINK_BASE}/profile/${walletAddress}`
}

// Generate shareable message for a beg
export function generateBegShareMessage(title: string, begId: string): string {
  const deepLink = generateBegDeepLink(begId)
  return `Check out this beg on Tin Cup: "${title}"\n\n${deepLink}`
}

// Generate shareable message for a profile
export function generateProfileShareMessage(displayName: string, walletAddress: string): string {
  const deepLink = generateProfileDeepLink(walletAddress)
  return `Follow ${displayName} on Tin Cup\n\n${deepLink}`
}

// Share to social/email using native share
export async function shareViaNative(options: ShareOptions): Promise<boolean> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync()
    if (!isAvailable) {
      Alert.alert("Sharing", "Sharing is not available on this device")
      return false
    }

    // Use native share
    await Sharing.shareAsync(options.message, {
      mimeType: options.type || "text/plain",
      ...(options.title && { title: options.title }),
    })

    return true
  } catch (error) {
    console.log("[v0] Share error:", error)
    return false
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text)
    Alert.alert("Copied", "Link copied to clipboard!")
    return true
  } catch (error) {
    console.log("[v0] Clipboard error:", error)
    Alert.alert("Error", "Failed to copy to clipboard")
    return false
  }
}

// Share specific types
export async function shareBeg(title: string, begId: string): Promise<boolean> {
  const message = generateBegShareMessage(title, begId)
  return shareViaNative({
    title: `Share: ${title}`,
    message,
  })
}

export async function shareProfile(displayName: string, walletAddress: string): Promise<boolean> {
  const message = generateProfileShareMessage(displayName, walletAddress)
  return shareViaNative({
    title: `Share: ${displayName}`,
    message,
  })
}

export async function copyBegLink(begId: string): Promise<boolean> {
  const link = generateBegDeepLink(begId)
  return copyToClipboard(link)
}

export async function copyProfileLink(walletAddress: string): Promise<boolean> {
  const link = generateProfileDeepLink(walletAddress)
  return copyToClipboard(link)
}

// Generate Twitter/X share intent URL
export function getTwitterShareUrl(text: string, url?: string): string {
  const encodedText = encodeURIComponent(text)
  const baseUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
  return url ? `${baseUrl}&url=${encodeURIComponent(url)}` : baseUrl
}

// Generate Facebook share intent URL
export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

// Generate WhatsApp share intent URL
export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// Generate email share intent URL
export function getEmailShareUrl(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Build complete share payload
export function buildSharePayload(type: "beg" | "profile", data: any) {
  if (type === "beg") {
    return {
      title: `Check out: ${data.title}`,
      message: generateBegShareMessage(data.title, data.id),
      deepLink: generateBegDeepLink(data.id),
    }
  } else {
    return {
      title: `Follow: ${data.displayName}`,
      message: generateProfileShareMessage(data.displayName, data.id),
      deepLink: generateProfileDeepLink(data.id),
    }
  }
}
