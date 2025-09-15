import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from "expo-router"

export default function SignIn() {
  return (
    <SafeAreaView className="flex-1 bg-primary-500 px-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-white mb-8">
          Sign In
        </Text>

        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#CED1DD"
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 font-Jakarta"
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#CED1DD"
          secureTextEntry
          className="w-full bg-white rounded-xl px-4 py-3 mb-6 font-Jakarta"
        />

        {/* Sign In Button */}
        <TouchableOpacity className="w-full bg-white py-3 rounded-2xl mb-4">
          <Text className="font-JakartaSemiBold text-primary-500 text-center">
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Link to Sign Up */}
        <Text className="text-white text-center font-Jakarta">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-warning-300 font-JakartaSemiBold">
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
