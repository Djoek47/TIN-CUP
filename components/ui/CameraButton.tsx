import React, { useState } from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage } from '@/lib/camera'
import { color, space } from '@/theme/tokens'

interface CameraButtonProps {
  onImagePicked?: (imageUri: string) => void
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: string
}

export function CameraButton({
  onImagePicked,
  size = 'medium',
  disabled = false,
  icon = 'camera',
}: CameraButtonProps) {
  const [loading, setLoading] = useState(false)

  const sizeMap = {
    small: { button: 40, icon: 16 },
    medium: { button: 50, icon: 24 },
    large: { button: 60, icon: 28 },
  }

  const sizes = sizeMap[size]

  const handlePress = async () => {
    if (disabled || loading) return

    setLoading(true)
    try {
      const image = await pickImage()
      if (image) {
        onImagePicked?.(image.uri)
      }
    } catch (e) {
      console.log('[v0] Camera button error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        width: sizes.button,
        height: sizes.button,
        borderRadius: sizes.button / 2,
        backgroundColor: pressed ? color.action.primary + '80' : color.action.primary,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={color.text.inverse} size="small" />
      ) : (
        <MaterialCommunityIcons
          name={icon}
          size={sizes.icon}
          color={color.text.inverse}
        />
      )}
    </Pressable>
  )
}
