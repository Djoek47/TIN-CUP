import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"

export async function requestCameraPermission() {
  try {
    // Prefer expo-camera (AVFoundation) when available on native
    try {
      const cam = require("expo-camera") as typeof import("expo-camera")
      const api = cam.Camera
      const cur = await api.getCameraPermissionsAsync()
      if (cur.granted) return true
      const next = await api.requestCameraPermissionsAsync()
      return next.granted
    } catch {
      /* fall through to image-picker */
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status === "granted"
  } catch (e) {
    console.warn("[camera] permission", e)
    return false
  }
}

export async function requestPhotoLibraryPermission() {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === "granted"
  } catch (e) {
    console.warn("[camera] library permission", e)
    return false
  }
}

export async function launchCamera() {
  try {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert("Permission Required", "Camera access is required to take photos")
      return null
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets?.[0]) return result.assets[0]
    return null
  } catch (e) {
    console.warn("[camera] launch", e)
    Alert.alert("Error", "Failed to launch camera")
    return null
  }
}

export async function launchPhotoLibrary() {
  try {
    const hasPermission = await requestPhotoLibraryPermission()
    if (!hasPermission) {
      Alert.alert("Permission Required", "Photo library access is required")
      return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets?.[0]) return result.assets[0]
    return null
  } catch (e) {
    console.warn("[camera] library", e)
    Alert.alert("Error", "Failed to open photo library")
    return null
  }
}

export async function pickImage() {
  return new Promise<ImagePicker.ImagePickerAsset | null>((resolve) => {
    Alert.alert("Choose Photo Source", "Where would you like to get your photo?", [
      { text: "Camera", onPress: async () => resolve(await launchCamera()) },
      { text: "Photo Library", onPress: async () => resolve(await launchPhotoLibrary()) },
      { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
    ])
  })
}

export async function launchVideoCamera() {
  try {
    const ok = await requestCameraPermission()
    if (!ok) {
      Alert.alert("Permission Required", "Camera access is required to record")
      return null
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      quality: 0.7,
      videoMaxDuration: 60,
    })
    if (!result.canceled && result.assets?.[0]) return result.assets[0]
    return null
  } catch (e) {
    console.warn("[camera] video", e)
    Alert.alert("Error", "Failed to open video camera")
    return null
  }
}

export async function uploadImageToSupabase(
  uri: string,
  bucket: string,
  path: string,
  client: { storage: any },
): Promise<string | null> {
  try {
    const response = await fetch(uri)
    const blob = await response.blob()
    const { error } = await client.storage.from(bucket).upload(path, blob, {
      cacheControl: "3600",
      upsert: true,
    })
    if (error) throw error
    const { data: publicData } = client.storage.from(bucket).getPublicUrl(path)
    return publicData.publicUrl as string
  } catch (e) {
    console.warn("[camera] upload", e)
    return null
  }
}
