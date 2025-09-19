import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import { supabase } from "../../../lib/supabase" // adjust if needed

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [id, setId] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [heightCm, setHeightCm] = useState<string>("")
  const [weightKg, setWeightKg] = useState<string>("")
  const [childNumber, setChildNumber] = useState<string>("")
  const [dueDate, setDueDate] = useState("")

  // Load profile on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }
        setId(user.id)

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (data) {
          setFullName(data.full_name ?? "")
          setDob(data.date_of_birth ?? "")
          setChildNumber(data.child_number?.toString() ?? "")
          setDueDate(data.due_date ?? "")
          if (data.height_cm != null) setHeightCm(String(data.height_cm))
          if (data.weight_kg != null) setWeightKg(String(data.weight_kg))
        }
      } catch (e: any) {
        Alert.alert("Error", e.message ?? "Failed to load profile")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Save handler
  const onSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      const payload = {
        id,
        full_name: fullName || null,
        date_of_birth: dob || null,
        height_cm: heightCm ? parseInt(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        child_number: childNumber ? parseInt(childNumber) : null,
        due_date: dueDate || null,
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" })

      if (error) throw error

      Alert.alert("Saved", "Your profile has been updated.")
      router.back()
    } catch (e: any) {
      Alert.alert("Save failed", e.message ?? "Unknown error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 self-start bg-gray-200 rounded-full px-4 py-2"
          >
            <Text className="text-slate-700 font-medium">← Back</Text>
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-900 mb-4">
            Edit Profile
          </Text>

          {/* Name */}
          <View className="mb-4">
            <Text className="mb-1 text-slate-600">Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Date of Birth */}
          <View className="mb-4">
            <Text className="mb-1 text-slate-600">Date of Birth</Text>
            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Height */}
          <View className="mb-4">
            <Text className="mb-1 text-slate-600">Height (cm)</Text>
            <TextInput
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="e.g. 170"
              keyboardType="numeric"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Weight */}
          <View className="mb-4">
            <Text className="mb-1 text-slate-600">Weight (kg)</Text>
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="e.g. 68.5"
              keyboardType="numeric"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Child Number */}
          <View className="mb-4">
            <Text className="mb-1 text-slate-600">Child Number</Text>
            <TextInput
              value={childNumber}
              onChangeText={setChildNumber}
              placeholder="e.g. 1"
              keyboardType="numeric"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Due Date */}
          <View className="mb-6">
            <Text className="mb-1 text-slate-600">Due Date</Text>
            <TextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              className="border border-slate-300 rounded-xl px-3 py-2"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={onSave}
            disabled={saving}
            className={`mt-2 rounded-2xl ${
              saving ? "bg-blue-300" : "bg-blue-600"
            } py-3 items-center`}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Save Profile
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
