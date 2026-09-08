import * as ImagePicker from 'expo-image-picker'
import * as Camera from 'expo-camera'
import { Alert } from 'react-native'

/**
 * Request camera permission and return status
 */
export async function requestCameraPermission() {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync()
    return status === 'granted'
  } catch (e) {
    console.log('[v0] Camera permission error:', e)
    return false
  }
}

/**
 * Request photo library permission and return status
 */
export async function requestPhotoLibraryPermission() {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === 'granted'
  } catch (e) {
    console.log('[v0] Photo library permission error:', e)
    return false
  }
}

/**
 * Launch camera to take a photo
 */
export async function launchCamera() {
  try {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera access is required to take photos')
      return null
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.cancelled) {
      return result.assets[0]
    }
    return null
  } catch (e) {
    console.log('[v0] Camera launch error:', e)
    Alert.alert('Error', 'Failed to launch camera')
    return null
  }
}

/**
 * Launch photo library to pick an image
 */
export async function launchPhotoLibrary() {
  try {
    const hasPermission = await requestPhotoLibraryPermission()
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Photo library access is required')
      return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.cancelled) {
      return result.assets[0]
    }
    return null
  } catch (e) {
    console.log('[v0] Photo library launch error:', e)
    Alert.alert('Error', 'Failed to open photo library')
    return null
  }
}

/**
 * Show action sheet to pick camera or library
 */
export async function pickImage() {
  return new Promise<any>((resolve) => {
    Alert.alert(
      'Choose Photo Source',
      'Where would you like to get your photo?',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await launchCamera()
            resolve(result)
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const result = await launchPhotoLibrary()
            resolve(result)
          },
        },
        {
          text: 'Cancel',
          onPress: () => resolve(null),
          style: 'cancel',
        },
      ]
    )
  })
}

/**
 * Convert image URI to base64
 */
export async function imageToBase64(uri: string): Promise<string> {
  try {
    const response = await fetch(uri)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.log('[v0] Image to base64 error:', e)
    throw e
  }
}

/**
 * Upload image to Supabase storage
 */
export async function uploadImageToSupabase(
  uri: string,
  bucket: string,
  path: string,
  supabase: any
): Promise<string | null> {
  try {
    const response = await fetch(uri)
    const blob = await response.blob()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) throw error

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return publicData.publicUrl
  } catch (e) {
    console.log('[v0] Upload to Supabase error:', e)
    return null
  }
}
