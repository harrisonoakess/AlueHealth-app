import { View, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-6">Welcome!</Text>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/(onboarding)/enter_info")}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
