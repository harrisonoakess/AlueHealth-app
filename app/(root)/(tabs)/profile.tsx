import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link, router } from "expo-router"
import { supabase } from "../../../lib/supabase"  // ✅ fixed path

export default function ProfileView() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
      setProfile(data)
      setLoading(false)
    })()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.replace("/(auth)/sign-in")
    } catch (e: any) {
      Alert.alert("Logout failed", e.message ?? "Unknown error")
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 flex-1">
        <Text className="text-2xl font-bold mb-6">My Profile</Text>

        {profile ? (
          <>
            <Text className="mb-2">Name: {profile.full_name}</Text>
            <Text className="mb-2">Date of Birth: {profile.date_of_birth}</Text>
            <Text className="mb-2">Height: {profile.height_cm} cm</Text>
            <Text className="mb-2">Weight: {profile.weight_kg} kg</Text>
            <Text className="mb-2">Child Number: {profile.child_number}</Text>
            <Text className="mb-2">Due Date: {profile.due_date}</Text>
          </>
        ) : (
          <Text className="text-slate-500 mb-4">No profile info yet.</Text>
        )}
      </View>

      {/* Edit Profile Bar */}
      <Link href="/other_screens/profile/edit_profile" asChild>
        <TouchableOpacity className="bg-blue-600 py-4 items-center">
          <Text className="text-white font-semibold text-lg">
            {profile ? "Edit My Profile" : "Create Profile"}
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Give Feedback Bar (placeholder, no action) */}
      <TouchableOpacity
        onPress={() => Alert.alert("Feedback", "Feedback form coming soon!")}
        className="bg-green-600 py-4 items-center"
      >
        <Text className="text-white font-semibold text-lg">Give Feedback</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 py-4 items-center"
      >
        <Text className="text-white font-semibold text-lg">Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
