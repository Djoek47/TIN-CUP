import { useState } from "react"
import { ScrollView, View, TextInput, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  ImageSlot,
  Label,
  UiText,
  Hairline,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { font, space } from "@/theme/vessel"

export default function EditProfileScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { user, updateUser, say } = useApp()
  const [displayName, setDisplayName] = useState(user.displayName)
  const [handle, setHandle] = useState(user.handle)
  const [bio, setBio] = useState(user.bio)
  const [location, setLocation] = useState(user.location)
  const [link, setLink] = useState(user.link)

  const save = () => {
    updateUser({
      displayName: displayName.trim() || user.displayName,
      handle: handle.replace(/^@/, "").trim() || user.handle,
      bio: bio.slice(0, 80),
      location: location.trim(),
      link: link.trim(),
    })
    say("Profile saved")
    router.back()
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader
        title="Edit Profile"
        onBack={() => router.back()}
        right={
          <Pressable onPress={save}>
            <Label style={{ color: v.amb }}>SAVE</Label>
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <View style={{ width: 88 }}>
            <ImageSlot label={displayName.slice(0, 1).toUpperCase() || "M"} height={88} radius={44} />
          </View>
          <Label style={{ marginTop: 10, color: v.amb }}>CHANGE PHOTO</Label>
        </View>

        <Field label="DISPLAY NAME" value={displayName} onChange={setDisplayName} />
        <Field label="HANDLE" value={handle} onChange={setHandle} prefix="@" hint="AVAILABLE" />
        <Field
          label="BIO"
          value={bio}
          onChange={(t) => setBio(t.slice(0, 80))}
          multiline
          hint={`${bio.length}/80`}
        />
        <Field label="LOCATION" value={location} onChange={setLocation} />
        <Field label="LINK" value={link} onChange={setLink} />

        <View style={{ marginTop: 28, marginBottom: 24 }}>
          <PrimaryButton title="SAVE CHANGES" onPress={save} />
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

function Field({
  label,
  value,
  onChange,
  prefix,
  hint,
  multiline,
}: {
  label: string
  value: string
  onChange: (t: string) => void
  prefix?: string
  hint?: string
  multiline?: boolean
}) {
  const { v } = useVessel()
  return (
    <View style={{ marginTop: space.sectionGap - 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Label>{label}</Label>
        {hint ? <Label style={{ color: v.lim }}>{hint}</Label> : null}
      </View>
      <Hairline />
      <View style={{ flexDirection: "row", alignItems: multiline ? "flex-start" : "center", paddingVertical: 12 }}>
        {prefix ? <UiText style={{ marginRight: 4, color: v.dim }}>{prefix}</UiText> : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          placeholderTextColor={v.faint}
          style={{
            flex: 1,
            color: v.ink,
            fontFamily: font.uiSemi,
            fontSize: 15,
            minHeight: multiline ? 72 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          }}
        />
      </View>
    </View>
  )
}
