import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, Link } from "expo-router"
import { supabase } from "../../lib/supabase"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const afterLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check onboarding flag
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (!profile || !profile.onboarding_complete) {
      router.replace("/(auth)/(onboarding)/enter_info")
    } else {
      router.replace("/(root)/(tabs)/checkin")
    }
  }

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email")
      return false
    }
    setErrorMessage("")
    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    // Go to welcome screen first
    router.replace("/(auth)/(onboarding)/welcome")
  }

  const handleDemoSignIn = async () => {
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

    await afterLogin()
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <Text className="text-4xl font-JakartaExtraBold text-white mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-neutral-100 font-Jakarta text-center mb-8">
          Sign in to track your nutrition
        </Text>

        {/* Email */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#CED1DD"
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 font-Jakarta text-neutral-800"
        />

        {/* Password */}
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#CED1DD"
          secureTextEntry
          className="w-full bg-white rounded-xl px-4 py-3 mb-2 font-Jakarta text-neutral-800"
        />

        {/* Error */}
        {errorMessage ? (
          <Text className="text-danger-500 text-center mb-3 font-Jakarta">
            {errorMessage}
          </Text>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className={`w-full py-3 rounded-2xl mb-4 ${
            loading ? "bg-neutral-300" : "bg-white"
          }`}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-JakartaSemiBold text-primary-500 text-center">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Demo Account Button */}
        <TouchableOpacity
          onPress={handleDemoSignIn}
          disabled={loading}
          className="w-full border border-white/70 py-3 rounded-2xl mb-8"
        >
          <Text className="font-JakartaSemiBold text-white text-center">
            Use Demo Account
          </Text>
        </TouchableOpacity>

        {/* Switch to Sign Up */}
        <Text className="text-white text-center font-Jakarta">
          Don’t have an account?{" "}
          <Link
            href="/(auth)/sign-up"
            className="text-warning-500 font-JakartaSemiBold"
          >
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
