import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, Link } from "expo-router"
import { supabase } from "../../lib/supabase"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setErrorMessage("")

    // ✅ simple validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    // ✅ Get user explicitly
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("profiles").insert({
        id: user.id,
        full_name: null,
        date_of_birth: null,
        height_cm: null,
        weight_kg: null,
        child_number: null,
        due_date: null,
        onboarding_complete: false,
      })
    }

    // ✅ Redirect to Welcome
    router.replace("/(auth)/(onboarding)/welcome")
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <Text className="text-4xl font-JakartaExtraBold text-white mb-2 text-center">
          Create Account
        </Text>
        <Text className="text-neutral-100 font-Jakarta text-center mb-8">
          Join us to start tracking your nutrition
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
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 font-Jakarta text-neutral-800"
        />

        {/* Confirm Password */}
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
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

        {/* Sign Up button */}
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className={`w-full py-3 rounded-2xl mb-6 ${
            loading ? "bg-neutral-300" : "bg-white"
          }`}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-JakartaSemiBold text-primary-500 text-center">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Already have account */}
        <Text className="text-white text-center font-Jakarta">
          Already have an account?{" "}
          <Link
            href="/(auth)/sign-in"
            className="text-warning-500 font-JakartaSemiBold"
          >
            Sign In
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
