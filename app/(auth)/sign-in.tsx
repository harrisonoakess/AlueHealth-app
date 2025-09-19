import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, Link } from "expo-router"
import { supabase } from "../../lib/supabase"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setErrorMessage("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    router.replace("/(root)/(tabs)/home")
  }

  const handleSkipLogin = async () => {
    setErrorMessage("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: "xorej44434@camjoint.com",
      password: "password",
    })

    setLoading(false)
    if (error) {
      setErrorMessage(error.message)
      return
    }
    router.replace("/(root)/(tabs)/home")
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-500 px-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-white mb-8">
          Sign In
        </Text>

        {/* Email */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#CED1DD"
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 font-Jakarta"
        />

        {/* Password */}
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#CED1DD"
          secureTextEntry
          className="w-full bg-white rounded-xl px-4 py-3 mb-6 font-Jakarta"
        />

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className={`w-full py-3 rounded-2xl mb-3 ${loading ? "bg-white/80" : "bg-white"}`}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-JakartaSemiBold text-primary-500 text-center">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Skip Login (Test Account) */}
        <TouchableOpacity
          onPress={handleSkipLogin}
          disabled={loading}
          className="w-full border border-white/70 py-3 rounded-2xl mb-6"
        >
          <Text className="font-JakartaSemiBold text-white text-center">
            Skip login (use test account)
          </Text>
        </TouchableOpacity>

        {/* Error Message */}
        {errorMessage ? (
          <Text className="text-red-300 text-center mb-3">{errorMessage}</Text>
        ) : null}

        {/* Link to Sign Up */}
        <Text className="text-white text-center font-Jakarta">
          Don’t have an account?{" "}
          <Link href="/(auth)/sign-up" className="text-warning-300 font-JakartaSemiBold">
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
