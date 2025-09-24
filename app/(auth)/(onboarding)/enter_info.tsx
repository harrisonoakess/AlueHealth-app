import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { supabase } from "../../../lib/supabase"
import { router } from "expo-router"

export default function EnterInfo() {
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user logged in")

      // Validate DOB string → must match YYYY-MM-DD
      let dobValue: string | null = null
      if (dob) {
        const regex = /^\d{4}-\d{2}-\d{2}$/
        if (!regex.test(dob)) {
          Alert.alert("Error", "Please enter date as YYYY-MM-DD")
          setSaving(false)
          return
        }
        dobValue = dob
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          date_of_birth: dobValue,
          onboarding_complete: true, // ✅ mark onboarding complete
        })
        .eq("id", user.id)

      if (error) throw error

      router.replace("/(root)/(tabs)/home")
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to save info")
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Tell us about you</Text>

      {/* Full Name */}
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
        className="border p-3 mb-4 rounded-lg"
      />

      {/* Manual DOB */}
      <TextInput
        value={dob}
        onChangeText={setDob}
        placeholder="YYYY-MM-DD"
        className="border p-3 mb-6 rounded-lg"
      />

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        className={`py-3 rounded-xl ${saving ? "bg-blue-300" : "bg-blue-600"}`}
      >
        <Text className="text-white font-semibold text-center">
          {saving ? "Saving..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
